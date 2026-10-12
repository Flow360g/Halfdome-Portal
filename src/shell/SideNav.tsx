import type { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fmtMedium, isoWeek, localToday, parts, dayOf, trimester } from '../calendar/dates';
import { DOME, LOGO } from './brand';
import { NAV_ITEMS, type NavItem } from './navItems';
import { ThemeImg } from './ThemeImg';

interface Props {
  collapsed: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  mode: 'rail' | 'drawer';
}

export function SideNav({ collapsed, onToggle, onClose, mode }: Props) {
  const isCollapsed = mode === 'rail' && collapsed;
  return (
    <nav className="sidenav" data-collapsed={isCollapsed} data-mode={mode} aria-label="Portal">
      <div className="sidenav__brand">
        <Link to="/" className="brandmark" aria-label="Half Dome portal home">
          <span className="brandmark__logo" aria-hidden="true">
            <span className="brandmark__part brandmark__part--left">
              <ThemeImg light={LOGO.left.light} dark={LOGO.left.dark} />
            </span>
            <span className="brandmark__part brandmark__part--dome">
              <ThemeImg light={LOGO.dome.light} dark={LOGO.dome.dark} />
            </span>
            <span className="brandmark__part brandmark__part--right">
              <ThemeImg light={LOGO.right.light} dark={LOGO.right.dark} />
            </span>
          </span>
        </Link>
        {mode === 'drawer' && (
          <button type="button" className="sidenav__close" onClick={onClose} aria-label="Close menu">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>

      <p className="sidenav__label">Portal</p>
      <ul className="sidenav__list">
        {NAV_ITEMS.map((item, i) => (
          <li key={item.id} style={{ '--i': i } as CSSProperties}>
            <NavEntry item={item} collapsed={isCollapsed} />
          </li>
        ))}
      </ul>

      <div className="sidenav__spacer" />

      <TodayCard collapsed={isCollapsed} />

      {mode === 'rail' && (
        <button
          type="button"
          className="sidenav__toggle"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
          data-tip={collapsed ? 'Expand menu  [' : undefined}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5h16M4 12h10M4 19h16" />
            <path className="sidenav__toggle-chevron" d="M20 9l-3 3 3 3" />
          </svg>
          <span className="sidenav__toggle-text">Collapse menu</span>
          <kbd className="sidenav__kbd">[</kbd>
        </button>
      )}
    </nav>
  );
}

function NavEntry({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const { pathname } = useLocation();
  const active = item.matches ? item.matches(pathname) : pathname === item.to;
  const inner = (
    <>
      <span className="navitem__icon">
        <ThemeImg light={item.icon.light} dark={item.icon.dark} width={48} height={48} />
      </span>
      <span className="navitem__text">
        <span className="navitem__label">
          {item.label}
          {item.href && (
            <svg className="navitem__external" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 16L16 8M10 8h6v6" />
            </svg>
          )}
        </span>
        <span className="navitem__meta">{item.description}</span>
      </span>
      <span className="navitem__here" aria-hidden="true">
        <ThemeImg light={DOME.light} dark={DOME.dark} />
      </span>
    </>
  );

  if (item.href) {
    return (
      <a
        className="navitem"
        href={item.href}
        target="_blank"
        rel="noreferrer"
        data-tip={collapsed ? item.label : undefined}
        aria-label={`${item.label} (opens in a new tab)`}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link
      className={active ? 'navitem active' : 'navitem'}
      to={item.to ?? '/'}
      aria-current={active ? 'page' : undefined}
      data-tip={collapsed ? item.label : undefined}
      aria-label={collapsed ? item.label : undefined}
    >
      {inner}
    </Link>
  );
}

function TodayCard({ collapsed }: { collapsed: boolean }) {
  const today = localToday();
  const { y } = parts(today);
  const week = isoWeek(today).week;
  const t = trimester(today).n;
  const yearStart = dayOf(y, 1, 1);
  const yearDays = dayOf(y + 1, 1, 1) - yearStart;
  const progress = Math.round(((today - yearStart + 1) / yearDays) * 100);

  return (
    <Link
      to="/calendar"
      state={{ jump: 'today' }}
      className="navtoday"
      aria-label={`Today is ${fmtMedium(today)}, week ${week}, trimester ${t}. Open the agency calendar.`}
      data-tip={collapsed ? `${fmtMedium(today)} · Week ${week}` : undefined}
    >
      <span className="navtoday__full">
        <span className="navtoday__eyebrow">Today</span>
        <span className="navtoday__date">{fmtMedium(today)}</span>
        <span className="navtoday__meta">
          Week {week} · Trimester {t}
        </span>
        <span className="navtoday__bar" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </span>
        <span className="navtoday__caption">
          {progress}% through {y}
        </span>
      </span>
      <span className="navtoday__mini" aria-hidden="true">
        <span className="navtoday__mini-label">Wk</span>
        <span className="navtoday__mini-week">{week}</span>
      </span>
    </Link>
  );
}
