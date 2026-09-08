import test from 'node:test';
import assert from 'node:assert/strict';
import { events, inWeek, shiftDate, icsForEvent } from '../lib/calendar.ts';

test('windows never become timed calendar entries', () => {
  for (const e of events.filter((e) => e.status === '待确认')) {
    assert.equal(icsForEvent(e), null);
    assert.equal(inWeek(e.date, '2026-09-07'), false);
    assert.equal(e.time, undefined);
  }
});
test('time conversion preserves the official Taipei / Shanghai instant', () => {
  const item = events.find((e) => e.id === 'tsmc-0826')!;
  const ics = icsForEvent(item)!;
  assert.match(ics, /DTSTART:20260910T053000Z/);
  assert.match(ics, /SUMMARY:\[日历演示\]/);
  assert.equal(item.previous, '467,580');
  assert.equal(item.actual, undefined);
});
test('all-day export uses exclusive end dates, including month and year rollover', () => {
  const base = events.find((e) => e.id === 'robot-standard')!;
  const ics = icsForEvent({ ...base, date: '2026-12-31' })!;
  assert.match(ics, /DTSTART;VALUE=DATE:20261231/);
  assert.match(ics, /DTEND;VALUE=DATE:20270101/);
  assert.equal(shiftDate('2026-09-30', 1), '2026-10-01');
});
test('calendar export folds UTF-8 lines safely without corrupting text', () => {
  for (const e of events) {
    const result = icsForEvent(e);
    if (!result) continue;
    for (const line of result.split('\r\n'))
      assert.ok(Buffer.byteLength(line, 'utf8') <= 75);
    assert.ok(result.replace(/\r\n /g, '').includes(e.title));
    assert.match(result, /END:VCALENDAR\r\n$/);
  }
});
test('one canonical event per ID and explicit sample provenance', () => {
  assert.equal(new Set(events.map((e) => e.id)).size, events.length);
  assert.equal(events.filter((e) => e.real).length, 1);
  for (const e of events) {
    assert.ok(e.source);
    assert.match(e.url, /^https:\/\//);
    assert.ok(e.topics.length);
    if (!e.real) assert.ok(e.source.includes('演示'));
  }
});
test('week selection is inclusive at start and exclusive at next week', () => {
  assert.ok(inWeek('2026-09-07', '2026-09-07'));
  assert.ok(inWeek('2026-09-13', '2026-09-07'));
  assert.equal(inWeek('2026-09-14', '2026-09-07'), false);
});
