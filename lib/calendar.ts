export type Topic =
  | 'AI与算力'
  | '人形机器人'
  | '政策与监管'
  | '能源与电力'
  | '资金与持仓';
export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time?: string;
  topics: Topic[];
  kind: '指标' | '事件' | '政策';
  status: '已确认' | '已公布' | '已改期' | '待确认';
  importance: number;
  region: string;
  source: string;
  url: string;
  real?: boolean;
  summary: string;
  focus: string[];
  chain: string[];
  related: string;
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
  '资金与持仓',
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
    importance: 3,
    region: '中国台湾',
    source: '台积电投资者关系',
    url: 'https://investor.tsmc.com/chinese/financial-calendar',
    real: true,
    summary:
      '观察先进制程需求的月度线索。总营收同时包含多种终端需求，不能直接等同于 AI 收入。',
    focus: [
      '对比上月及去年同月，留意季节性与汇率影响。',
      '月营收未拆分 AI 收入；需结合季度先进制程占比与管理层说明。',
      '没有核实的一致预期保持为空，不用编辑判断替代。',
    ],
    chain: ['AI资本开支', '先进制程', '设备与封装'],
    related: 'AI前沿日报',
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
    importance: 3,
    region: '全球',
    source: '主办方议程（演示）',
    url: 'https://www.nvidia.com/en-us/events/',
    summary:
      '从模型能力演示进一步观察商业可用性：价格、开放范围、延迟与调用限制。',
    focus: [
      '是否开放正式 API，而非仅有研究预览。',
      '在相同输入输出长度下比较成本与延迟。',
      '明确测试版本、测试集与使用条件，避免仅以榜单名次判断。',
    ],
    chain: ['模型服务', 'AI应用', '企业软件'],
    related: 'AI前沿日报',
  },
  {
    id: 'robot-results',
    title: '机器人企业半年度经营交流：订单与交付',
    date: '2026-09-08',
    time: '15:00',
    topics: ['人形机器人'],
    kind: '事件',
    status: '已公布',
    importance: 3,
    region: '中国',
    source: '公司公告（演示）',
    url: 'https://www.hkexnews.hk/',
    summary:
      '演示结果：公司披露试点进入验收阶段；订单金额和收入确认仍需后续公告支持。',
    focus: [
      '区分框架协议、正式订单、实际交付和收入确认。',
      '核对交付是否为人形机器人，是否包含其他机器人。',
      '客户现场验收与复购比演示视频更值得持续跟进。',
    ],
    chain: ['整机交付', '执行器', '传感器'],
    related: 'PLUS文章',
  },
  {
    id: 'power-grid',
    title: '数据中心用电配套项目听证会',
    date: '2026-09-09',
    time: '10:00',
    topics: ['能源与电力', 'AI与算力', '政策与监管'],
    kind: '政策',
    status: '已确认',
    importance: 2,
    region: '美国',
    source: '监管机构公告（演示）',
    url: 'https://www.federalregister.gov/',
    summary: '关注接入容量、电网改造分摊与审批进度，听证本身不代表项目获批。',
    focus: [
      '项目申报容量与实际投运容量分开记录。',
      '审批通过后仍需观察施工和并网节点。',
    ],
    chain: ['算力扩建', '电网接入', '电力设备'],
    related: 'PLUS文章',
  },
  {
    id: 'robot-standard',
    title: '人形机器人安全标准征求意见截止',
    date: '2026-09-10',
    topics: ['人形机器人', '政策与监管'],
    kind: '政策',
    status: '已确认',
    importance: 3,
    region: '中国',
    source: '标准主管部门（演示）',
    url: 'https://std.miit.gov.cn/',
    summary:
      '征求意见结束只是政策过程中的一个节点，正式发布与实施日期尚需确认。',
    focus: [
      '分清推荐性与强制性标准的性质。',
      '草案中的技术要求可能改变；不能直接作为最终合规要求。',
      '持续跟进审查、发布、生效三个后续节点。',
    ],
    chain: ['安全要求', '整机认证', '核心零部件'],
    related: 'PLUS文章',
  },
  {
    id: 'robot-demo',
    title: '人形机器人行业技术交流会',
    date: '2026-09-11',
    time: '14:00',
    topics: ['人形机器人', 'AI与算力'],
    kind: '事件',
    status: '已改期',
    importance: 2,
    region: '中国',
    source: '主办方变更通知（演示）',
    url: 'https://ifr.org/',
    oldDate: '2026-09-09',
    summary:
      '演示变更：由 9 月 9 日调整至 9 月 11 日。已订阅用户收到一次改期提示，旧提醒取消。',
    focus: [
      '关注实际作业时长、故障干预频率与演示条件。',
      '实验室测试结果与工厂部署效果分开说明。',
    ],
    chain: ['具身模型', '整机能力', '场景落地'],
    related: 'AI前沿日报',
  },
  {
    id: 'oil-holdings',
    title: '原油 ETF 持仓更新',
    date: '2026-09-08',
    time: '08:00',
    topics: ['资金与持仓'],
    kind: '指标',
    status: '已公布',
    importance: 2,
    region: '美国',
    source: '基金发行人披露（演示）',
    url: 'https://www.uscfinvestments.com/uso',
    summary:
      '演示数值用于展示公布后的对比结构。持仓受申赎与移仓影响，不直接表示投资者看多或看空。',
    focus: [
      '记录持仓所属日期与披露日期。',
      '区分基金份额、期货合约数量与名义敞口。',
    ],
    chain: ['基金申赎', '原油期货', '期限结构'],
    related: '原油ETF持仓',
    previous: '12,400',
    actual: '12,560',
    unit: '合约（模拟）',
    period: '模拟观察期',
  },
  {
    id: 'chip-benchmark',
    title: '推理性能评测结果发布',
    date: '2026-09-11',
    time: '21:00',
    topics: ['AI与算力'],
    kind: '指标',
    status: '已确认',
    importance: 2,
    region: '全球',
    source: '评测机构（演示）',
    url: 'https://mlcommons.org/benchmarks/inference-datacenter/',
    summary:
      '展示评测发布型指标：必须统一模型、精度、硬件配置和测试场景，才有横向比较意义。',
    focus: [
      '同版本、同场景、同精度才进入对比表。',
      '吞吐量不能单独代表每个请求的延迟。',
    ],
    chain: ['推理效率', '部署成本', '芯片需求'],
    related: 'AI前沿日报',
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
    importance: 3,
    region: '全球',
    source: '企业公开计划（演示）',
    url: 'https://www.nvidia.com/en-us/events/',
    summary:
      '仅有月份级计划，未公布具体日期。放入观察池，确认后再进入正式日程。',
    focus: [
      '等待企业正式公告，不按历史节奏猜测发布日期。',
      '确认前仅提供状态变更提醒，不设置分钟级提醒。',
    ],
    chain: ['模型发布', '开发者生态', '应用落地'],
    related: 'AI前沿日报',
  },
  {
    id: 'robot-window',
    title: '人形机器人客户试点验收窗口',
    date: '2026-Q4',
    topics: ['人形机器人'],
    kind: '事件',
    status: '待确认',
    importance: 2,
    region: '中国',
    source: '企业计划（演示）',
    url: 'https://www.hkexnews.hk/',
    summary:
      '季度级计划。目标日期、计划产能和已实现交付分别记录，逾期后保留未兑现状态。',
    focus: [
      '客户与供应商披露是否一致。',
      '没有验收公告时保持待确认，不自动改为已完成。',
    ],
    chain: ['试点部署', '验收', '收入确认'],
    related: 'PLUS文章',
  },
  {
    id: 'cloud-results',
    title: '云计算企业业绩说明会',
    date: '2026-09-07',
    time: '20:00',
    topics: ['AI与算力'],
    kind: '事件',
    status: '已公布',
    importance: 3,
    region: '美国',
    source: '投资者关系公告（演示）',
    url: 'https://investor.nvidia.com/events-and-presentations/events-and-presentations/default.aspx',
    summary: '演示复盘：结合资本支出、云业务增长与折旧费用评估投入回报。',
    focus: [
      '资本支出采用现金口径还是包含融资租赁。',
      '收入增长是否同步转化为现金流。',
    ],
    chain: ['资本支出', '算力设备', '云收入'],
    related: 'PLUS日报',
  },
  {
    id: 'power-data',
    title: '重点地区全社会用电量发布',
    date: '2026-09-12',
    topics: ['能源与电力'],
    kind: '指标',
    status: '已确认',
    importance: 1,
    region: '中国',
    source: '主管部门公告（演示）',
    url: 'https://www.nea.gov.cn/',
    summary:
      '观察电力需求结构。总量不是数据中心专属用电量，需保留地区与行业口径。',
    focus: [
      '单位、统计范围及同比基期需一致。',
      '若没有单列数据中心，不从总量推算 AI 用电。',
    ],
    chain: ['用电需求', '发电供给', '电网投资'],
    related: 'PLUS日报',
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
    importance: 2,
    region: '全球',
    source: '行业协会（演示）',
    url: 'https://www.wsts.org/61/Forecasts',
    summary:
      '总行业销售作为景气背景。需说明是否为三个月移动平均，以及是否含存储周期影响。',
    focus: [
      '月值和移动平均值不能直接拼接。',
      '分产品、分地区拆解后才能支持主题判断。',
    ],
    chain: ['芯片销售', '库存周期', '设备投资'],
    related: 'AI前沿日报',
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
    importance: 2,
    region: '中国',
    source: '主管部门申报通知（演示）',
    url: 'https://www.miit.gov.cn/',
    summary:
      '申报截止后还存在评审、公示和拨款环节，不能把预算总额当作已落地投资。',
    focus: [
      '明确地区、适用主体、申报条件与材料截止时间。',
      '跟进公示名单和实际拨款进展。',
    ],
    chain: ['产业预算', '项目评审', '资金拨付'],
    related: 'PLUS文章',
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
