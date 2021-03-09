export type Query<
  TCombinators extends Combinators
> = CombinatorialQueries<TCombinators> &
  ((...discriminators: readonly Discriminator[]) => VirtualNode<TCombinators>);

export type CombinatorialQueries<TCombinators extends Combinators> = {
  readonly [TKey in keyof TCombinators]: ReturnType<TCombinators[TKey]>;
};

export interface Combinators {
  readonly [key: string]: Combinator<any>;
}

export type Combinator<TCombinators extends Combinators> = (
  firstSelector: string
) => Query<TCombinators>;

export type Discriminator = (selector: string) => string;

export type VirtualNode<
  TCombinators extends Combinators
> = CombinatorialQueries<TCombinators> & {readonly selector: string};

export function query<TCombinators extends Combinators>(
  selector: string,
  combinators: TCombinators
): Query<TCombinators> {
  return Object.assign((...discriminators: readonly Discriminator[]) => {
    const discriminatedSelector = discriminators.reduce(
      (accu, discriminator) => discriminator(accu),
      selector.trim()
    );

    return {
      ...createCombinatorialQueries(combinators, discriminatedSelector),
      selector: discriminatedSelector,
    };
  }, createCombinatorialQueries(combinators));
}

function createCombinatorialQueries<TCombinators extends Combinators>(
  combinators: TCombinators,
  firstSelector: string = ''
): CombinatorialQueries<TCombinators> {
  return Object.entries(combinators).reduce((accu, [key, combinator]) => {
    accu[key] = combinator(firstSelector);

    return accu;
  }, {} as Record<string, Query<any>>) as any;
}
