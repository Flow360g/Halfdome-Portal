import type { ArtKey, IconName } from '../content/agencyCalendar';
import heroArt from '../assets/calendar/art/hero-holiday-lemon.webp';
import { DOME } from '../shell/brand';

const iconFiles = import.meta.glob('../assets/calendar/icons/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const artFiles = import.meta.glob('../assets/calendar/art/*.webp', { eager: true, import: 'default' }) as Record<string, string>;

export function iconSrc(name: IconName): { light: string; dark: string } {
  return {
    light: iconFiles[`../assets/calendar/icons/${name}-red.webp`],
    dark: iconFiles[`../assets/calendar/icons/${name}-green.webp`],
  };
}

export function artSrc(key: ArtKey): string {
  return artFiles[`../assets/calendar/art/${key}.webp`];
}

export const HERO_ART = heroArt;
export { DOME };
