import type { IconName } from '../content/agencyCalendar';
import { ThemeImg } from '../shell/ThemeImg';
import { iconSrc } from './assets';

/** An illustrated brand icon on its snow tile, so the black outline holds up in dark mode. */
export function BrandIcon({ name, size = 48, className = '' }: { name: IconName; size?: number; className?: string }) {
  const src = iconSrc(name);
  return (
    <span className={`brand-icon ${className}`} style={{ width: size + 8, height: size + 8 }}>
      <ThemeImg light={src.light} dark={src.dark} width={size} height={size} loading="lazy" />
    </span>
  );
}
