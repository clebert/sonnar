import {Combinator, Combinators, query} from './query';

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_combinator
 */
export function descendant<TCombinators extends Combinators>(
  selector: string,
  combinators: TCombinators
): Combinator<TCombinators> {
  return (firstSelector) => query(firstSelector + ' ' + selector, combinators);
}
