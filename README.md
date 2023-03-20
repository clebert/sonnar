# Sonnar

**Do you know [XPath 1.0](https://www.w3.org/TR/1999/REC-xpath-19991116/)?**
This is basically the more powerful sibling of CSS selectors. Built into almost
every [browser](https://caniuse.com/document-evaluate-xpath) and E2E testing
framework. The syntax and thus the DX is a bit cumbersome. Typically, an XPath
expression is written as a JavaScript string. This means there is no
IntelliSense support, no syntax highlighting, and you quickly get lost in the
parentheses. That's why I built Sonnar.

> A lightweight TypeScript API for constructing XPath 1.0 expressions.

## Installation

```
npm install sonnar
```

## Usage examples

### Find all [HackerNews](https://news.ycombinator.com) posts which have more than 50 comments

```js
import {NodeSet, fn} from 'sonnar';

const {expression} = NodeSet.any()
  .filter(NodeSet.attribute(`.athing`))
  .filter(
    NodeSet.element(`tr`, `following-sibling`)
      .filter(fn(`position`).is(`=`, 1)) // less verbose alternative: .filter(1)
      .path(NodeSet.element(`td`))
      .filter(2)
      .path(NodeSet.element(`a`))
      .filter(fn(`last`))
      .filter(fn(`substring-before`, NodeSet.text(), `\u00A0`).is(`>`, 50)),
  );

expect(expression).toBe(
  `descendant-or-self::node()[attribute::class[contains(concat(" ", normalize-space(self::node()), " "), " athing ")]][following-sibling::tr[(position() = 1)] / child::td[2] / child::a[last()][(substring-before(child::text(), "\u00A0") > 50)]]`,
);
```

<details>
  <summary>Show the XPath 1.0 expression</summary>

```
descendant-or-self::node()
  [
    attribute::class
      [contains(concat(" ", normalize-space(self::node()), " "), " athing ")]
  ]
  [
    following-sibling::tr
      [(position() = 1)]
    / child::td
      [2]
    / child::a
      [last()]
      [(substring-before(child::text(), "\u00A0") > 50)]
  ]
```

</details>

### Select a set of nodes

The following is a list of examples taken from the
[W3C specification document](https://www.w3.org/TR/1999/REC-xpath-19991116/#location-paths).

<details>
  <summary>Show the examples</summary>

```ts
import {NodeSet, fn} from 'sonnar';

// selects the para element children of the context node
NodeSet.element(`para`);

// selects all element children of the context node
NodeSet.element(`*`);

// selects all text node children of the context node
NodeSet.text();

// selects all the children of the context node, whatever their node type
NodeSet.node();

// selects the name attribute of the context node
NodeSet.attribute(`name`);

// selects all the attributes of the context node
NodeSet.attribute(`*`);

// selects the para element descendants of the context node
NodeSet.element(`para`, `descendant`);

// selects all div ancestors of the context node
NodeSet.element(`div`, `ancestor`);

// selects the div ancestors of the context node and, if the context node is a div element, the context node as well
NodeSet.element(`div`, `ancestor-or-self`);

// selects the para element descendants of the context node and, if the context node is a para element, the context node as well
NodeSet.element(`para`, `descendant-or-self`);

// selects the context node if it is a para element, and otherwise selects nothing
NodeSet.element(`para`, `self`);

// selects the para element descendants of the chapter element children of the context node
NodeSet.element(`chapter`).path(NodeSet.element(`para`, `descendant`));

// selects all para grandchildren of the context node
NodeSet.element(`*`).path(NodeSet.element(`para`));

// selects the document root (which is always the parent of the document element)
NodeSet.root();

// selects all the para elements in the same document as the context node
NodeSet.root().path(NodeSet.element(`para`, `descendant`));

// selects all the item elements that have an olist parent and that are in the same document as the context node
NodeSet.root()
  .path(NodeSet.element(`olist`, `descendant`))
  .path(NodeSet.element(`item`));

// selects the first para child of the context node
NodeSet.element(`para`).filter(fn(`position`).is(`=`, 1));

// selects the last para child of the context node
NodeSet.element(`para`).filter(fn(`position`).is(`=`, fn(`last`)));

// selects the last but one para child of the context node
NodeSet.element(`para`).filter(fn(`position`).is(`=`, fn(`last`).subtract(1)));

// selects all the para children of the context node other than the first para child of the context node
NodeSet.element(`para`).filter(fn(`position`).is(`>`, 1));

// selects the next chapter sibling of the context node
NodeSet.element(`chapter`, `following-sibling`).filter(
  fn(`position`).is(`=`, 1),
);

// selects the previous chapter sibling of the context node
NodeSet.element(`chapter`, `preceding-sibling`).filter(
  fn(`position`).is(`=`, 1),
);

// selects the forty-second figure element in the document
NodeSet.root()
  .path(NodeSet.element(`figure`, `descendant`))
  .filter(fn(`position`).is(`=`, 42));

// selects the second section of the fifth chapter of the doc document element
NodeSet.root()
  .path(NodeSet.element(`doc`))
  .path(NodeSet.element(`chapter`))
  .filter(fn(`position`).is(`=`, 5))
  .path(NodeSet.element(`section`))
  .filter(fn(`position`).is(`=`, 2));

// selects all para children of the context node that have a type attribute with value warning
NodeSet.element(`para`).filter(NodeSet.attribute(`type`).is(`=`, `warning`));

// selects the fifth para child of the context node that has a type attribute with value warning
NodeSet.element(`para`)
  .filter(NodeSet.attribute(`type`).is(`=`, `warning`))
  .filter(fn(`position`).is(`=`, 5));

// selects the fifth para child of the context node if that child has a type attribute with value warning
NodeSet.element(`para`)
  .filter(fn(`position`).is(`=`, 5))
  .filter(NodeSet.attribute(`type`).is(`=`, `warning`));

// selects the chapter children of the context node that have one or more title children with string-value equal to Introduction
NodeSet.element(`chapter`).filter(
  NodeSet.element(`title`).is(`=`, `Introduction`),
);

// selects the chapter children of the context node that have one or more title children
NodeSet.element(`chapter`).filter(NodeSet.element(`title`));

// selects the chapter and appendix children of the context node
NodeSet.element(`*`).filter(
  NodeSet.element(`chapter`, `self`).or(NodeSet.element(`appendix`, `self`)),
);

// selects the last chapter or appendix child of the context node
NodeSet.element(`*`)
  .filter(
    NodeSet.element(`chapter`, `self`).or(NodeSet.element(`appendix`, `self`)),
  )
  .filter(fn(`position`).is(`=`, fn(`last`)));
```

</details>

### Select attributes by their class or ID

Since this library is mainly used in the context of the DOM, it provides a
convenient way to select attributes based on their class or ID using the same
syntax as CSS class or ID selectors.

```ts
import {NodeSet} from 'sonnar';

// selects the class attribute of the context node that contains the value foo
NodeSet.attribute(`.foo`);

// selects the id attribute of the context node that has the value foo
NodeSet.attribute(`#foo`);
```

### Automatic setting of parentheses

The expression of an operation which results in a primitive is automatically
enclosed in parentheses.

<details>
  <summary>Show the affected methods</summary>

- `Primitive.and()`
- `Primitive.or()`
- `Primitive.is()`
- `Primitive.add()`
- `Primitive.subtract()`
- `Primitive.multiply()`
- `Primitive.divide()`
- `Primitive.mod()`

</details>

```ts
import {Primitive} from 'sonnar';

// (((3 + 3) * 7) = 42)
Primitive.literal(3).add(3).multiply(7).is(`=`, 42);

// (((7 * 3) + 3) != 42)
Primitive.literal(7).multiply(3).add(3).is(`!=`, 42);

// ((7 * (3 + 3)) = 42)
Primitive.literal(7).multiply(Primitive.literal(3).add(3)).is(`=`, 42);
```

Since the syntax of XPath 1.0 does not allow the right part of a path expression
to be enclosed in parentheses, the expression of an operation which results in a
node-set is **not** automatically enclosed in parentheses. Thus, for example,
the following expression `(preceding::foo)[1]` cannot be constructed with
Sonnar.

<details>
  <summary>Show the affected methods</summary>

- `NodeSet.filter()`
- `NodeSet.path()`
- `NodeSet.union()`

</details>

## API documentation

### `NodeSet`

```ts
import {NodeSet} from 'sonnar';
```

```ts
class NodeSet extends Primitive {
  static any(): NodeSet; // Shortcut for `NodeSet.node('descendant-or-self')`
  static attribute(attributeName: string): NodeSet;
  static comment(axisName: AxisName = `child`): NodeSet;
  static element(elementName: string, axisName: AxisName = `child`): NodeSet;
  static namespace(namespaceName: string): NodeSet;
  static node(axisName: AxisName = `child`): NodeSet;
  static parent(): NodeSet; // Shortcut for `NodeSet.node('parent')`

  static processingInstruction(
    axisName: AxisName = `child`,
    targetName?: string,
  ): NodeSet;

  static root(): NodeSet;
  static self(): NodeSet; // Shortcut for `NodeSet.node('self')`
  static text(axisName: AxisName = `child`): NodeSet;

  filter(predicate: Literal | Primitive): NodeSet;
  path(operand: NodeSet): NodeSet;
  union(operand: NodeSet): NodeSet;
}
```

### `AxisName`

```ts
type AxisName =
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
```

### `Primitive`

```ts
import {Primitive} from 'sonnar';
```

```ts
class Primitive {
  static isLiteral(value: unknown): value is Literal;
  static literal(value: Literal): Primitive;

  readonly expression: string;

  and(operand: Literal | Primitive): Primitive;
  or(operand: Literal | Primitive): Primitive;
  is(operator: ComparisonOperator, operand: Literal | Primitive): Primitive;
  add(operand: Literal | Primitive): Primitive;
  subtract(operand: Literal | Primitive): Primitive;
  multiply(operand: Literal | Primitive): Primitive;
  divide(operand: Literal | Primitive): Primitive;
  mod(operand: Literal | Primitive): Primitive;
}
```

### `Literal`

```ts
type Literal = boolean | number | string;
```

### `ComparisonOperator`

```ts
type ComparisonOperator = '=' | '!=' | '<' | '<=' | '>' | '>=';
```

### `fn()`

```ts
import {fn} from 'sonnar';
```

#### Node-set functions

```ts
/** `number last()` */
function fn(functionName: 'last'): Primitive;
```

```ts
/** `number position()` */
function fn(functionName: 'position'): Primitive;
```

```ts
/** `number count(node-set)` */
function fn(functionName: 'count', arg: NodeSet): Primitive;
```

```ts
/** `node-set id(object)` */
function fn(functionName: 'id', arg: Literal | Primitive): NodeSet;
```

```ts
/** `string local-name(node-set?)` */
function fn(functionName: 'local-name', arg?: NodeSet): Primitive;
```

```ts
/** `string namespace-uri(node-set?)` */
function fn(functionName: 'namespace-uri', arg?: NodeSet): Primitive;
```

```ts
/** `string name(node-set?)` */
function fn(functionName: 'name', arg?: NodeSet): Primitive;
```

#### String functions

```ts
/** `string string(object?)` */
function fn(functionName: 'string', arg?: Literal | Primitive): Primitive;
```

```ts
/** `string concat(string, string, string*)` */
function fn(
  functionName: 'concat',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive,
  ...otherArgs: (Literal | Primitive)[]
): Primitive;
```

```ts
/** `boolean starts-with(string, string)` */
function fn(
  functionName: 'starts-with',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive,
): Primitive;
```

```ts
/** `boolean contains(string, string)` */
function fn(
  functionName: 'contains',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive,
): Primitive;
```

```ts
/** `string substring-before(string, string)` */
function fn(
  functionName: 'substring-before',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive,
): Primitive;
```

```ts
/** `string substring-after(string, string)` */
function fn(
  functionName: 'substring-after',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive,
): Primitive;
```

```ts
/** `string substring(string, number, number?)` */
function fn(
  functionName: 'substring',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive,
  arg3?: Literal | Primitive,
): Primitive;
```

```ts
/** `number string-length(string?)` */
function fn(
  functionName: 'string-length',
  arg?: Literal | Primitive,
): Primitive;
```

```ts
/** `string normalize-space(string?)` */
function fn(
  functionName: 'normalize-space',
  arg?: Literal | Primitive,
): Primitive;
```

```ts
/** `string translate(string, string, string)` */
function fn(
  functionName: 'translate',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive,
  arg3: Literal | Primitive,
): Primitive;
```

#### Boolean functions

```ts
/** `boolean boolean(object)` */
function fn(functionName: 'boolean', arg: Literal | Primitive): Primitive;
```

```ts
/** `boolean not(boolean)` */
function fn(functionName: 'not', arg: Literal | Primitive): Primitive;
```

```ts
/** `boolean lang(string)` */
function fn(functionName: 'lang', arg: Literal | Primitive): Primitive;
```

#### Number functions

```ts
/** `number number(object?)` */
function fn(functionName: 'number', arg?: Literal | Primitive): Primitive;
```

```ts
/** `number sum(node-set)` */
function fn(functionName: 'sum', arg: NodeSet): Primitive;
```

```ts
/** `number floor(number)` */
function fn(functionName: 'floor', arg: Literal | Primitive): Primitive;
```

```ts
/** `number ceiling(number)` */
function fn(functionName: 'ceiling', arg: Literal | Primitive): Primitive;
```

```ts
/** `number round(number)` */
function fn(functionName: 'round', arg: Literal | Primitive): Primitive;
```
