import {NodeTest} from './node-test';
import {Literal, Primitive} from './primitive';

export type AxisName =
  | 'ancestor-or-self'
  | 'ancestor'
  | 'attribute'
  | 'child'
  | 'descendant-or-self'
  | 'descendant'
  | 'following-sibling'
  | 'following'
  | 'namespace'
  | 'parent'
  | 'preceding-sibling'
  | 'preceding'
  | 'self';

export class NodeSet extends Primitive {
  static root(): NodeSet {
    return new NodeSet('/');
  }

  static select(axisName: AxisName): NodeTest;
  static select(axisName: AxisName, nodeName: string): NodeSet;

  static select(axisName: AxisName, nodeName?: string): NodeSet | NodeTest {
    const prefix = `${axisName}::`;

    return nodeName ? new NodeSet(prefix + nodeName) : new NodeTest(prefix);
  }

  protected createInstance(expression: string): this {
    return new NodeSet(expression) as this;
  }

  filter(predicate: Literal | Primitive): this {
    return this.createInstance(
      `${this.expression}[${Primitive.literal(predicate).expression}]`
    );
  }

  path(operand: NodeSet): this {
    const delimiter = this.expression === '/' ? ' ' : ' / ';

    return this.createInstance(
      `${this.expression}${delimiter}${operand.expression}`
    );
  }

  union(operand: NodeSet): this {
    return this.createInstance(
      `${this.expression} | ${Primitive.literal(operand).expression}`
    );
  }
}
