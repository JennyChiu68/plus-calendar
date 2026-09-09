"""Fetch public metadata only. No login, paywall bypass or browser automation.
Writes data/calendar.json only after every automated source parses successfully.
Manual entries require separate official-source review; running this script does not renew them.
"""
from pathlib import Path
from html.parser import HTMLParser
from datetime import datetime, timezone
import argparse, concurrent.futures, hashlib, html, json, re, subprocess, sys
ROOT=Path(__file__).resolve().parent.parent
class PageText(HTMLParser):
 def __init__(self):super().__init__();self.parts=[];self.hidden=0
 def handle_starttag(self,t,a):
  if t in ('script','style'):self.hidden+=1
 def handle_endtag(self,t):
  if t in ('script','style'):self.hidden=max(0,self.hidden-1)
 def handle_data(self,d):
  if not self.hidden:self.parts.append(d)
def plain(raw):
 p=PageText();p.feed(raw);return re.sub(r'\s+',' ',html.unescape(' '.join(p.parts))).strip()
def match(pattern,text):
 m=re.search(pattern,text,re.I)
 if not m:raise ValueError('Date evidence no longer matches; review source before publishing')
 return m
MONTHS={x.lower():i+1 for i,x in enumerate(['January','February','March','April','May','June','July','August','September','October','November','December'])}
def dt(y,m,d):return datetime(int(y),int(m),int(d)).date().isoformat()
def extract(source,raw):
 text=re.sub(r'20(\d)\s+(\d)', r'20\1\2', plain(raw));out=[]
 if source['adapter']=='eia-table':
  rows=re.findall(r'([A-Za-z]+) (202[6-9])\s+(\d{2})/(\d{2})/(\d{4})',text)
  if not rows:raise ValueError('No release rows found')
  for mon,y,m,d,year in rows:
   date=dt(year,m,d)
   if not '2026-09-01'<=date<='2027-01-31':continue
   out.append(dict(id=f'eia-steo-{y}-{MONTHS[mon.lower()]:02}',title=f'EIA {int(m)} 月短期能源展望发布',date=date,topics=['能源与电力'],kind='事件',region='美国',summary='美国能源信息署发布月度能源供需展望。',timeNote='日期为官方报告日（美国当地日期）；未提供本期确定发布时间。',evidence=f'{mon} {y} {m}/{d}/{year}'))
 elif source['adapter']=='ras-jsonld':
  mapping=source['events']
  for block in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',raw,re.S):
   items=json.loads(block)
   if not isinstance(items,list):continue
   for item in items:
    for key,meta in mapping.items():
     if not item.get('name','').endswith('('+key+')'):continue
     e=dict(meta);e.update(date=item['startDate'][:10],endDate=item['endDate'][:10],url=item['url'],allDay=True,evidence=f"{item['startDate'][:10]} / {item['endDate'][:10]}")
     out.append(e)
  if len(out)!=len(mapping):raise ValueError('Expected conference entries missing')
 else:
  for spec in source['events']:
   e={k:v for k,v in spec.items() if k not in ('pattern','requires','dateDefaults')}
   for required in spec.get('requires',[]):match(required,text)
   m=match(spec['pattern'],text);g={**spec.get('dateDefaults',{}),**m.groupdict()}
   e['date']=dt(g['y'],g['m'],g['d'])
   if g.get('ed'):e['endDate']=dt(g.get('ey') or g['y'],g.get('em') or g['m'],g['ed'])
   e['evidence']=m.group(0)[:220]
   out.append(e)
 for e in out:
  e.update(sourceId=source['id'],source=source['name'],url=e.get('url',source['url']),status='已确认',real=True,checkedAt=source['checkedAt'],acquisition='automated',sourceHash=source['hash'])
 return out

def validate(events):
 ids=set()
 for e in events:
  if e['id'] in ids:raise ValueError('Duplicate event id: '+e['id'])
  ids.add(e['id']);datetime.strptime(e['date'],'%Y-%m-%d')
  if e.get('endDate') and e['endDate']<e['date']:raise ValueError('End before start')
  if not e.get('url','').startswith('https://') or not e.get('evidence') or not e.get('checkedAt'):raise ValueError('Missing source evidence')
  if not e.get('real') or not e.get('topics'):raise ValueError('Unverified or unclassified event')
  if e.get('time') and not re.fullmatch(r'\d{2}:\d{2}',e['time']):raise ValueError('Invalid time')

def main():
 parser=argparse.ArgumentParser();parser.add_argument('--cache-dir');parser.add_argument('--output',default=str(ROOT/'data/calendar.json'));args=parser.parse_args()
 specs=json.loads((ROOT/'data/sources.json').read_text());manual=json.loads((ROOT/'data/manual-events.json').read_text())
 now=datetime.now(timezone.utc).isoformat(timespec='seconds');reports=[];events=[]
 def fetch(source):
  source=dict(source)
  try:
   if args.cache_dir:
    cache=Path(args.cache_dir)/(source['cacheKey']+'.html');raw=cache.read_text();checked=datetime.fromtimestamp(cache.stat().st_mtime,timezone.utc).isoformat(timespec='seconds')
   else:
    r=subprocess.run(['curl','--fail','--location','--silent','--show-error','--max-time','35','--retry','1','--proto','=https','--proto-redir','=https','--user-agent','Mozilla/5.0 (compatible; CalendarResearch/1.0)',source['url']],capture_output=True,check=True)
    raw=r.stdout.decode('utf-8');checked=datetime.now(timezone.utc).isoformat(timespec='seconds')
   if len(raw)<200:raise ValueError('Empty response')
   source['hash']=hashlib.sha256(raw.encode()).hexdigest();source['checkedAt']=checked
   rows=extract(source,raw)
   return rows,dict(id=source['id'],name=source['name'],url=source['url'],mode='automated',checkedAt=checked,count=len(rows),status='ok',hash=source['hash'])
  except Exception as e:return [],dict(id=source['id'],name=source['name'],url=source['url'],mode='automated',status='error',error=str(e)[:250],count=0)
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
  for rows,report in ex.map(fetch,specs):events+=rows;reports.append(report);print(report['id'],report['status'],len(rows),report.get('error',''),flush=True)
 failed=[r for r in reports if r['status']=='error']
 (ROOT/'data/sync-report.json').write_text(json.dumps(dict(attemptedAt=now,sources=reports,datasetWritten=False),ensure_ascii=False,indent=2)+'\n')
 if failed:sys.exit('Source errors: existing public dataset remains unchanged.')
 events+=manual['events'];reports+=manual['sources'];validate(events)
 events.sort(key=lambda e:(e['date'],e.get('time','99:99'),e['id']))
 result=dict(updatedAt=now,coverageStart=min(e['date'] for e in events),coverageEnd=max(e.get('endDate',e['date']) for e in events),updateMode='发布时采集；部分来源人工核对，尚未启用定时更新',sources=reports,events=events)
 out=Path(args.output);temp=out.with_suffix('.tmp');temp.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');temp.replace(out)
 (ROOT/'data/sync-report.json').write_text(json.dumps(dict(attemptedAt=now,sources=reports,datasetWritten=True),ensure_ascii=False,indent=2)+'\n')
 print('Saved',len(events),'events from',len(reports),'source feeds')
if __name__=='__main__':main()
