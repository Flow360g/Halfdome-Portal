import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LOGO } from './brand';
import { SideNav } from './SideNav';
import { ThemeImg } from './ThemeImg';
import { usePersistentState } from './usePersistentState';

/** The portal frame: a collapsible side nav on wide screens, a top bar and drawer on small ones. */
export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = usePersistentState('hd-portal.nav-collapsed', false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);

  useEffect(() => setDrawerOpen(false), [location.pathname]);

  // "[" folds the nav away, like most design tools.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === '[' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
      if (e.key === 'Escape' && drawerOpen) setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, setCollapsed]);

  useEffect(() => {
    if (drawerOpen) drawer.current?.querySelector<HTMLElement>('a, button')?.focus();
    else if (document.activeElement && drawer.current?.contains(document.activeElement)) menuButton.current?.focus();
  }, [drawerOpen]);

  return (
    <div className="shell" data-collapsed={collapsed}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <aside className="shell__rail">
        <SideNav mode="rail" collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </aside>

      <header className="topbar">
        <button
          ref={menuButton}
          type="button"
          className="topbar__menu"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h10" />
          </svg>
        </button>
        <Link to="/" className="topbar__logo" aria-label="Half Dome portal home">
          <span className="topbar__logo-slices" aria-hidden="true">
            <ThemeImg light={LOGO.left.light} dark={LOGO.left.dark} />
            <ThemeImg light={LOGO.dome.light} dark={LOGO.dome.dark} />
            <ThemeImg light={LOGO.right.light} dark={LOGO.right.dark} />
          </span>
        </Link>
      </header>

      <div className="shell__drawer" data-open={drawerOpen} ref={drawer} inert={!drawerOpen}>
        <button type="button" className="shell__scrim" aria-label="Close menu" tabIndex={-1} onClick={() => setDrawerOpen(false)} />
        <div className="shell__drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <SideNav mode="drawer" collapsed={false} onClose={() => setDrawerOpen(false)} />
        </div>
      </div>

      <main id="main" className="shell__main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
