import type { IconName } from '../../content/hub';
import { useResolvedTheme } from '../../hooks/useResolvedTheme';
import { iconSrc } from './assets';

interface BrandIconProps {
  name: IconName;
  size?: number;
  className?: string;
}

/** An illustrated brand icon in the colourway that matches the page accent. */
export function BrandIcon({ name, size = 56, className }: BrandIconProps) {
  const theme = useResolvedTheme();
  return (
    <img
      className={className}
      src={iconSrc(name, theme === 'dark' ? 'green' : 'red')}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      decoding="async"
    />
  );
}
