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

## Installation

```
npm install sonnar
```

## Motivation

Although XPath 1.0 is a very elegant and powerful language, the syntax and DEV
experience is suboptimal to say the least. Typically, an XPath 1.0 expression is
written as a JavaScript string. This means there is no IntelliSense support, no
syntax highlighting, and you quickly get lost in the parentheses. That's why I
developed a lightweight TypeScript API around XPath 1.0 that's just as powerful,
but doesn't have the above problems.

## Usage Examples

### Find all [HackerNews](https://news.ycombinator.com) posts which have more than 50 comments

XPath 1.0 abbreviated syntax:

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

XPath 1.0 verbose syntax:

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

Sonnar API:

```js
import {fn, select} from 'sonnar';

const {expression} = select('descendant', 'tr')
  .filter(fn('contains', select('attribute', 'class'), 'athing'))
  .filter(
    select('following-sibling', 'tr')
      .filter(fn('position').is('=', 1)) // less verbose alternative: .filter(1)
      .select('child', 'td')
      .filter(2)
      .select('child', 'a')
      .filter(fn('last'))
      .filter(
        fn('substring-before', select('child').text(), '\u00A0').is('>', 50)
      )
  );

expect(expression).toBe(
  'descendant::tr[contains(attribute::class, "athing")][following-sibling::tr[position() = 1] / child::td[2] / child::a[last()][substring-before(child::text(), "\u00A0") > 50]]'
);
```

---

Copyright (c) 2021, Clemens Akens. Released under the terms of the
[MIT License](https://github.com/clebert/sonnar/blob/master/LICENSE).
