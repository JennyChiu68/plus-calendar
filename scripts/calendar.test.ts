import test from 'node:test';
import assert from 'node:assert/strict';
import {
  events,
  dataset,
  inWeek,
  shiftDate,
  icsForEvent,
  occursOn,
  overlapsRange,
  beijingToday,
  mondayOf,
} from '../lib/calendar.ts';

void test('all public entries have exact dates and traceable official provenance', () => {
  assert.ok(events.length > 0);
  assert.equal(new Set(events.map((e) => e.id)).size, events.length);
  assert.equal(
    dataset.sources.reduce((n, s) => n + s.count, 0),
    events.length,
  );
  for (const e of events) {
    assert.equal(e.real, true);
    assert.match(e.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(e.evidence && e.checkedAt && e.sourceId);
    assert.ok(dataset.sources.some((s) => s.id === e.sourceId));
    assert.match(e.url, /^https:\/\//);
    assert.ok(e.topics.length);
    assert.doesNotMatch(e.title + e.summary, /模拟|示例/);
  }
});
void test('Taipei and US daylight times export as the correct UTC instants', () => {
  const tsmc = events.find((e) => e.id === 'tsmc-2026-08')!;
  assert.match(icsForEvent(tsmc)!, /DTSTART:20260910T053000Z/);
  const sec = events.find((e) => e.id === 'sec-iac-2026-09')!;
  assert.match(icsForEvent(sec)!, /DTSTART:20260910T140000Z/);
  assert.equal(tsmc.actual, undefined);
  assert.equal(tsmc.previous, undefined);
});
void test('multi-day meetings appear in every overlapping range, without duplicate records', () => {
  const e = events.find((e) => e.id === 'iros-2026')!;
  assert.equal(e.date, '2026-09-27');
  assert.equal(e.endDate, '2026-10-01');
  assert.equal(occursOn(e, '2026-09-26'), false);
  assert.equal(occursOn(e, '2026-10-01'), true);
  assert.equal(occursOn(e, '2026-10-02'), false);
  assert.equal(overlapsRange(e, '2026-09-28', '2026-10-04'), true);
  assert.equal(overlapsRange(e, '2026-10-01', '2026-10-31'), true);
  assert.match(icsForEvent(e)!, /DTEND;VALUE=DATE:20261002/);
});
void test('date-only releases do not acquire an invented midnight time', () => {
  const e = events.find((e) => e.id === 'miit-deadline')!;
  assert.equal(e.time, undefined);
  const ics = icsForEvent(e)!;
  assert.match(ics, /DTSTART;VALUE=DATE:20260923/);
  assert.match(ics, /DTEND;VALUE=DATE:20260924/);
  assert.doesNotMatch(ics, /DTSTART:/);
  assert.equal(shiftDate('2026-12-31', 1), '2027-01-01');
});
void test('Beijing today and week rollover are independent of client time zone', () => {
  assert.equal(beijingToday(new Date('2026-09-13T16:01:00Z')), '2026-09-14');
  assert.equal(mondayOf('2026-09-13'), '2026-09-07');
  assert.equal(mondayOf('2026-09-14'), '2026-09-14');
  assert.ok(inWeek('2026-09-13', '2026-09-07'));
  assert.equal(inWeek('2026-09-14', '2026-09-07'), false);
});
void test('ICS uses real titles and folds UTF-8 without corrupting content', () => {
  for (const e of events) {
    const result = icsForEvent(e)!;
    for (const line of result.split('\r\n'))
      assert.ok(Buffer.byteLength(line, 'utf8') <= 75);
    assert.ok(result.replace(/\r\n /g, '').includes(e.title));
    assert.doesNotMatch(result, /日历演示|模拟事件/);
    assert.match(result, /END:VCALENDAR\r\n$/);
  }
});

void test('all expanded topics have at least five real events and no unknown tags', () => {
  const names = [
    'AI与算力',
    '机器人与具身智能',
    '半导体',
    '智能汽车与电池',
    '商业航天',
    '创新药与医疗',
    '量子科技',
    '网络安全',
    '能源与电力',
    '政策与监管',
  ];
  for (const name of names)
    assert.ok(
      events.filter((e) => e.topics.some((t) => t === name)).length >= 5,
      name,
    );
  for (const e of events) assert.ok(e.topics.every((t) => names.includes(t)));
  assert.equal(new Set(events.map((e) => e.id)).size, events.length);
});
void test('new US events preserve the Beijing day rollover and November standard time', () => {
  const chip = events.find((e) => e.id === 'genai-chip-2026')!;
  assert.equal(chip.date, '2026-09-11');
  assert.match(icsForEvent(chip)!, /DTSTART:20260910T160000Z/);
  const ash = events.find((e) => e.id === 'ash-abstracts-2026')!;
  assert.match(icsForEvent(ash)!, /DTSTART:20261104T140000Z/);
  const sitc = events.find((e) => e.id === 'sitc-abstracts-2026')!;
  assert.match(icsForEvent(sitc)!, /DTSTART:20261103T140000Z/);
});
