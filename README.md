# Sonnar

Building page object-like APIs for testing web pages.

## Introduction

By way of introduction, some quotes from the article
["PageObject"](https://martinfowler.com/bliki/PageObject.html) by Martin Fowler:

> When you write tests against a web page, you need to refer to elements within
> that web page in order to click links and determine what's displayed.

> A page object wraps an HTML page, or fragment, with an application-specific
> API, allowing you to manipulate page elements without digging around in the
> HTML.

> Despite the term "page" object, these objects shouldn't usually be built for
> each page, but rather for the significant elements on a page.

> That said, some of the hierarchy of a complex UI is only there in order to
> structure the UI - such composite structures shouldn't be revealed by the page
> objects.

> The rule of thumb is to model the structure in the page that makes sense to
> the user of the application.

## Example

In the following example, a fictitious website is tested which displays a list
of music albums. The rating of the album "The Wall" is to be changed to 5.

It is assumed that the semantic names of the UI components have been assigned to
their associated HTML elements in the form of CSS classes. However, from the
point of view of the tests, this is an implementation detail and is hidden from
them. It only serves to keep the CSS selectors simple, but is also a good and
common practice in the real world.

### Installing Sonnar

```
npm install sonnar --save-dev
```

### Importing the required Sonnar functions

```js
import {descendant, pseudoClass, query} from 'sonnar';
```

### Defining the API of the website

UI components that may occur more than once on a web page and require further
discrimination should, as a convention, be named in the plural form. Here this
applies to the album component.

```js
const Albums = query('.Album', {
  Title: descendant('.Title', {}),
  RatingField: descendant('.RatingField', {}),
});
```

### Implementing the end-to-end test

The following test is implemented with [Playwright](https://playwright.dev). In
general, however, all CSS selector-based test frameworks are compatible with
this approach.

```js
await page.goto('https://example.com/albums');

const theWall = Albums(hasText('The Wall'));

await page.fill(theWall.RatingField().selector, '5');

const rating = await page.$eval(
  theWall.RatingField().selector,
  ({value}) => value
);

expect(rating).toBe('5');
```

To select a specific HTML element from a group of elements, CSS pseudo-classes
can be used, for example. Playwright provides a very handy pseudo-class called
`:has-text()` to select elements that contain the specified text.
[Cypress](https://www.cypress.io) provides a similar pseudo-class called
`:contains()`.

```js
const hasText = (text) => pseudoClass(`:has-text("${text}")`);
```

## Other examples

Below are some links to "real world" tests implemented with Sonnar:

- [bookmark.wtf](https://github.com/clebert/bookmark.wtf/blob/main/src/itests/bookmark-wtf.itest.ts)

---

Copyright (c) 2021, Clemens Akens. Released under the terms of the
[MIT License](https://github.com/clebert/sonnar/blob/master/LICENSE).
