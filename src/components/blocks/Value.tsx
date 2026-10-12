import type { ReactNode } from 'react';
import curious from '../../assets/values/constantly-curious.webp';
import classy from '../../assets/values/stay-classy.webp';
import mondays from '../../assets/values/love-mondays.webp';
import blowUp from '../../assets/values/blow-things-up.webp';

const images = {
  'constantly-curious': curious,
  'stay-classy': classy,
  'love-mondays': mondays,
  'blow-things-up': blowUp,
};

type ValueName = keyof typeof images;

/*
 * Each value keeps its own brand colour. Camas and white fir are only legible
 * as text on black oak, so those panels are dark in both themes; Stay classy
 * sits on snow so its sequoia statement keeps contrast.
 */
const tone: Record<ValueName, 'purple' | 'red' | 'gold'> = {
  'constantly-curious': 'purple',
  'stay-classy': 'red',
  'love-mondays': 'gold',
  'blow-things-up': 'gold',
};

export function Value({ name, statement, children }: { name: ValueName; statement: string; children: ReactNode }) {
  return (
    <section className={`block-value block-value--${tone[name]}`} aria-label={statement}>
      <img className="block-value__image" src={images[name]} alt="" aria-hidden="true" loading="lazy" />
      <div className="block-value__text">
        <h2 className="hd-statement block-value__statement">{statement}</h2>
        <div className="block-value__body">{children}</div>
      </div>
    </section>
  );
}

export function Values({ children }: { children: ReactNode }) {
  return <div className="block-values">{children}</div>;
}
