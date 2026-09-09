import calendarData from '../data/calendar.json' with { type: 'json' };
export type Topic =
  | 'AI与算力'
  | '机器人与具身智能'
  | '半导体'
  | '智能汽车与电池'
  | '商业航天'
  | '创新药与医疗'
  | '量子科技'
  | '网络安全'
  | '能源与电力'
  | '政策与监管';
export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time?: string;
  endDate?: string;
  allDay?: boolean;
  sourceId: string;
  checkedAt: string;
  acquisition: 'manual' | 'automated';
  evidence: string;
  timeNote?: string;
  sourceNote?: string;
  changeSourceUrl?: string;
  topics: Topic[];
  kind: '指标' | '事件' | '政策';
  status: '已确认' | '已公布' | '已改期' | '待确认';
  region: string;
  source: string;
  url: string;
  real?: boolean;
  summary: string;
  previous?: string;
  actual?: string;
  unit?: string;
  period?: string;
  oldDate?: string;
};
export const topics: Topic[] = [
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
export const dataset = calendarData;
export const events = calendarData.events as CalendarEvent[];
export function beijingToday(at = new Date()) {
  return new Date(at.getTime() + 8 * 3600000).toISOString().slice(0, 10);
}
export function mondayOf(date: string) {
  return shiftDate(
    date,
    -((new Date(date + 'T00:00:00Z').getUTCDay() + 6) % 7),
  );
}
export function occursOn(event: CalendarEvent, date: string) {
  return event.date <= date && (event.endDate || event.date) >= date;
}
export function overlapsRange(
  event: CalendarEvent,
  start: string,
  end: string,
) {
  return event.date <= end && (event.endDate || event.date) >= start;
}

export function inWeek(date: string, start: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    date >= start &&
    date < shiftDate(start, 7)
  );
}
export function shiftDate(date: string, days: number) {
  const d = new Date(date + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function icsForEvent(event: CalendarEvent): string | null {
  if (event.status === '待确认') return null;
  const escape = (s: string) =>
    s
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  const utc = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  const timing = event.time
    ? [`DTSTART:${utc(new Date(event.date + 'T' + event.time + ':00+08:00'))}`]
    : [
        `DTSTART;VALUE=DATE:${event.date.replaceAll('-', '')}`,
        `DTEND;VALUE=DATE:${shiftDate(event.endDate || event.date, 1).replaceAll('-', '')}`,
      ];
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jin10 PLUS Calendar//ZH',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@plus-calendar`,
    `DTSTAMP:${utc(new Date(event.checkedAt))}`,
    ...timing,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(event.summary + ' ' + (event.timeNote || '日期以主办方当地日程为准。') + ' 来源：' + event.source)}`,
    `URL:${event.url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  // RFC 5545 line folding, measured in UTF-8 octets rather than characters.
  return (
    lines
      .map((line) => {
        let result = '',
          part = '';
        for (const ch of line) {
          if (new TextEncoder().encode(part + ch).length > 73) {
            result += part + '\r\n';
            part = ' ';
          }
          part += ch;
        }
        return result + part;
      })
      .join('\r\n') + '\r\n'
  );
}
