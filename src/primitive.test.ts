import {NodeSet, Primitive, literal} from '.';

describe('Primitive', () => {
  test('static literal()', () => {
    const value1 = literal(false);
    const value2 = literal(true);
    const value3 = literal(0);
    const value4 = literal('');
    const value5 = literal('"foo"');

    expect(value1).toBeInstanceOf(Primitive);
    expect(value1).not.toBeInstanceOf(NodeSet);
    expect(literal(value1)).toBe(value1);
    expect(value1.expression).toBe('false()');
    expect(value2.expression).toBe('true()');
    expect(value3.expression).toBe('0');
    expect(value4.expression).toBe('""');
    expect(value5.expression).toBe('"\\"foo\\""');
  });

  test('enclose()', () => {
    const value1 = literal('0').enclose();
    const value2 = value1.enclose();
    const value3 = value1.add('1').enclose();

    expect(value1).toBeInstanceOf(Primitive);
    expect(value1).not.toBeInstanceOf(NodeSet);
    expect(value1.expression).toBe('("0")');
    expect(value2).toBe(value1);
    expect(value3.expression).toBe('(("0") + "1")');
  });

  test('or()', () => {
    const value = literal('0').or('1');

    expect(value).toBeInstanceOf(Primitive);
    expect(value).not.toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('"0" or "1"');
  });

  test('and()', () => {
    const value = literal('0').and('1');

    expect(value).toBeInstanceOf(Primitive);
    expect(value).not.toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('"0" and "1"');
  });

  test('is()', () => {
    const value1 = literal('0').is('=', '1');
    const value2 = value1.is('!=', '2');
    const value3 = value1.is('<', '2');
    const value4 = value1.is('<=', '2');
    const value5 = value1.is('>', '2');
    const value6 = value1.is('>=', '2');

    expect(value1).toBeInstanceOf(Primitive);
    expect(value1).not.toBeInstanceOf(NodeSet);
    expect(value1.expression).toBe('"0" = "1"');
    expect(value2.expression).toBe('"0" = "1" != "2"');
    expect(value3.expression).toBe('"0" = "1" < "2"');
    expect(value4.expression).toBe('"0" = "1" <= "2"');
    expect(value5.expression).toBe('"0" = "1" > "2"');
    expect(value6.expression).toBe('"0" = "1" >= "2"');
  });

  test('add()', () => {
    const value = literal('0').add('1');

    expect(value).toBeInstanceOf(Primitive);
    expect(value).not.toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('"0" + "1"');
  });

  test('subtract()', () => {
    const value = literal('0').subtract('1');

    expect(value).toBeInstanceOf(Primitive);
    expect(value).not.toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('"0" - "1"');
  });

  test('multiply()', () => {
    const value = literal('0').multiply('1');

    expect(value).toBeInstanceOf(Primitive);
    expect(value).not.toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('"0" * "1"');
  });

  test('divide()', () => {
    const value = literal('0').divide('1');

    expect(value).toBeInstanceOf(Primitive);
    expect(value).not.toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('"0" div "1"');
  });

  test('mod()', () => {
    const value = literal('0').mod('1');

    expect(value).toBeInstanceOf(Primitive);
    expect(value).not.toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('"0" mod "1"');
  });
});
