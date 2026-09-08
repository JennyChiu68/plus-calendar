export type Topic = 'AI与算力' | '人形机器人' | '政策与监管' | '能源与电力';
export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time?: string;
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
  '人形机器人',
  '政策与监管',
  '能源与电力',
];
export const events: CalendarEvent[] = [
  {
    id: 'tsmc-0826',
    title: '台积电 8 月营收报告',
    date: '2026-09-10',
    time: '13:30',
    topics: ['AI与算力'],
    kind: '指标',
    status: '已确认',
    region: '中国台湾',
    source: '台积电投资者关系',
    url: 'https://investor.tsmc.com/chinese/financial-calendar',
    real: true,
    summary: '发布 2026 年 8 月合并营收，统计范围涵盖公司各类终端业务。',
    previous: '467,580',
    unit: '百万新台币',
    period: '2026年8月',
  },
  {
    id: 'model-forum',
    title: '前沿模型开发者日：推理成本与 Agent 应用',
    date: '2026-09-08',
    time: '19:00',
    topics: ['AI与算力'],
    kind: '事件',
    status: '已确认',
    region: '全球',
    source: '主办方议程（演示）',
    url: 'https://www.nvidia.com/en-us/events/',
    summary: '开发者活动，议程包括推理服务、API 开放与 Agent 应用。',
  },
  {
    id: 'robot-results',
    title: '机器人企业半年度经营交流：订单与交付',
    date: '2026-09-08',
    time: '15:00',
    topics: ['人形机器人'],
    kind: '事件',
    status: '已公布',
    region: '中国',
    source: '公司公告（演示）',
    url: 'https://www.hkexnews.hk/',
    summary: '半年度经营交流，议程包括订单、交付和客户试点进展。',
  },
  {
    id: 'power-grid',
    title: '数据中心用电配套项目听证会',
    date: '2026-09-09',
    time: '10:00',
    topics: ['能源与电力', 'AI与算力', '政策与监管'],
    kind: '政策',
    status: '已确认',
    region: '美国',
    source: '监管机构公告（演示）',
    url: 'https://www.federalregister.gov/',
    summary: '数据中心配套用电项目公开听证，涉及接入容量与电网改造安排。',
  },
  {
    id: 'robot-standard',
    title: '人形机器人安全标准征求意见截止',
    date: '2026-09-10',
    topics: ['人形机器人', '政策与监管'],
    kind: '政策',
    status: '已确认',
    region: '中国',
    source: '标准主管部门（演示）',
    url: 'https://std.miit.gov.cn/',
    summary: '人形机器人安全标准草案公开征求意见截止；正式实施日期待定。',
  },
  {
    id: 'robot-demo',
    title: '人形机器人行业技术交流会',
    date: '2026-09-11',
    time: '14:00',
    topics: ['人形机器人', 'AI与算力'],
    kind: '事件',
    status: '已改期',
    region: '中国',
    source: '主办方变更通知（演示）',
    url: 'https://ifr.org/',
    oldDate: '2026-09-09',
    summary: '行业技术交流活动，议程包括具身模型、整机技术与工业应用。',
  },
  {
    id: 'chip-benchmark',
    title: '推理性能评测结果发布',
    date: '2026-09-11',
    time: '21:00',
    topics: ['AI与算力'],
    kind: '指标',
    status: '已确认',
    region: '全球',
    source: '评测机构（演示）',
    url: 'https://mlcommons.org/benchmarks/inference-datacenter/',
    summary: '公布本轮数据中心推理性能评测结果，数值按测试场景分别列示。',
    unit: '依测试场景',
    period: '本轮评测',
  },
  {
    id: 'ai-window',
    title: '下一代模型开放窗口',
    date: '2026-09',
    topics: ['AI与算力'],
    kind: '事件',
    status: '待确认',
    region: '全球',
    source: '企业公开计划（演示）',
    url: 'https://www.nvidia.com/en-us/events/',
    summary: '计划于 9 月开放下一代模型，具体日期尚未公布。',
  },
  {
    id: 'robot-window',
    title: '人形机器人客户试点验收窗口',
    date: '2026-Q4',
    topics: ['人形机器人'],
    kind: '事件',
    status: '待确认',
    region: '中国',
    source: '企业计划（演示）',
    url: 'https://www.hkexnews.hk/',
    summary: '计划于第四季度开展客户试点验收，具体日期尚未公布。',
  },
  {
    id: 'cloud-results',
    title: '云计算企业业绩说明会',
    date: '2026-09-07',
    time: '20:00',
    topics: ['AI与算力'],
    kind: '事件',
    status: '已公布',
    region: '美国',
    source: '投资者关系公告（演示）',
    url: 'https://investor.nvidia.com/events-and-presentations/events-and-presentations/default.aspx',
    summary: '云计算企业业绩说明会，披露季度经营情况与资本支出安排。',
  },
  {
    id: 'power-data',
    title: '重点地区全社会用电量发布',
    date: '2026-09-12',
    topics: ['能源与电力'],
    kind: '指标',
    status: '已确认',
    region: '中国',
    source: '主管部门公告（演示）',
    url: 'https://www.nea.gov.cn/',
    summary: '发布重点地区 8 月全社会用电量及分行业统计。',
    unit: '亿千瓦时',
    period: '2026年8月',
  },
  {
    id: 'semiconductor-data',
    title: '半导体行业月度销售统计',
    date: '2026-09-09',
    time: '16:00',
    topics: ['AI与算力'],
    kind: '指标',
    status: '已确认',
    region: '全球',
    source: '行业协会（演示）',
    url: 'https://www.wsts.org/61/Forecasts',
    summary: '发布半导体行业月度销售数据。',
    unit: '亿美元',
    period: '模拟观察期',
  },
  {
    id: 'policy-budget',
    title: '产业专项资金申报截止',
    date: '2026-09-13',
    topics: ['政策与监管', '人形机器人'],
    kind: '政策',
    status: '已确认',
    region: '中国',
    source: '主管部门申报通知（演示）',
    url: 'https://www.miit.gov.cn/',
    summary: '产业专项资金项目申报截止，后续安排以主管部门通知为准。',
  },
];

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
        `DTEND;VALUE=DATE:${shiftDate(event.date, 1).replaceAll('-', '')}`,
      ];
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PLUS Calendar Demo//ZH',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@plus-calendar-demo`,
    'DTSTAMP:20260908T080000Z',
    ...timing,
    `SUMMARY:${escape('[日历演示] ' + event.title)}`,
    `DESCRIPTION:${escape((event.real ? '官方日程样本；请临近日期复核。' : '模拟事件，非真实日程。') + ' ' + event.summary)}`,
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
