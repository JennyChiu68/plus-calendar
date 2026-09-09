import importlib.util,json,unittest,subprocess,tempfile
from pathlib import Path
spec=importlib.util.spec_from_file_location('sync',Path(__file__).with_name('sync-calendar.py'));sync=importlib.util.module_from_spec(spec);spec.loader.exec_module(sync)
class ImportTests(unittest.TestCase):
 def test_deadline_uses_end_of_notice_period(self):
  source=next(s for s in json.loads((sync.ROOT/'data/sources.json').read_text()) if s['id']=='miit');source.update(checkedAt='2026-09-09T00:00:00Z',hash='test')
  rows=sync.extract(source,'<p>公示时间：2026年8月25日—2026年9月23日</p>')
  self.assertEqual(rows[0]['date'],'2026-09-23')
 def test_changed_source_stops_extraction(self):
  source=next(s for s in json.loads((sync.ROOT/'data/sources.json').read_text()) if s['id']=='miit')
  with self.assertRaises(ValueError):sync.extract(source,'<p>公告已撤回</p>')
 def test_duplicate_ids_are_rejected(self):
  e=json.loads((sync.ROOT/'data/calendar.json').read_text())['events'][0]
  with self.assertRaises(ValueError):sync.validate([e,e])
 def test_missing_source_preserves_existing_dataset(self):
  report=sync.ROOT/'data/sync-report.json';original=report.read_bytes()
  try:
   with tempfile.TemporaryDirectory() as folder:
    output=Path(folder)/'calendar.json';output.write_text('existing-data')
    result=subprocess.run(['python3',str(sync.ROOT/'scripts/sync-calendar.py'),'--cache-dir',folder,'--output',str(output)],capture_output=True)
    self.assertNotEqual(result.returncode,0);self.assertEqual(output.read_text(),'existing-data')
  finally:report.write_bytes(original)
if __name__=='__main__':unittest.main()
