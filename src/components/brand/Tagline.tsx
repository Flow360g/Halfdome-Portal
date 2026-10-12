import { useResolvedTheme } from '../../hooks/useResolvedTheme';
import { taglines } from './assets';

/** The vertical Whole Potential.™ lock-up, made to run up the edge of a layout. */
export function Tagline({ height = 200, className }: { height?: number; className?: string }) {
  const theme = useResolvedTheme();
  return (
    <img
      className={['hd-tagline', className].filter(Boolean).join(' ')}
      src={taglines[theme]}
      alt="Whole Potential."
      width={Math.round(height * 0.29)}
      height={height}
      style={{ height }}
    />
  );
}
