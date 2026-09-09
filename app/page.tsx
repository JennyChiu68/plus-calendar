'use client';
/* eslint-disable next/no-html-link-for-pages -- The report is a standalone static HTML document, not a Next route. */
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
  Globe2,
  ExternalLink,
  Info,
  Download,
  CircuitBoard,
  Car,
  Rocket,
  HeartPulse,
  Atom,
  ShieldCheck,
  ArrowRight,
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
  dataset,
  beijingToday,
  mondayOf,
  occursOn,
  overlapsRange,
  shiftDate,
  icsForEvent,
  type Topic,
  type CalendarEvent,
} from '@/lib/calendar';
const icons = [
  Cpu,
  Bot,
  CircuitBoard,
  Car,
  Rocket,
  HeartPulse,
  Atom,
  ShieldCheck,
  Zap,
  Landmark,
];
const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
const color = (topic: string) =>
  [
    'blue',
    'violet',
    'blue',
    'green',
    'blue',
    'violet',
    'violet',
    'blue',
    'green',
    'amber',
  ][topics.indexOf(topic as Topic)] || 'blue';
const dateLabel = (date: string) => date.slice(5).replace('-', '月') + '日';
const windowLabel = (date: string) =>
  date.includes('-Q')
    ? `${date.slice(0, 4)} 年第 ${date.slice(-1)} 季度`
    : `${date.slice(0, 4)} 年 ${Number(date.slice(5, 7))} 月`;
export default function Home() {
  const [topic, setTopic] = useState<Topic | '全部'>('全部');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('全部');
  const [view, setView] = useState('week');
  const [day, setDay] = useState('');
  const [today, setToday] = useState(beijingToday(new Date(dataset.updatedAt)));
  const [week, setWeek] = useState(mondayOf(today));
  const [mine, setMine] = useState(false);
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
    const now = beijingToday();
    // eslint-disable-next-line react/react-compiler -- Resolve the current local day only after hydration.
    setToday(now);
    setWeek(mondayOf(now));
    try {
      const data = JSON.parse(
        localStorage.getItem('plus-calendar-demo') || '{}',
      );
      // eslint-disable-next-line react/react-compiler -- Hydrate browser-only preferences after the static first render.
      setSaved(
        (data.saved || []).filter((id: string) =>
          events.some((e) => e.id === id),
        ),
      );
      setSubscribed(
        (data.subscribed || ['AI与算力'])
          .map((t: string) => (t === '人形机器人' ? '机器人与具身智能' : t))
          .filter((t: string) => topics.includes(t as Topic)),
      );
      setReminders(
        Object.fromEntries(
          Object.entries(data.reminders || {}).filter(([id]) =>
            events.some((e) => e.id === id),
          ),
        ) as Record<string, string>,
      );
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
    setToast('已导出日程；没有具体时间的条目按日期导出');
  }
  const base = events.filter(
    (e) =>
      (topic === '全部' || e.topics.includes(topic)) &&
      (kind === '全部' || e.kind === kind) &&
      (!mine ||
        saved.includes(e.id) ||
        e.topics.some((t) => subscribed.includes(t))) &&
      (!query ||
        [e.title, e.source, ...e.topics]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())),
  );
  const scheduled = base
    .filter(
      (e) =>
        e.status !== '待确认' &&
        (view === 'month'
          ? overlapsRange(
              e,
              week.slice(0, 7) + '-01',
              shiftDate(
                new Date(
                  Date.UTC(
                    Number(week.slice(0, 4)),
                    Number(week.slice(5, 7)),
                    1,
                  ),
                )
                  .toISOString()
                  .slice(0, 10),
                -1,
              ),
            )
          : overlapsRange(e, week, shiftDate(week, 6))) &&
        (!day || view === 'month' || occursOn(e, day)),
    )
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        (a.time || '99').localeCompare(b.time || '99'),
    );
  const days = Array.from({ length: 7 }, (_, i) => shiftDate(week, i));
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
    setMine(false);
    setDay('');
    setWeek(mondayOf(beijingToday()));
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
  const listDate = (e: CalendarEvent) => day || (e.date < week ? week : e.date);
  function row(e: CalendarEvent) {
    return (
      <article
        className={'event-row ' + (e.real ? 'verified-row' : '')}
        key={e.id}
      >
        <div className="event-time">
          <strong className={!e.time && !e.allDay ? 'date-only-label' : ''}>
            {e.time || (e.allDay ? '全天' : '按日期')}
          </strong>
          <span>{e.region}</span>
        </div>
        <div className="event-main">
          <div className="eyebrow">
            <span className={'tag ' + color(e.topics[0])}>{e.topics[0]}</span>
          </div>
          <button className="event-title" onClick={() => setSelected(e)}>
            {e.title}
            <ChevronRight size={16} />
          </button>
          {e.kind === '指标' && (e.previous || e.actual) ? (
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
                  {e.actual || '未收录'}
                </b>
              </span>
              <small>{e.unit}</small>
            </div>
          ) : (
            <p className="event-summary">{e.summary}</p>
          )}
          <div className="event-foot">
            <span>{e.source}</span>
            {e.endDate && e.endDate !== e.date && (
              <span>
                {dateLabel(e.date)} — {dateLabel(e.endDate)}
              </span>
            )}
            {e.oldDate && (
              <span className="changed">
                原定 {dateLabel(e.oldDate)} → {dateLabel(e.date)}
              </span>
            )}
          </div>
        </div>
        <div className="row-actions">
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
          <button
            className="avatar"
            onClick={() => setModal('demo')}
            aria-label="打开数据与功能说明"
          >
            J
          </button>
        </div>
      </header>
      <main className="workspace">
        <div className="calendar-top">
          <div className="title-block">
            <h1>财经日历</h1>
            <button className="sample-badge" onClick={() => setModal('demo')}>
              <Info size={13} />
              数据更新 {beijingToday(new Date(dataset.updatedAt)).slice(5)}
            </button>
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
            <div className="side-heading">主题日历</div>
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
                    <b>{events.filter((e) => e.topics.includes(t)).length}</b>
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
            <div className="sidebar-bottom">
              <button
                className="membership-button"
                onClick={() => setModal('member')}
              >
                <span className="brand-plus">PLUS</span>
                <span>会员权益</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </aside>
          <section className="calendar-main">
            <div className="main-toolbar">
              <div className="period-control">
                <button
                  className="icon-button"
                  onClick={() => changeWeek(-1)}
                  aria-label={view === 'month' ? '上一月' : '上一周'}
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
                  aria-label={view === 'month' ? '下一月' : '下一周'}
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  className="today-button"
                  onClick={() => {
                    setWeek(mondayOf(beijingToday()));
                    setToday(beijingToday());
                    setDay(beijingToday());
                    setView('week');
                  }}
                >
                  今日
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
                      (d === today ? 'today' : '')
                    }
                    key={d}
                  >
                    <span>周{weekdays[i]}</span>
                    <b>{Number(d.slice(8))}</b>
                  </button>
                ))}
              </div>
            )}
            <div className="filters">
              <div className="search-box">
                <Search size={16} />
                <input
                  aria-label="搜索事件、来源或主题"
                  placeholder="搜索事件、来源、主题"
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
            </div>
            {view === 'week' ? (
              <div className="event-list">
                {days
                  .filter((d) => scheduled.some((e) => listDate(e) === d))
                  .map((d) => (
                    <section key={d}>
                      <div className="day-heading">
                        <span>
                          {dateLabel(d)}
                          <small>星期{weekdays[days.indexOf(d)]}</small>
                          {d === today && <i>今日</i>}
                        </span>
                        <b>
                          {scheduled.filter((e) => listDate(e) === d).length} 项
                        </b>
                      </div>
                      {scheduled.filter((e) => listDate(e) === d).map(row)}
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
                    <span className={d === today ? 'today-number' : ''}>
                      {Number(d.slice(8))}
                    </span>
                    {scheduled
                      .filter((e) => occursOn(e, d))
                      .map((e) => (
                        <button
                          onClick={() => setSelected(e)}
                          className={color(e.topics[0])}
                          key={e.id}
                        >
                          <span>
                            {e.time || (e.allDay ? '全天' : '按日期')}
                          </span>
                          {e.title}
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
                <p>试试其他主题或日期。</p>
                <button className="outline-button" onClick={reset}>
                  重置筛选
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
      <footer className="page-footer">
        <span>金十 PLUS 日历</span>
        <a href="/proposal.html">
          产品方案 <ArrowUpRight size={13} />
        </a>
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
              <span>事件详情</span>
            </div>
            <SheetTitle>{selected?.title}</SheetTitle>
            <SheetDescription>
              {selected?.source} ·{' '}
              {selected?.checkedAt &&
                beijingToday(new Date(selected.checkedAt))}{' '}
              采集
            </SheetDescription>
          </SheetHeader>
          {selected && (
            <div className="detail-body">
              <div className="detail-meta">
                <span>
                  <CalendarDays size={16} />
                  {selected.status === '待确认'
                    ? windowLabel(selected.date)
                    : selected.date}{' '}
                  {selected.endDate && selected.endDate !== selected.date
                    ? ' — ' + selected.endDate
                    : ''}{' '}
                  {selected.time || (selected.allDay ? '全天' : '按日期')}
                </span>
                <span className="detail-status">
                  {selected.kind} ·{' '}
                  {(selected.endDate || selected.date) < today
                    ? '日程已过'
                    : '官方已列日程'}
                </span>
              </div>
              {selected.oldDate && (
                <p className="detail-date-change">
                  原定 {selected.oldDate} → {selected.date}
                </p>
              )}
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
                    公布值<strong>{selected.actual || '未收录'}</strong>
                  </div>
                  <p>
                    {selected.unit} · 统计期：{selected.period} ·
                    当前收录发布日程，数值未接入
                  </p>
                </div>
              )}
              <section className="source-proof">
                <h3>
                  <ExternalLink size={16} />
                  信息来源
                </h3>
                <b>{selected.source}</b>
                <p>
                  {selected.timeNote ||
                    (selected.allDay
                      ? '日期以主办方当地日程为准。'
                      : '本站收录主办方当地日期，具体时刻尚未收录。')}
                </p>
                {selected.sourceNote && <p>{selected.sourceNote}</p>}
                <p>
                  {selected.acquisition === 'automated'
                    ? '公开页面采集'
                    : '官方页面人工核对'}{' '}
                  · {beijingToday(new Date(selected.checkedAt))}
                </p>
                <a href={selected.url} target="_blank" rel="noreferrer">
                  查看官方来源 <ArrowUpRight size={15} />
                </a>
                {selected.changeSourceUrl && (
                  <a
                    href={selected.changeSourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    查看改期通知 <ArrowUpRight size={15} />
                  </a>
                )}
              </section>
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
                ? '数据与功能说明'
                : modal === 'member'
                  ? 'PLUS 日历权益'
                  : modal === 'subscriptions'
                    ? '管理主题订阅'
                    : '设置日程提醒'}
            </DialogTitle>
            <DialogDescription>
              设置仅保存在此浏览器，不发送实际通知或产生费用。
            </DialogDescription>
          </DialogHeader>
          {modal === 'demo' && (
            <div className="dialog-body">
              <p>
                已收录 {events.length} 项真实日程，来自 {dataset.sources.length}{' '}
                个官方信源入口，覆盖 {dataset.coverageStart} 至{' '}
                {dataset.coverageEnd}。当前为{' '}
                {beijingToday(new Date(dataset.updatedAt))}{' '}
                采集快照，尚未启用定时更新；营收等公布数值尚未接入。
              </p>
              <div className="source-directory">
                {dataset.sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{source.name}</span>
                    <small>
                      {source.count} 项 ·{' '}
                      {source.mode === 'automated' ? '页面采集' : '人工核对'} ·{' '}
                      {beijingToday(new Date(source.checkedAt))}
                    </small>
                  </a>
                ))}
              </div>
              <label className="setting-line" htmlFor="member-view">
                <span>体验 PLUS 会员视角</span>
                <Switch
                  id="member-view"
                  checked={member}
                  onCheckedChange={setMember}
                />
              </label>
              <p className="muted">会员切换仅用于体验。</p>
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
                  <b>更多主题日历</b>
                  <p>{topics.length} 类产业主题，支持订阅与日程提醒</p>
                </div>
              </div>
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
                  <label
                    className="setting-line"
                    key={t}
                    htmlFor={`subscription-${i}`}
                  >
                    <span>
                      <Icon size={18} />
                      {t}
                    </span>
                    <Switch
                      id={`subscription-${i}`}
                      checked={subscribed.includes(t)}
                      onCheckedChange={() => subscribe(t)}
                    />
                  </label>
                );
              })}
              <p className="muted">已订阅主题会出现在“我的日历”。</p>
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
              <p className="muted">提醒设置仅供体验。</p>
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
        <output className="toast">
          <Check size={17} />
          {toast}
        </output>
      )}
    </div>
  );
}
