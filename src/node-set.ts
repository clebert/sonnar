import {fn} from './fn';
import {Literal, Primitive} from './primitive';

export type AxisName =
  | 'ancestor-or-self'
  | 'ancestor'
  | 'child'
  | 'descendant-or-self'
  | 'descendant'
  | 'following-sibling'
  | 'following'
  | 'parent'
  | 'preceding-sibling'
  | 'preceding'
  | 'self';

export class NodeSet extends Primitive {
  static attribute(attributeName: string): NodeSet {
    if (attributeName.startsWith('.')) {
      return NodeSet.attribute('class').filter(
        fn(
          'contains',
          fn('concat', ' ', fn('normalize-space', NodeSet.node('self')), ' '),
          ` ${attributeName.slice(1)} `
        )
      );
    }

    if (attributeName.startsWith('#')) {
      return NodeSet.attribute('id').filter(
        NodeSet.node('self').is('=', attributeName.slice(1))
      );
    }

    return new NodeSet(`attribute::${attributeName}`);
  }

  static comment(axisName: AxisName = 'child'): NodeSet {
    return new NodeSet(`${axisName}::comment()`);
  }

  static element(elementName: string, axisName: AxisName = 'child'): NodeSet {
    return new NodeSet(`${axisName}::${elementName}`);
  }

  static namespace(namespaceName: string): NodeSet {
    return new NodeSet(`namespace::${namespaceName}`);
  }

  static node(axisName: AxisName = 'child'): NodeSet {
    return new NodeSet(`${axisName}::node()`);
  }

  static processingInstruction(
    axisName: AxisName = 'child',
    targetName: string = ''
  ): NodeSet {
    return new NodeSet(`${axisName}::processing-instruction(${targetName})`);
  }

  static root(): NodeSet {
    return new NodeSet('/');
  }

  static text(axisName: AxisName = 'child'): NodeSet {
    return new NodeSet(`${axisName}::text()`);
  }

  filter(predicate: Literal | Primitive): NodeSet {
    return new NodeSet(
      `${this.expression}[${
        (Primitive.isLiteral(predicate)
          ? Primitive.literal(predicate)
          : predicate
        ).expression
      }]`
    );
  }

  path(operand: NodeSet): NodeSet {
    return new NodeSet(
      `${this.expression === '/' ? '/' : `${this.expression} /`} ${
        operand.expression
      }`
    );
  }

  union(operand: NodeSet): NodeSet {
    return new NodeSet(`${this.expression} | ${operand.expression}`);
  }
}
