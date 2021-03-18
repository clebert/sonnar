# Sonnar

[![][ci-badge]][ci-link] [![][version-badge]][version-link]
[![][license-badge]][license-link] [![][types-badge]][types-link]
[![][size-badge]][size-link]

[ci-badge]: https://github.com/clebert/sonnar/workflows/CI/badge.svg
[ci-link]: https://github.com/clebert/sonnar
[version-badge]: https://badgen.net/npm/v/sonnar
[version-link]: https://www.npmjs.com/package/sonnar
[license-badge]: https://badgen.net/npm/license/sonnar
[license-link]: https://github.com/clebert/sonnar/blob/master/LICENSE
[types-badge]: https://badgen.net/npm/types/sonnar
[types-link]: https://github.com/clebert/sonnar
[size-badge]: https://badgen.net/bundlephobia/minzip/sonnar
[size-link]: https://bundlephobia.com/result?p=sonnar

A lightweight TypeScript API for constructing
[ XPath 1.0](https://www.w3.org/TR/1999/REC-xpath-19991116/) expressions.

## Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage examples](#usage-examples)
  - [Find all HackerNews posts which have more than 50 comments](#find-all-hackernews-posts-which-have-more-than-50-comments)
  - [Group using parentheses](#group-using-parentheses)
  - [Select the document root](#select-the-document-root)
  - [Use a literal as the left-hand side of an expression](#use-a-literal-as-the-left-hand-side-of-an-expression)
- [API documentation](#api-documentation)
  - [`NodeSet`](#nodeset)
  - [`AxisName`](#axisname)
  - [`NodeTest`](#nodetest)
  - [`Primitive`](#primitive)
  - [`Literal`](#literal)
  - [`ComparisonOperator`](#comparisonoperator)
  - [`fn()`](#fn)
    - [Node-set functions](#node-set-functions)
    - [String functions](#string-functions)
    - [Boolean functions](#boolean-functions)
    - [Number functions](#number-functions)

## Introduction

Although XPath 1.0 is a very elegant and powerful language, the syntax and DEV
experience is suboptimal to say the least. Typically, an XPath 1.0 expression is
written as a JavaScript string. This means there is no IntelliSense support, no
syntax highlighting, and you quickly get lost in the parentheses. That's why I
developed a lightweight TypeScript API around XPath 1.0 that's just as powerful,
but doesn't have the above problems.

## Installation

```
npm install sonnar
```

## Usage examples

### Find all [HackerNews](https://news.ycombinator.com) posts which have more than 50 comments

#### XPath 1.0 abbreviated syntax

```
// tr
  [contains(@class, "athing")]
  [
    following-sibling::tr[1]
    / td[2]
    / a
      [last()]
      [substring-before(text(), " ") > 50]
  ]
```

#### XPath 1.0 verbose syntax

```
descendant::tr
  [contains(attribute::class, "athing")]
  [
    following-sibling::tr[position() = 1]
    / child::td[position() = 2]
    / child::a
      [position() = last()]
      [substring-before(child::text(), " ") > 50]
  ]
```

#### Sonnar API

```js
import {fn, select} from 'sonnar';

const {expression} = select('descendant', 'tr')
  .filter(fn('contains', select('attribute', 'class'), 'athing'))
  .filter(
    select('following-sibling', 'tr')
      .filter(fn('position').is('=', 1)) // less verbose alternative: .filter(1)
      .path(select('child', 'td'))
      .filter(2)
      .path(select('child', 'a'))
      .filter(fn('last'))
      .filter(
        fn('substring-before', select('child').text(), '\u00A0').is('>', 50)
      )
  );

expect(expression).toBe(
  'descendant::tr[contains(attribute::class, "athing")][following-sibling::tr[position() = 1] / child::td[2] / child::a[last()][substring-before(child::text(), "\u00A0") > 50]]'
);
```

### Group using parentheses

The meaning of a predicate depends crucially on which axis applies. For example,
`preceding::foo[1]` returns the first `foo` element in reverse document order,
because the axis that applies to the `[1]` predicate is the preceding axis.

```ts
import {select} from 'sonnar';

select('preceding', 'foo').filter(1);
```

By contrast, `(preceding::foo)[1]` returns the first `foo` element in document
order, because the axis that applies to the `[1]` predicate is the child axis.

```ts
select('preceding', 'foo').enclose().filter(1);
```

### Select the document root

The `/` document root is always the parent of the document element.

```ts
import {root} from 'sonnar';

root();
```

### Use a literal as the left-hand side of an expression

```ts
import {literal} from 'sonnar';

literal(1).add(2).enclose().is('=', 3);
```

## API documentation

### `NodeSet`

```ts
import {NodeSet} from 'sonnar';
```

```ts
class NodeSet extends Primitive {
  static root(): NodeSet;
  static select(axisName: AxisName): NodeTest;
  static select(axisName: AxisName, nodeName: string): NodeSet;

  filter(predicate: Literal | Primitive): this;
  path(operand: NodeSet): this;
  union(operand: NodeSet): this;
}
```

**Note:** For more convenient use, the `NodeSet.root` and `NodeSet.select`
functions are exported directly from the top level module.

```ts
import {root, select} from 'sonnar';
```

### `AxisName`

```ts
type AxisName =
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
```

### `NodeTest`

```ts
import {NodeTest} from 'sonnar';
```

```ts
class NodeTest {
  comment(): NodeSet;
  node(): NodeSet;
  processingInstruction(targetName?: string): NodeSet;
  text(): NodeSet;
}
```

### `Primitive`

```ts
import {Primitive} from 'sonnar';
```

```ts
class Primitive {
  static literal<TValue extends Literal | Primitive>(
    value: TValue
  ): TValue extends Literal ? Primitive : TValue;

  readonly expression: string;

  enclose(): this;
  or(operand: Literal | Primitive): this;
  and(operand: Literal | Primitive): this;
  is(operator: ComparisonOperator, operand: Literal | Primitive): this;
  add(operand: Literal | Primitive): this;
  subtract(operand: Literal | Primitive): this;
  multiply(operand: Literal | Primitive): this;
  divide(operand: Literal | Primitive): this;
  mod(operand: Literal | Primitive): this;
}
```

**Note:** For more convenient use, the `Primitive.literal` function is exported
directly from the top level module.

```ts
import {literal} from 'sonnar';
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
  arg2: Literal | Primitive
): Primitive;
```

```ts
/** `boolean contains(string, string)` */
function fn(
  functionName: 'contains',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive
): Primitive;
```

```ts
/** `string substring-before(string, string)` */
function fn(
  functionName: 'substring-before',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive
): Primitive;
```

```ts
/** `string substring-after(string, string)` */
function fn(
  functionName: 'substring-after',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive
): Primitive;
```

```ts
/** `string substring(string, number, number?)` */
function fn(
  functionName: 'substring',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive,
  arg3?: Literal | Primitive
): Primitive;
```

```ts
/** `number string-length(string?)` */
function fn(
  functionName: 'string-length',
  arg?: Literal | Primitive
): Primitive;
```

```ts
/** `string normalize-space(string?)` */
function fn(
  functionName: 'normalize-space',
  arg?: Literal | Primitive
): Primitive;
```

```ts
/** `string translate(string, string, string)` */
function fn(
  functionName: 'translate',
  arg1: Literal | Primitive,
  arg2: Literal | Primitive,
  arg3: Literal | Primitive
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

---

Copyright (c) 2021, Clemens Akens. Released under the terms of the
[MIT License](https://github.com/clebert/sonnar/blob/master/LICENSE).
