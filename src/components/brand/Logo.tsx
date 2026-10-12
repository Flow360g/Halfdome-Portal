import { useResolvedTheme } from '../../hooks/useResolvedTheme';
import { logos } from './assets';

interface LogoProps {
  height?: number;
  className?: string;
}

/** The halfdome wordmark, with the dome matched to the page accent. */
export function Logo({ height = 28, className }: LogoProps) {
  const theme = useResolvedTheme();
  return (
    <img
      className={['hd-logo', className].filter(Boolean).join(' ')}
      src={logos[theme]}
      alt="Half Dome"
      width={Math.round(height * 5.59)}
      height={height}
      style={{ height }}
    />
  );
}
