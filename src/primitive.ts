export type Literal = boolean | number | string;
export type ComparisonOperator = '=' | '!=' | '<' | '<=' | '>' | '>=';

export class Primitive {
  static isLiteral(value: unknown): value is Literal {
    switch (typeof value) {
      case `boolean`:
      case `number`:
      case `string`:
        return true;
    }

    return false;
  }

  static literal(value: Literal): Primitive {
    return new Primitive(
      typeof value === `boolean`
        ? value
          ? `true()`
          : `false()`
        : JSON.stringify(value),
    );
  }

  constructor(readonly expression: string) {}

  and(operand: Literal | Primitive): Primitive {
    return this.#operation(`and`, operand);
  }

  or(operand: Literal | Primitive): Primitive {
    return this.#operation(`or`, operand);
  }

  is(operator: ComparisonOperator, operand: Literal | Primitive): Primitive {
    return this.#operation(operator, operand);
  }

  add(operand: Literal | Primitive): Primitive {
    return this.#operation(`+`, operand);
  }

  subtract(operand: Literal | Primitive): Primitive {
    return this.#operation(`-`, operand);
  }

  multiply(operand: Literal | Primitive): Primitive {
    return this.#operation(`*`, operand);
  }

  divide(operand: Literal | Primitive): Primitive {
    return this.#operation(`div`, operand);
  }

  mod(operand: Literal | Primitive): Primitive {
    return this.#operation(`mod`, operand);
  }

  readonly #operation = (operator: string, operand: Literal | Primitive) => {
    return new Primitive(
      `(${this.expression} ${operator} ${
        (Primitive.isLiteral(operand) ? Primitive.literal(operand) : operand)
          .expression
      })`,
    );
  };
}
