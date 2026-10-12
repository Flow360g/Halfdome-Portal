import type { ImgHTMLAttributes } from 'react';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { light: string; dark: string };

/**
 * Brand marks swap colourway with the theme: red on light grounds, White Fir gold on dark.
 * Both images render and CSS shows the right one, so it follows the viewer's theme with no JS.
 */
export function ThemeImg({ light, dark, className = '', alt = '', ...rest }: Props) {
  return (
    <>
      <img {...rest} src={light} alt={alt} className={`${className} theme-light`} />
      <img {...rest} src={dark} alt="" aria-hidden="true" className={`${className} theme-dark`} />
    </>
  );
}
