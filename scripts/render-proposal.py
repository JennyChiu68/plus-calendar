from pathlib import Path
import re,html
root=Path(__file__).resolve().parent.parent
source=root/'docs/PLUS日历完整产品方案.md'
text=source.read_text();lines=text.splitlines();output=[];toc=[];i=0

def inline(t):
    t=html.escape(t)
    t=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',r'<a href="\2">\1</a>',t)
    t=re.sub(r'\*\*(.+?)\*\*',r'<strong>\1</strong>',t)
    t=re.sub(r'`([^`]+)`',r'<code>\1</code>',t)
    return t

while i<len(lines):
    s=lines[i].strip()
    if not s:i+=1;continue
    if s.startswith('#'):
        m=re.match(r'(#{1,6}) (.*)',s);n=len(m[1]);label=m[2];anchor=re.search(r'\s*\{#([^}]+)\}',label)
        slug=anchor[1] if anchor else 'section-'+str(len(toc)+1)
        label=re.sub(r'\s*\{#[^}]+\}','',label)
        if n==2:toc.append((slug,label))
        output.append(f'<h{n} id="{slug}">{inline(label)}</h{n}>');i+=1;continue
    if s.startswith('|'):
        rows=[]
        while i<len(lines) and lines[i].strip().startswith('|'):
            row=[c.strip() for c in lines[i].strip().strip('|').split('|')]
            if not all(re.fullmatch(r'[-: ]+',c) for c in row):rows.append(row)
            i+=1
        table='<div class="table-wrap"><table><thead><tr>'+''.join('<th>'+inline(c)+'</th>' for c in rows[0])+'</tr></thead><tbody>'
        for row in rows[1:]:table+='<tr>'+''.join('<td>'+inline(c)+'</td>' for c in row)+'</tr>'
        output.append(table+'</tbody></table></div>');continue
    match=re.match(r'(- |\d+\. )(.*)',s)
    if match:
        ordered=match[1][0].isdigit();tag='ol' if ordered else 'ul';items=[]
        while i<len(lines):
            m=re.match(r'(- |\d+\. )(.*)',lines[i].strip())
            if not m:break
            items.append('<li>'+inline(m[2])+'</li>');i+=1
        output.append('<'+tag+'>'+''.join(items)+'</'+tag+'>');continue
    para=[s];i+=1
    while i<len(lines) and lines[i].strip() and not re.match(r'[#|]|- |\d+\. ',lines[i].strip()):para.append(lines[i].strip());i+=1
    output.append('<p>'+inline(' '.join(para))+'</p>')
style='''*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:85px}body{margin:0;background:#f2f6fb;color:#34465d;font-family:Arial,"PingFang SC","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.9}header{height:68px;position:sticky;top:0;background:#ffffffed;backdrop-filter:blur(10px);border-bottom:1px solid #dde6f1;z-index:10;display:flex;justify-content:space-between;align-items:center;padding:0 4vw}header a{color:#587fdc;font-weight:600}header span{color:#8ca0b9;font-size:14px}a{color:#387fbe;text-decoration:none}a:hover{text-decoration:underline}header button{font-size:14px;color:#7089ad;border:1px solid #d7e2f1;border-radius:6px;padding:7px 12px;background:white;cursor:pointer}.shell{display:grid;grid-template-columns:230px minmax(0,1100px);gap:40px;max-width:1450px;margin:40px auto;padding:0 30px}nav{position:sticky;top:100px;height:calc(100vh - 125px);overflow:auto;padding-right:15px}nav .label{font-size:12px;letter-spacing:2px;color:#94a5bb;margin-bottom:12px}nav a{display:block;font-size:13px;line-height:1.6;padding:9px 0;color:#748ca9}main{background:white;border:1px solid #e4ecf6;padding:42px 48px 60px;border-radius:12px;min-width:0}h1{font-size:32px;line-height:1.55;margin:0 0 15px;color:#345a85;letter-spacing:.2px}h2{font-size:23px;color:#3f6895;margin:60px 0 24px;padding:20px 0 0;border-top:1px solid #e2eaf4;line-height:1.6}h3{font-size:18px;color:#4e779e;margin:32px 0 17px}p{margin:17px 0}main>p:nth-child(2){font-size:13px;color:#95a6bd}main>p:nth-child(3){background:#eff6fd;border-left:3px solid #5e93d8;padding:20px 24px;font-size:17px;color:#517aa5}strong{font-weight:650;color:#425f80}.table-wrap{overflow-x:auto;border:1px solid #e1eaf5;border-radius:7px;margin:22px 0}table{border-collapse:collapse;width:100%;font-size:14px;line-height:1.75;min-width:670px}th,td{text-align:left;padding:13px 14px;vertical-align:top;border-bottom:1px solid #e9eef6}th{font-weight:600;background:#f0f5fb;color:#6482a7}td{color:#7188a3}tr:last-child td{border-bottom:0}tr:nth-child(even){background:#fbfcfe}td:first-child{font-weight:500;color:#53769e;min-width:105px}li{padding:5px 0 7px 6px;color:#617995}ul,ol{padding-left:22px}code{background:#edf3fa;border-radius:3px;padding:2px 4px;font-size:.9em}.return-link{display:inline-block;background:#547ce4;color:white;border-radius:7px;padding:10px 19px;margin-top:35px}@media(max-width:1000px){.shell{grid-template-columns:1fr;gap:20px;padding:0 18px;margin:20px auto}nav{position:static;height:auto;display:flex;overflow:auto;gap:20px;padding:0 0 12px}nav a{white-space:nowrap}nav .label{display:none}main{padding:30px}h1{font-size:27px}}@media(max-width:600px){header{padding:0 18px}header span{display:none}main{padding:25px 20px}h1{font-size:24px}h2{font-size:21px;margin-top:45px}table{font-size:13px}body{font-size:16px}.shell{padding:0 10px}main>p:nth-child(3){padding:16px;font-size:16px}}@media print{header,nav,.return-link{display:none}.shell{display:block;margin:0;padding:0}main{border:none;padding:0}body{background:white;font-size:11pt;line-height:1.65}h1{font-size:24pt}h2{font-size:16pt;break-after:avoid;margin-top:25px}h3{break-after:avoid;font-size:13pt}.table-wrap{overflow:visible;border:none}table{font-size:9pt;min-width:0}tr{break-inside:avoid}thead{display:table-header-group}a{color:inherit}th,td{padding:7px}@page{size:A4;margin:17mm}}'''
page='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>金十 PLUS 日历 · 完整产品方案</title><style>'+style+'</style></head><body><header><a href="/">← 返回 PLUS 日历 Demo</a><span>产品研究与实施构思 · 2026.09.08</span><button onclick="window.print()">打印 / 保存 PDF</button></header><div class="shell"><nav aria-label="方案目录"><div class="label">PRODUCT PROPOSAL</div>'+''.join(f'<a href="#{a}">{inline(b)}</a>' for a,b in toc)+'</nav><main>'+''.join(output)+'<a class="return-link" href="/">进入交互 Demo →</a></main></div></body></html>'
(root/'public/proposal.html').write_text(page)
(root/'public/PLUS日历完整产品方案.md').write_text(text)
print(f'Generated proposal: {len(toc)} sections, {len(text)} characters, {len(rows)} rows in last table')
