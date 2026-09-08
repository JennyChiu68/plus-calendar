'use client';
import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  SlidersHorizontal,
  Check,
  Plus,
  Bookmark,
  Layers3,
  Cpu,
  Bot,
  Landmark,
  Zap,
  ChartNoAxesCombined,
  Globe2,
  ExternalLink,
  Clock3,
  Info,
  Download,
  LockKeyhole,
  FileText,
  ArrowRight,
  Radio,
  CalendarClock,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  events,
  topics,
  inWeek,
  shiftDate,
  icsForEvent,
  type Topic,
  type CalendarEvent,
} from '@/lib/calendar';
const icons = [Cpu, Bot, Landmark, Zap, ChartNoAxesCombined];
const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
const color = (topic: string) =>
  ['blue', 'violet', 'amber', 'green', 'rose'][
    topics.indexOf(topic as Topic)
  ] || 'blue';
const dateLabel = (date: string) => date.slice(5).replace('-', '月') + '日';
export default function Home() {
  const [topic, setTopic] = useState<Topic | '全部'>('全部');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('全部');
  const [view, setView] = useState('week');
  const [day, setDay] = useState('');
  const [week, setWeek] = useState('2026-09-07');
  const [important, setImportant] = useState(false);
  const [mine, setMine] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [member, setMember] = useState(true);
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [modal, setModal] = useState('');
  const [saved, setSaved] = useState<string[]>([]);
  const [subscribed, setSubscribed] = useState<string[]>(['AI与算力']);
  const [reminders, setReminders] = useState<Record<string, string>>({});
  const [lead, setLead] = useState('提前 1 天');
  const [toast, setToast] = useState('');
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem('plus-calendar-demo') || '{}',
      );
      setSaved(data.saved || []);
      setSubscribed(data.subscribed || ['AI与算力']);
      setReminders(data.reminders || {});
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded)
      localStorage.setItem(
        'plus-calendar-demo',
        JSON.stringify({ saved, subscribed, reminders }),
      );
  }, [loaded, saved, subscribed, reminders]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  function toggleSaved(e: CalendarEvent) {
    setSaved((p) =>
      p.includes(e.id) ? p.filter((id) => id !== e.id) : [...p, e.id],
    );
  }
  function subscribe(t: string) {
    if (!member) {
      setModal('member');
      return;
    }
    setSubscribed((p) =>
      p.includes(t) ? p.filter((i) => i !== t) : [...p, t],
    );
    setToast(
      subscribed.includes(t)
        ? '已取消主题订阅（本地演示）'
        : '主题订阅已保存；不会发送真实通知',
    );
  }
  function exportEvent(e: CalendarEvent) {
    const ics = icsForEvent(e);
    if (!ics) {
      setToast('时间尚未确认，暂不生成日历日程');
      return;
    }
    const url = URL.createObjectURL(
      new Blob([ics], { type: 'text/calendar;charset=utf-8' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = e.id + '.ics';
    a.click();
    URL.revokeObjectURL(url);
    setToast('已导出日历演示文件；导入后请核对时间');
  }
  const base = events.filter(
    (e) =>
      (topic === '全部' || e.topics.includes(topic)) &&
      (kind === '全部' || e.kind === kind) &&
      (!important || e.importance === 3) &&
      (!mine ||
        saved.includes(e.id) ||
        e.topics.some((t) => subscribed.includes(t))) &&
      (!query ||
        [e.title, e.source, ...e.topics, ...e.chain]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())),
  );
  const scheduled = base
    .filter(
      (e) =>
        e.status !== '待确认' &&
        (view === 'month'
          ? e.date.startsWith(week.slice(0, 7))
          : inWeek(e.date, week)) &&
        (!day || view === 'month' || e.date === day),
    )
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        (a.time || '99').localeCompare(b.time || '99'),
    );
  const windows = base.filter((e) => e.status === '待确认');
  const days = Array.from({ length: 7 }, (_, i) => shiftDate(week, i));
  const rangeEvents = events.filter((e) => inWeek(e.date, week));
  function changeWeek(n: number) {
    if (view === 'month') {
      const d = new Date(week.slice(0, 7) + '-01T00:00:00Z');
      d.setUTCMonth(d.getUTCMonth() + n);
      setWeek(d.toISOString().slice(0, 10));
    } else {
      setWeek(shiftDate(week, n * 7));
    }
    setDay('');
  }
  function reset() {
    setTopic('全部');
    setKind('全部');
    setQuery('');
    setImportant(false);
    setMine(false);
    setDay('');
    setWeek('2026-09-07');
  }
  const monthStart = week.slice(0, 7) + '-01';
  const monthOffset = (new Date(monthStart + 'T00:00:00Z').getUTCDay() + 6) % 7;
  const monthLength = new Date(
    Number(week.slice(0, 4)),
    Number(week.slice(5, 7)),
    0,
  ).getDate();
  const monthDays = Array.from(
    { length: Math.ceil((monthOffset + monthLength) / 7) * 7 },
    (_, i) => shiftDate(monthStart, i - monthOffset),
  );
  function row(e: CalendarEvent) {
    return (
      <article
        className={'event-row ' + (e.real ? 'verified-row' : '')}
        key={e.id}
      >
        <div className="event-time">
          <strong>{e.time || '全天'}</strong>
          <span>{e.region}</span>
        </div>
        <div className="event-main">
          <div className="eyebrow">
            <span className={'tag ' + color(e.topics[0])}>{e.topics[0]}</span>
            <span>{e.kind}</span>
            <span
              className={'status ' + (e.status === '已改期' ? 'changed' : '')}
            >
              {e.status === '已公布' ? '● ' : ''}
              {e.status}
            </span>
            <span className={e.real ? 'verified' : 'sample'}>
              {e.real ? '官方日程样本' : '模拟'}
            </span>
          </div>
          <button className="event-title" onClick={() => setSelected(e)}>
            {e.title}
            <ChevronRight size={16} />
          </button>
          {e.kind === '指标' ? (
            <div className="values">
              <span>
                前值 <b>{e.previous || '—'}</b>
              </span>
              <span>
                预期 <b>—</b>
              </span>
              <span>
                公布{' '}
                <b className={e.actual ? 'number' : ''}>
                  {e.actual || '待公布'}
                </b>
              </span>
              <small>{e.unit}</small>
            </div>
          ) : (
            <p className="event-summary">{e.summary}</p>
          )}
          <div className="event-foot">
            <span>{e.source}</span>
            {e.oldDate && (
              <span className="changed">
                原定 {dateLabel(e.oldDate)} → {dateLabel(e.date)}
              </span>
            )}
            <button onClick={() => setSelected(e)}>
              <span className="plus-word">PLUS</span> {e.related} ·{' '}
              {e.status === '已公布' ? '查看复盘' : '看点前瞻'}
            </button>
          </div>
        </div>
        <div className="row-actions">
          <span
            className="importance"
            aria-label={'重要性 ' + e.importance + ' 星'}
          >
            {'★'.repeat(e.importance)}
            <i>{'★'.repeat(3 - e.importance)}</i>
          </span>
          <button
            className={
              saved.includes(e.id) ? 'icon-button active' : 'icon-button'
            }
            onClick={() => toggleSaved(e)}
            aria-label={
              (saved.includes(e.id) ? '取消自选 ' : '加入自选 ') + e.title
            }
          >
            <Bookmark
              size={18}
              fill={saved.includes(e.id) ? 'currentColor' : 'none'}
            />
          </button>
          <button
            className={'icon-button ' + (reminders[e.id] ? 'active' : '')}
            onClick={() => {
              setSelected(e);
              setLead('提前 1 天');
              setModal(member ? 'reminder' : 'member');
            }}
            aria-label={'设置提醒 ' + e.title}
          >
            <Bell size={18} />
          </button>
        </div>
      </article>
    );
  }
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <a href="https://www.jin10.com/" className="brand">
            <span className="brand-icon">Q</span>
            <strong>金十数据</strong>
            <span className="brand-plus">PLUS</span>
          </a>
          <nav className="global-nav">
            <a href="https://www.jin10.com/">首页</a>
            <a href="https://xnews.jin10.com/">头条</a>
            <a href="https://svip.jin10.com/">VIP专区</a>
            <span className="current">日历</span>
            <a href="https://v.jin10.com/">视频</a>
            <a href="https://datas.jin10.com/">数据</a>
          </nav>
          <a className="proposal-link" href="/proposal.html">
            <FileText size={16} />
            完整产品方案
            <ArrowUpRight size={15} />
          </a>
          <button
            className="avatar"
            onClick={() => setModal('demo')}
            aria-label="打开演示设置"
          >
            J
          </button>
        </div>
      </header>
      <div className="demo-strip">
        <span>
          <Info size={14} /> 产品概念演示 ·
          除标记的官方日程样本，其余均为模拟数据
        </span>
        <button onClick={() => setModal('demo')}>
          演示说明与会员切换 <ArrowUpRight size={14} />
        </button>
      </div>
      <main className="workspace">
        <div className="calendar-top">
          <div className="title-block">
            <span className="kicker">JIN10 CALENDAR</span>
            <h1>
              财经日历<span className="divider">/</span>
              <em>PLUS 日历</em>
            </h1>
          </div>
          <div className="top-actions">
            <span className="timezone">
              <Globe2 size={15} />
              北京时间 UTC+8
            </span>
            <button
              className="outline-button"
              onClick={() => setModal('subscriptions')}
            >
              <SlidersHorizontal size={16} />
              订阅管理
            </button>
          </div>
        </div>
        <div className="section-nav">
          <div className="legacy-tabs">
            {['宏观数据', '大事', '假期', '期货', 'A股', '港股', '美股'].map(
              (t) => (
                <a
                  key={t}
                  href="https://rili.jin10.com/"
                  title="打开现有金十日历"
                >
                  {t}
                </a>
              ),
            )}
            <span className="selected-tab">
              PLUS 日历 <span>NEW</span>
            </span>
          </div>
          <button
            className={mine ? 'my-toggle active' : 'my-toggle'}
            onClick={() => setMine(!mine)}
          >
            <Bookmark size={16} />
            我的日历
          </button>
        </div>
        <div className="workspace-grid">
          <aside className="topic-sidebar">
            <div className="side-heading">
              主题日历<span>探索与订阅</span>
            </div>
            <button
              className={'topic-button ' + (topic === '全部' ? 'selected' : '')}
              onClick={() => {
                setTopic('全部');
                setDay('');
              }}
            >
              <Layers3 size={18} />
              <span>全部主题</span>
              <b>{events.filter((e) => e.status !== '待确认').length}</b>
            </button>
            {topics.map((t, i) => {
              const Icon = icons[i];
              return (
                <div className="topic-wrap" key={t}>
                  <button
                    className={
                      'topic-button ' + (topic === t ? 'selected' : '')
                    }
                    onClick={() => {
                      setTopic(t);
                      setDay('');
                    }}
                  >
                    <Icon size={18} />
                    <span>{t}</span>
                    <span className={'topic-dot ' + color(t)} />
                  </button>
                  {topic === t && (
                    <button
                      className="inline-subscribe"
                      onClick={() => subscribe(t)}
                    >
                      {subscribed.includes(t) ? (
                        <Check size={14} />
                      ) : (
                        <Plus size={14} />
                      )}{' '}
                      {subscribed.includes(t) ? '已订阅主题' : '订阅这个主题'}
                    </button>
                  )}
                </div>
              );
            })}
            <div className="side-separator" />
            <div className="side-heading">跨日历查看</div>
            <label className="overlay-switch">
              <span>叠加宏观日程</span>
              <Switch checked={overlay} onCheckedChange={setOverlay} />
            </label>
            <p className="side-note">
              把产业节点与宏观背景，放在同一条时间线上。
            </p>
            <div className="member-card">
              <div>
                <span className="brand-plus">PLUS</span>
                <span>{member ? '权益体验中' : '免费预览'}</span>
              </div>
              <strong>
                从提前知道，
                <br />
                到持续跟进。
              </strong>
              <p>
                主题前瞻 · 节点变化
                <br />
                产业链关联 · 结果复盘
              </p>
              <button onClick={() => setModal('member')}>
                查看日历权益 <ArrowRight size={15} />
              </button>
            </div>
            <a className="source-link" href="/proposal.html#sources">
              <ExternalLink size={15} />
              信源与采编方案
            </a>
          </aside>
          <section className="calendar-main">
            <div className="main-toolbar">
              <div className="period-control">
                <button
                  className="icon-button"
                  onClick={() => changeWeek(-1)}
                  aria-label="上一周"
                >
                  <ChevronLeft size={18} />
                </button>
                <h2>
                  {week.slice(0, 4)}年{Number(week.slice(5, 7))}月{' '}
                  <small>
                    {view === 'month'
                      ? '月度总览'
                      : `${Number(week.slice(8))} — ${Number(shiftDate(week, 6).slice(8))}日`}
                  </small>
                </h2>
                <button
                  className="icon-button"
                  onClick={() => changeWeek(1)}
                  aria-label="下一周"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  className="today-button"
                  onClick={() => {
                    setWeek('2026-09-07');
                    setDay('2026-09-08');
                    setView('week');
                  }}
                >
                  演示今日
                </button>
              </div>
              <Tabs
                value={view}
                onValueChange={(v) => {
                  setView(String(v));
                  if (v === 'week') {
                    const dow =
                      (new Date(week + 'T00:00:00Z').getUTCDay() + 6) % 7;
                    setWeek(shiftDate(week, -dow));
                  }
                  setDay('');
                }}
              >
                <TabsList className="view-tabs">
                  <TabsTrigger value="week">周历</TabsTrigger>
                  <TabsTrigger value="month">月历</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {view === 'week' && (
              <div className="week-strip">
                {days.map((d, i) => (
                  <button
                    onClick={() => setDay(day === d ? '' : d)}
                    className={
                      (day === d ? 'chosen ' : '') +
                      (d === '2026-09-08' ? 'today' : '')
                    }
                    key={d}
                  >
                    <span>周{weekdays[i]}</span>
                    <b>{Number(d.slice(8))}</b>
                    <div className="date-dots">
                      {Array.from(
                        new Set(
                          rangeEvents
                            .filter((e) => e.date === d)
                            .map((e) => color(e.topics[0])),
                        ),
                      )
                        .slice(0, 3)
                        .map((c) => (
                          <i className={c} key={c} />
                        ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="filters">
              <div className="search-box">
                <Search size={16} />
                <input
                  aria-label="搜索事件、公司或产业链"
                  placeholder="搜索事件、公司、产业链"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Select value={kind} onValueChange={(v) => setKind(v || '全部')}>
                <SelectTrigger aria-label="事件类型">
                  <SelectValue>
                    {kind === '全部' ? '全部类型' : kind}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {['全部', '指标', '事件', '政策'].map((k) => (
                    <SelectItem key={k} value={k}>
                      {k === '全部' ? '全部类型' : k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <label className="important-toggle">
                <Switch checked={important} onCheckedChange={setImportant} />
                仅重要
              </label>
            </div>
            <div className="result-bar">
              <span>
                {mine
                  ? '我的订阅与自选'
                  : topic === '全部'
                    ? '全部主题'
                    : topic}
                <b>{scheduled.length}</b>项日程
                {day && <button onClick={() => setDay('')}>查看整周 ×</button>}
              </span>
              <span>指标与事件 · 统一时间线</span>
            </div>
            {overlay && (
              <div className="macro-overlay">
                <Landmark size={18} />
                <div>
                  <b>宏观背景 · 叠加示例</b>
                  <p>本周宏观数据发布窗口 · 时间待接入</p>
                  <small>正式版复用原日历事件 ID，在此仅展示叠加关系。</small>
                </div>
                <a href="https://rili.jin10.com/">
                  查看现有日历 <ArrowUpRight size={14} />
                </a>
              </div>
            )}
            {view === 'week' ? (
              <div className="event-list">
                {days
                  .filter((d) => scheduled.some((e) => e.date === d))
                  .map((d) => (
                    <section key={d}>
                      <div className="day-heading">
                        <span>
                          {dateLabel(d)}
                          <small>星期{weekdays[days.indexOf(d)]}</small>
                          {d === '2026-09-08' && <i>演示今日</i>}
                        </span>
                        <b>{scheduled.filter((e) => e.date === d).length} 项</b>
                      </div>
                      {scheduled.filter((e) => e.date === d).map(row)}
                    </section>
                  ))}
              </div>
            ) : (
              <div className="month-grid">
                {weekdays.map((d) => (
                  <div className="month-weekday" key={d}>
                    周{d}
                  </div>
                ))}
                {monthDays.map((d) => (
                  <div
                    className={
                      'month-cell ' +
                      (!d.startsWith(week.slice(0, 7)) ? 'outside' : '')
                    }
                    key={d}
                  >
                    <span className={d === '2026-09-08' ? 'today-number' : ''}>
                      {Number(d.slice(8))}
                    </span>
                    {scheduled
                      .filter((e) => e.date === d)
                      .map((e) => (
                        <button
                          onClick={() => setSelected(e)}
                          className={color(e.topics[0])}
                          key={e.id}
                        >
                          <span>{e.time || '全天'}</span>
                          {e.title}
                          <small>{e.real ? '官方样本' : '模拟'}</small>
                        </button>
                      ))}
                  </div>
                ))}
              </div>
            )}
            {scheduled.length === 0 && (
              <div className="empty-state">
                <CalendarDays size={36} />
                <h3>这个范围内暂无匹配日程</h3>
                <p>
                  演示样本集中在 2026 年 9 月 7—13
                  日。可调整筛选，或查看右侧待确认窗口。
                </p>
                <button className="outline-button" onClick={reset}>
                  恢复演示日程
                </button>
              </div>
            )}
            <div className="list-footer">
              <span className="status-dot" />
              计划与结果分开记录，时间变化持续留痕。
              <a href="/proposal.html#rules">
                查看收录规则 <ArrowUpRight size={14} />
              </a>
            </div>
          </section>
          <aside className="insight-sidebar">
            <div className="insight-card weekly-focus">
              <div className="card-kicker">
                <Radio size={16} />
                本周观察<span className="plus-word">PLUS</span>
              </div>
              <h3>
                AI 投入，
                <br />
                如何走向产业兑现？
              </h3>
              <p>沿着三个可核验节点，关注从算力支出到实际交付的进展。</p>
              <div className="focus-path">
                <span>
                  <i>01</i>资本开支与需求
                </span>
                <span>
                  <i>02</i>营收与产能验证
                </span>
                <span>
                  <i>03</i>交付与客户验收
                </span>
              </div>
              <button onClick={() => setSelected(events[0])}>
                查看本周重点 <ArrowRight size={16} />
              </button>
              <small>编辑观察示例 · 非投资建议</small>
            </div>
            <div className="insight-card window-card">
              <div className="card-title">
                <h3>
                  <CalendarClock size={17} />
                  待确认窗口
                </h3>
                <span>{windows.length}</span>
              </div>
              <p className="muted">日期未定，确认后进入日程</p>
              {windows.map((e) => (
                <button
                  className="window-item"
                  onClick={() => setSelected(e)}
                  key={e.id}
                >
                  <span className="window-date">
                    {e.date === '2026-09' ? '9 月窗口' : '第四季度窗口'}
                    <span>待确认</span>
                  </span>
                  <strong>{e.title}</strong>
                  <span className="window-bottom">
                    {e.topics[0]}
                    <ArrowUpRight size={15} />
                  </span>
                </button>
              ))}
              {windows.length === 0 && (
                <p className="muted">当前筛选没有待确认事项。</p>
              )}
            </div>
            <div className="insight-card change-card">
              <h3>
                <Clock3 size={17} />
                日程有变化
              </h3>
              <span className="tag amber">改期示例</span>
              <button onClick={() => setSelected(events[5])}>
                机器人技术交流会
              </button>
              <div>
                <del>09.09</del>
                <ArrowRight size={14} />
                <b>09.11</b>
              </div>
              <p>一次变更通知，自动替换旧提醒。</p>
            </div>
            <div className="side-bottom">
              <span>信息有出处 · 变化可追溯</span>
              <a href="/proposal.html">
                阅读完整产品构思 <ArrowUpRight size={14} />
              </a>
            </div>
          </aside>
        </div>
      </main>
      <footer className="page-footer">
        金十 PLUS 日历 · 产品讨论稿{' '}
        <span>研究截至 2026.09.08 · 无实时行情与通知服务</span>
      </footer>
      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent className="detail-sheet">
          <SheetHeader>
            <div className="detail-kicker">
              <span className="brand-plus">PLUS</span>
              <span>事件研究卡</span>
            </div>
            <SheetTitle>{selected?.title}</SheetTitle>
            <SheetDescription>
              {selected?.real
                ? '官方日程样本 · 来源核验于 2026-09-08'
                : '模拟内容 · 用于演示事件生命周期'}
            </SheetDescription>
          </SheetHeader>
          {selected && (
            <div className="detail-body">
              <div className="detail-meta">
                <span>
                  <CalendarDays size={16} />
                  {selected.date}{' '}
                  {selected.time ||
                    (selected.status === '待确认' ? '日期待定' : '全天')}
                </span>
                <span className="tag blue">{selected.status}</span>
              </div>
              <div className="detail-tags">
                {selected.topics.map((t) => (
                  <span className={'tag ' + color(t)} key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <p className="detail-summary">{selected.summary}</p>
              {selected.kind === '指标' && (
                <div className="detail-values">
                  <div>
                    前值<strong>{selected.previous || '—'}</strong>
                  </div>
                  <div>
                    一致预期<strong>—</strong>
                  </div>
                  <div>
                    公布值<strong>{selected.actual || '待公布'}</strong>
                  </div>
                  <p>
                    {selected.unit} · 统计期：{selected.period} · 未核实一致预期
                  </p>
                </div>
              )}
              <section className="detail-section">
                <h3>这件事，重点看什么</h3>
                {member ? (
                  <ol>
                    {selected.focus.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ol>
                ) : (
                  <div className="locked-block">
                    <LockKeyhole size={22} />
                    <p>解锁核验要点、产业链关联和跟进提醒</p>
                    <button
                      className="primary-button"
                      onClick={() => setModal('member')}
                    >
                      查看 PLUS 日历权益
                    </button>
                  </div>
                )}
              </section>
              {member && (
                <>
                  <section className="detail-section">
                    <h3>
                      产业传导路径 <small>研究关联，不代表股价方向</small>
                    </h3>
                    <div className="chain">
                      {selected.chain.map((c, i) => (
                        <div key={c}>
                          <span>{c}</span>
                          {i < selected.chain.length - 1 && (
                            <ArrowRight size={16} />
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="detail-section">
                    <h3>全过程跟进</h3>
                    <div className="lifecycle">
                      <div className="done">
                        <i />
                        <strong>收录 / 前瞻</strong>
                        <p>
                          {selected.real
                            ? '已核对官方发布时间表'
                            : '模拟公告与关注要点已整理'}
                        </p>
                      </div>
                      <div
                        className={selected.status === '已公布' ? 'done' : ''}
                      >
                        <i />
                        <strong>
                          {selected.status === '已改期'
                            ? '时间变更'
                            : '发布 / 截止'}
                        </strong>
                        <p>
                          {selected.oldDate
                            ? `${selected.oldDate} → ${selected.date}`
                            : selected.status === '待确认'
                              ? '等待正式日期，暂不倒计时'
                              : selected.status === '已公布'
                                ? '模拟结果已回填'
                                : '等待日程发生后核验结果'}
                        </p>
                      </div>
                      <div>
                        <i />
                        <strong>复盘 / 下一节点</strong>
                        <p>
                          {selected.kind === '政策'
                            ? '继续跟进正式发布与实际实施'
                            : selected.status === '已公布'
                              ? '继续核验兑现与后续披露'
                              : '回看前瞻问题是否得到回答'}
                        </p>
                      </div>
                    </div>
                  </section>
                </>
              )}
              <section className="source-proof">
                <h3>
                  <ExternalLink size={16} />
                  信源与证据
                </h3>
                <b>{selected.source}</b>
                <p>
                  {selected.real
                    ? '官方页面列示 2026-09-10 13:30，时区 Asia/Taipei，与北京时间同为 UTC+8。前值取官方 2026 年月营收页。'
                    : '以下链接为真实候选信源入口，并不证明本条模拟事件或日期。正式产品必须链接到具体公告。'}
                </p>
                <a href={selected.url} target="_blank" rel="noreferrer">
                  {selected.real ? '查看官方日程' : '查看候选信源入口'}
                  <ArrowUpRight size={15} />
                </a>
                {selected.real && (
                  <a
                    href="https://investor.tsmc.com/english/monthly-revenue/2026"
                    target="_blank"
                    rel="noreferrer"
                  >
                    查看前值来源
                    <ArrowUpRight size={15} />
                  </a>
                )}
              </section>
              <div className="related-content">
                <FileText size={19} />
                <div>
                  <b>{selected.related}</b>
                  <p>正式版在此关联已发布的前瞻与复盘</p>
                </div>
              </div>
              <div className="detail-buttons">
                <button
                  className="primary-button"
                  onClick={() => {
                    setLead('提前 1 天');
                    setModal(member ? 'reminder' : 'member');
                  }}
                >
                  <Bell size={17} />
                  {reminders[selected.id]
                    ? '管理提醒'
                    : selected.status === '待确认'
                      ? '订阅日期确认'
                      : '设置提醒'}
                </button>
                <button
                  className="outline-button"
                  onClick={() => toggleSaved(selected)}
                >
                  <Bookmark size={16} />
                  {saved.includes(selected.id) ? '已自选' : '加入自选'}
                </button>
                {selected.status !== '待确认' && (
                  <button
                    className="outline-button"
                    onClick={() => exportEvent(selected)}
                  >
                    <Download size={16} />
                    导出 ICS
                  </button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <Dialog
        open={!!modal}
        onOpenChange={(open) => {
          if (!open) setModal('');
        }}
      >
        <DialogContent className="settings-dialog">
          <DialogHeader>
            <DialogTitle>
              {modal === 'demo'
                ? '演示说明'
                : modal === 'member'
                  ? 'PLUS 日历权益建议'
                  : modal === 'subscriptions'
                    ? '管理主题订阅'
                    : '设置日程提醒'}
            </DialogTitle>
            <DialogDescription>
              {modal === 'member'
                ? '建议纳入现有 PLUS，实际会员互通关系需内部核对。'
                : '以下设置仅保存在本浏览器，不触发真实通知或支付。'}
            </DialogDescription>
          </DialogHeader>
          {modal === 'demo' && (
            <div className="dialog-body">
              <p>
                体验流程：选择主题 → 查看事件 → 设置提醒 →
                切换月历。官方样本为台积电营收日程，其余事件与结果均为模拟。
              </p>
              <label className="setting-line">
                <span>体验 PLUS 会员视角</span>
                <Switch checked={member} onCheckedChange={setMember} />
              </label>
              <p className="muted">
                关闭后可查看免费预览及权益提示。会员切换只是演示，不代表账户真实状态。
              </p>
              <a className="primary-button" href="/proposal.html">
                阅读完整产品方案 <ArrowUpRight size={16} />
              </a>
            </div>
          )}
          {modal === 'member' && (
            <div className="dialog-body">
              <div className="benefit-grid">
                <div>
                  <span>免费预览</span>
                  <b>基础日程与原始出处</b>
                  <p>标题、日期、确定性、公开来源</p>
                </div>
                <div>
                  <span className="plus-word">PLUS</span>
                  <b>前瞻与持续跟进</b>
                  <p>主题订阅、变化提醒、核验要点、研究关联与复盘</p>
                </div>
              </div>
              <p>
                首期建议不单独收费，验证是否提升现有会员使用与续费。当前未接入购买流程。
              </p>
              <button
                className="primary-button"
                onClick={() => {
                  setMember(true);
                  setModal('');
                  setToast('已切换为 PLUS 演示视角');
                }}
              >
                体验 PLUS 视角 <ArrowRight size={16} />
              </button>
            </div>
          )}
          {modal === 'subscriptions' && (
            <div className="dialog-body">
              {topics.map((t, i) => {
                const Icon = icons[i];
                return (
                  <label className="setting-line" key={t}>
                    <span>
                      <Icon size={18} />
                      {t}
                    </span>
                    <Switch
                      checked={subscribed.includes(t)}
                      onCheckedChange={() => subscribe(t)}
                    />
                  </label>
                );
              })}
              <p className="muted">
                已订阅主题将出现在“我的日历”。主题订阅与单条自选互不覆盖。
              </p>
              <button
                className="primary-button"
                onClick={() => {
                  setMine(true);
                  setModal('');
                }}
              >
                查看我的日历
              </button>
            </div>
          )}
          {modal === 'reminder' && selected && (
            <div className="dialog-body">
              <h3>{selected.title}</h3>
              {selected.status === '待确认' ? (
                <p>时间尚未确定，仅在官方确认日期或窗口变化时提醒。</p>
              ) : (
                <>
                  <p>
                    日期：{selected.date} {selected.time || '全天'}（北京时间）
                  </p>
                  <Select
                    value={lead}
                    onValueChange={(v) => setLead(v || '提前 1 天')}
                  >
                    <SelectTrigger aria-label="提醒提前量">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(selected.time
                        ? [
                            '提前 1 天',
                            '提前 1 小时',
                            '提前 30 分钟',
                            '仅日程变更',
                          ]
                        : ['提前 1 天', '仅日程变更']
                      ).map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
              <p className="muted">
                全天事件按当地日期提醒；无精确时间时不生成分钟倒计时。演示不进行后台推送。
              </p>
              <button
                className="primary-button"
                onClick={() => {
                  setReminders((p) => ({
                    ...p,
                    [selected.id]:
                      selected.status === '待确认' ? '日期确认后' : lead,
                  }));
                  setModal('');
                  setToast('提醒偏好已保存（本地演示），不会真实推送');
                }}
              >
                保存提醒偏好
              </button>
              {reminders[selected.id] && (
                <button
                  className="outline-button"
                  onClick={() => {
                    setReminders((p) => {
                      const next = { ...p };
                      delete next[selected.id];
                      return next;
                    });
                    setModal('');
                    setToast('已取消此事件提醒');
                  }}
                >
                  取消此事件提醒
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}
