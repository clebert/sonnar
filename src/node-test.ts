import {NodeSet} from './node-set';

export class NodeTest {
  readonly #prefix: string;

  constructor(prefix: string) {
    this.#prefix = prefix;
  }

  comment(): NodeSet {
    return new NodeSet(`${this.#prefix}comment()`);
  }

  node(): NodeSet {
    return new NodeSet(`${this.#prefix}node()`);
  }

  processingInstruction(targetName: string = ''): NodeSet {
    return new NodeSet(`${this.#prefix}processing-instruction(${targetName})`);
  }

  text(): NodeSet {
    return new NodeSet(`${this.#prefix}text()`);
  }
}
