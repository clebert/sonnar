import type {Literal} from './primitive.js';

import {fn} from './fn.js';
import {Primitive} from './primitive.js';

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
  /** Shortcut for `NodeSet.node('descendant-or-self')` */
  static any(): NodeSet {
    return NodeSet.node(`descendant-or-self`);
  }

  static attribute(attributeName: string): NodeSet {
    if (attributeName.startsWith(`.`)) {
      return NodeSet.attribute(`class`).filter(
        fn(
          `contains`,
          fn(`concat`, ` `, fn(`normalize-space`, NodeSet.self()), ` `),
          ` ${attributeName.slice(1)} `,
        ),
      );
    }

    if (attributeName.startsWith(`#`)) {
      return NodeSet.attribute(`id`).filter(
        NodeSet.self().is(`=`, attributeName.slice(1)),
      );
    }

    return new NodeSet(`attribute::${attributeName}`);
  }

  static comment(axisName: AxisName = `child`): NodeSet {
    return new NodeSet(`${axisName}::comment()`);
  }

  static element(elementName: string, axisName: AxisName = `child`): NodeSet {
    return new NodeSet(`${axisName}::${elementName}`);
  }

  static namespace(namespaceName: string): NodeSet {
    return new NodeSet(`namespace::${namespaceName}`);
  }

  static node(axisName: AxisName = `child`): NodeSet {
    return new NodeSet(`${axisName}::node()`);
  }

  /** Shortcut for `NodeSet.node('parent')` */
  static parent(): NodeSet {
    return NodeSet.node(`parent`);
  }

  static processingInstruction(
    axisName: AxisName = `child`,
    targetName: string = ``,
  ): NodeSet {
    return new NodeSet(`${axisName}::processing-instruction(${targetName})`);
  }

  static root(): NodeSet {
    return new NodeSet(`/`);
  }

  /** Shortcut for `NodeSet.node('self')` */
  static self(): NodeSet {
    return NodeSet.node(`self`);
  }

  static text(axisName: AxisName = `child`): NodeSet {
    return new NodeSet(`${axisName}::text()`);
  }

  filter(predicate: Literal | Primitive): NodeSet {
    return new NodeSet(
      `${this.expression}[${
        (Primitive.isLiteral(predicate)
          ? Primitive.literal(predicate)
          : predicate
        ).expression
      }]`,
    );
  }

  path(operand: NodeSet): NodeSet {
    return new NodeSet(
      `${this.expression === `/` ? `/` : `${this.expression} /`} ${
        operand.expression
      }`,
    );
  }

  union(operand: NodeSet): NodeSet {
    return new NodeSet(`${this.expression} | ${operand.expression}`);
  }
}
