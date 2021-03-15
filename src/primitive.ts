export type Literal = boolean | number | string;
export type ComparisonOperator = '=' | '!=' | '<' | '<=' | '>' | '>=';

export class Primitive {
  static literal<TValue extends Literal | Primitive>(
    value: TValue
  ): TValue extends Literal ? Primitive : TValue;

  static literal(value: Literal | Primitive): Primitive {
    switch (typeof value) {
      case 'boolean':
        return new Primitive(value ? 'true()' : 'false()');
      case 'number':
        return new Primitive(String(value));
      case 'string':
        return new Primitive(JSON.stringify(value));
    }

    return value;
  }

  constructor(readonly expression: string) {}

  protected createInstance(expression: string): this {
    return new Primitive(expression) as this;
  }

  enclose(): this {
    return /^\(.*\)$/.test(this.expression)
      ? this
      : this.createInstance(`(${this.expression})`);
  }

  or(operand: Literal | Primitive): this {
    return this.createInstance(
      `${this.expression} or ${Primitive.literal(operand).expression}`
    );
  }

  and(operand: Literal | Primitive): this {
    return this.createInstance(
      `${this.expression} and ${Primitive.literal(operand).expression}`
    );
  }

  is(operator: ComparisonOperator, operand: Literal | Primitive): this {
    return this.createInstance(
      `${this.expression} ${operator} ${Primitive.literal(operand).expression}`
    );
  }

  add(operand: Literal | Primitive): this {
    return this.createInstance(
      `${this.expression} + ${Primitive.literal(operand).expression}`
    );
  }

  subtract(operand: Literal | Primitive): this {
    return this.createInstance(
      `${this.expression} - ${Primitive.literal(operand).expression}`
    );
  }

  multiply(operand: Literal | Primitive): this {
    return this.createInstance(
      `${this.expression} * ${Primitive.literal(operand).expression}`
    );
  }

  divide(operand: Literal | Primitive): this {
    return this.createInstance(
      `${this.expression} div ${Primitive.literal(operand).expression}`
    );
  }

  mod(operand: Literal | Primitive): this {
    return this.createInstance(
      `${this.expression} mod ${Primitive.literal(operand).expression}`
    );
  }
}
