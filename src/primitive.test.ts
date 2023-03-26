import {Primitive} from './primitive.js';
import {describe, expect, test} from '@jest/globals';

describe(`Primitive`, () => {
  test(`static isLiteral()`, () => {
    expect(Primitive.isLiteral(false)).toBe(true);
    expect(Primitive.isLiteral(0)).toBe(true);
    expect(Primitive.isLiteral(``)).toBe(true);
    expect(Primitive.isLiteral(Primitive.literal(false))).toBe(false);
  });

  test(`static literal()`, () => {
    expect(Primitive.literal(false).expression).toBe(`false()`);
    expect(Primitive.literal(true).expression).toBe(`true()`);
    expect(Primitive.literal(0).expression).toBe(`0`);
    expect(Primitive.literal(``).expression).toBe(`""`);
    expect(Primitive.literal(`"foo"`).expression).toBe(`"\\"foo\\""`);
  });

  test(`and()`, () => {
    const {expression} = Primitive.literal(`0`)
      .and(Primitive.literal(`1`).and(`2`))
      .and(`3`);

    expect(expression).toBe(`(("0" and ("1" and "2")) and "3")`);
  });

  test(`or()`, () => {
    const {expression} = Primitive.literal(`0`)
      .or(Primitive.literal(`1`).or(`2`))
      .or(`3`);

    expect(expression).toBe(`(("0" or ("1" or "2")) or "3")`);
  });

  test(`is()`, () => {
    expect(
      [
        Primitive.literal(`0`).is(`=`, `1`),
        Primitive.literal(`0`).is(`=`, `1`).is(`!=`, `2`),
        Primitive.literal(`0`).is(`=`, `1`).is(`<`, `2`),
        Primitive.literal(`0`).is(`=`, `1`).is(`<=`, `2`),
        Primitive.literal(`0`).is(`=`, `1`).is(`>`, `2`),
        Primitive.literal(`0`).is(`=`, `1`).is(`>=`, `2`),
      ].map(({expression}) => expression),
    ).toEqual([
      `("0" = "1")`,
      `(("0" = "1") != "2")`,
      `(("0" = "1") < "2")`,
      `(("0" = "1") <= "2")`,
      `(("0" = "1") > "2")`,
      `(("0" = "1") >= "2")`,
    ]);
  });

  test(`add()`, () => {
    const {expression} = Primitive.literal(`0`)
      .add(Primitive.literal(`1`).add(`2`))
      .add(`3`);

    expect(expression).toBe(`(("0" + ("1" + "2")) + "3")`);
  });

  test(`subtract()`, () => {
    const {expression} = Primitive.literal(`0`)
      .subtract(Primitive.literal(`1`).subtract(`2`))
      .subtract(`3`);

    expect(expression).toBe(`(("0" - ("1" - "2")) - "3")`);
  });

  test(`multiply()`, () => {
    const {expression} = Primitive.literal(`0`)
      .multiply(Primitive.literal(`1`).multiply(`2`))
      .multiply(`3`);

    expect(expression).toBe(`(("0" * ("1" * "2")) * "3")`);
  });

  test(`divide()`, () => {
    const {expression} = Primitive.literal(`0`)
      .divide(Primitive.literal(`1`).divide(`2`))
      .divide(`3`);

    expect(expression).toBe(`(("0" div ("1" div "2")) div "3")`);
  });

  test(`mod()`, () => {
    const {expression} = Primitive.literal(`0`)
      .mod(Primitive.literal(`1`).mod(`2`))
      .mod(`3`);

    expect(expression).toBe(`(("0" mod ("1" mod "2")) mod "3")`);
  });
});
