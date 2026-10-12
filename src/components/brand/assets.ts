import type { IconName } from '../../content/hub';

import logoBlackRed from '../../assets/brand/logo-black-red.webp';
import logoWhiteGreen from '../../assets/brand/logo-white-green.webp';
import taglineBlackRed from '../../assets/brand/tagline-black-red.webp';
import taglineWhiteGreen from '../../assets/brand/tagline-white-green.webp';

/*
 * Light pages use the sequoia accent and dark pages the white fir accent, so
 * every mark has a red version for light and a gold ("Green" in the brand
 * files) version for dark, matching the design system's colourway rule.
 */
export const logos = { light: logoBlackRed, dark: logoWhiteGreen };
export const taglines = { light: taglineBlackRed, dark: taglineWhiteGreen };

const iconFiles = import.meta.glob<string>('../../assets/icons/*.webp', {
  eager: true,
  import: 'default',
});

export function iconSrc(name: IconName, colour: 'red' | 'green') {
  return iconFiles[`../../assets/icons/${name}-${colour}.webp`];
}
