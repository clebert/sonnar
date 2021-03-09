import {
  adjacentSibling,
  child,
  descendant,
  generalSibling,
  pseudoClass,
  query,
} from '.';

test('sonnar', () => {
  const Foo = query('#foo', {
    Bar: descendant('#bar', {
      Baz: adjacentSibling('#baz', {}),
    }),
    Qux: child('#qux', {}),
    Quux: generalSibling('#quux', {}),
  });

  expect(Foo().selector).toBe('#foo');
  expect(Foo().Bar().selector).toBe('#foo #bar');
  expect(Foo().Bar().Baz().selector).toBe('#foo #bar + #baz');
  expect(Foo().Qux().selector).toBe('#foo > #qux');
  expect(Foo().Quux().selector).toBe('#foo ~ #quux');

  expect(Foo.Bar().selector).toBe('#bar');
  expect(Foo.Bar.Baz().selector).toBe('+ #baz');
  expect(Foo.Bar().Baz().selector).toBe('#bar + #baz');
  expect(Foo.Qux().selector).toBe('> #qux');
  expect(Foo.Quux().selector).toBe('~ #quux');

  const a = pseudoClass(':a');
  const b = pseudoClass(':b');
  const c = pseudoClass(':c');
  const d = pseudoClass(':d');

  expect(Foo(a, b).selector).toBe('#foo:a:b');
  expect(Foo(a, b).Bar(c).selector).toBe('#foo:a:b #bar:c');
  expect(Foo(a, b).Bar(c).Baz(d).selector).toBe('#foo:a:b #bar:c + #baz:d');
  expect(Foo(a, b).Qux(c).selector).toBe('#foo:a:b > #qux:c');
  expect(Foo(a, b).Quux(c).selector).toBe('#foo:a:b ~ #quux:c');
});
