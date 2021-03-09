import {Discriminator} from './query';

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
 */
export function pseudoClass(value: string): Discriminator {
  return (selector) => selector + value;
}
