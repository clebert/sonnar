import {NodeSet} from './node-set.js';
import {describe, expect, test} from '@jest/globals';

describe(`NodeSet`, () => {
  test(`static any()`, () => {
    expect(NodeSet.any().expression).toBe(`descendant-or-self::node()`);
  });

  test(`static attribute()`, () => {
    expect(
      [
        NodeSet.attribute(`foo`),
        NodeSet.attribute(`.foo`),
        NodeSet.attribute(`#foo`),
      ].map(({expression}) => expression),
    ).toEqual([
      `attribute::foo`,
      `attribute::class[contains(concat(" ", normalize-space(self::node()), " "), " foo ")]`,
      `attribute::id[(self::node() = "foo")]`,
    ]);
  });

  test(`static comment()`, () => {
    expect(
      [
        NodeSet.comment(),
        NodeSet.comment(`ancestor-or-self`),
        NodeSet.comment(`ancestor`),
        NodeSet.comment(`child`),
        NodeSet.comment(`descendant-or-self`),
        NodeSet.comment(`descendant`),
        NodeSet.comment(`following-sibling`),
        NodeSet.comment(`following`),
        NodeSet.comment(`parent`),
        NodeSet.comment(`preceding-sibling`),
        NodeSet.comment(`preceding`),
        NodeSet.comment(`self`),
      ].map(({expression}) => expression),
    ).toEqual([
      `child::comment()`,
      `ancestor-or-self::comment()`,
      `ancestor::comment()`,
      `child::comment()`,
      `descendant-or-self::comment()`,
      `descendant::comment()`,
      `following-sibling::comment()`,
      `following::comment()`,
      `parent::comment()`,
      `preceding-sibling::comment()`,
      `preceding::comment()`,
      `self::comment()`,
    ]);
  });

  test(`static element()`, () => {
    expect(
      [
        NodeSet.element(`foo`),
        NodeSet.element(`foo`, `ancestor-or-self`),
        NodeSet.element(`foo`, `ancestor`),
        NodeSet.element(`foo`, `child`),
        NodeSet.element(`foo`, `descendant-or-self`),
        NodeSet.element(`foo`, `descendant`),
        NodeSet.element(`foo`, `following-sibling`),
        NodeSet.element(`foo`, `following`),
        NodeSet.element(`foo`, `parent`),
        NodeSet.element(`foo`, `preceding-sibling`),
        NodeSet.element(`foo`, `preceding`),
        NodeSet.element(`foo`, `self`),
      ].map(({expression}) => expression),
    ).toEqual([
      `child::foo`,
      `ancestor-or-self::foo`,
      `ancestor::foo`,
      `child::foo`,
      `descendant-or-self::foo`,
      `descendant::foo`,
      `following-sibling::foo`,
      `following::foo`,
      `parent::foo`,
      `preceding-sibling::foo`,
      `preceding::foo`,
      `self::foo`,
    ]);
  });

  test(`static namespace()`, () => {
    expect(NodeSet.namespace(`foo`).expression).toBe(`namespace::foo`);
  });

  test(`static node()`, () => {
    expect(
      [
        NodeSet.node(),
        NodeSet.node(`ancestor-or-self`),
        NodeSet.node(`ancestor`),
        NodeSet.node(`child`),
        NodeSet.node(`descendant-or-self`),
        NodeSet.node(`descendant`),
        NodeSet.node(`following-sibling`),
        NodeSet.node(`following`),
        NodeSet.node(`parent`),
        NodeSet.node(`preceding-sibling`),
        NodeSet.node(`preceding`),
        NodeSet.node(`self`),
      ].map(({expression}) => expression),
    ).toEqual([
      `child::node()`,
      `ancestor-or-self::node()`,
      `ancestor::node()`,
      `child::node()`,
      `descendant-or-self::node()`,
      `descendant::node()`,
      `following-sibling::node()`,
      `following::node()`,
      `parent::node()`,
      `preceding-sibling::node()`,
      `preceding::node()`,
      `self::node()`,
    ]);
  });

  test(`static parent()`, () => {
    expect(NodeSet.parent().expression).toBe(`parent::node()`);
  });

  test(`static processingInstruction()`, () => {
    expect(
      [
        NodeSet.processingInstruction(),
        NodeSet.processingInstruction(`ancestor-or-self`),
        NodeSet.processingInstruction(`ancestor`),
        NodeSet.processingInstruction(`child`),
        NodeSet.processingInstruction(`descendant-or-self`),
        NodeSet.processingInstruction(`descendant`),
        NodeSet.processingInstruction(`following-sibling`),
        NodeSet.processingInstruction(`following`),
        NodeSet.processingInstruction(`parent`),
        NodeSet.processingInstruction(`preceding-sibling`),
        NodeSet.processingInstruction(`preceding`),
        NodeSet.processingInstruction(`self`),
        NodeSet.processingInstruction(`child`, `foo`),
      ].map(({expression}) => expression),
    ).toEqual([
      `child::processing-instruction()`,
      `ancestor-or-self::processing-instruction()`,
      `ancestor::processing-instruction()`,
      `child::processing-instruction()`,
      `descendant-or-self::processing-instruction()`,
      `descendant::processing-instruction()`,
      `following-sibling::processing-instruction()`,
      `following::processing-instruction()`,
      `parent::processing-instruction()`,
      `preceding-sibling::processing-instruction()`,
      `preceding::processing-instruction()`,
      `self::processing-instruction()`,
      `child::processing-instruction(foo)`,
    ]);
  });

  test(`static root()`, () => {
    expect(NodeSet.root().expression).toBe(`/`);
  });

  test(`static self()`, () => {
    expect(NodeSet.self().expression).toBe(`self::node()`);
  });

  test(`static text()`, () => {
    expect(
      [
        NodeSet.text(),
        NodeSet.text(`ancestor-or-self`),
        NodeSet.text(`ancestor`),
        NodeSet.text(`child`),
        NodeSet.text(`descendant-or-self`),
        NodeSet.text(`descendant`),
        NodeSet.text(`following-sibling`),
        NodeSet.text(`following`),
        NodeSet.text(`parent`),
        NodeSet.text(`preceding-sibling`),
        NodeSet.text(`preceding`),
        NodeSet.text(`self`),
      ].map(({expression}) => expression),
    ).toEqual([
      `child::text()`,
      `ancestor-or-self::text()`,
      `ancestor::text()`,
      `child::text()`,
      `descendant-or-self::text()`,
      `descendant::text()`,
      `following-sibling::text()`,
      `following::text()`,
      `parent::text()`,
      `preceding-sibling::text()`,
      `preceding::text()`,
      `self::text()`,
    ]);
  });

  test(`filter()`, () => {
    expect(
      [
        NodeSet.root().filter(NodeSet.element(`foo`)).filter(`0`),
        NodeSet.element(`foo`).filter(NodeSet.element(`bar`)).filter(`0`),
      ].map(({expression}) => expression),
    ).toEqual([`/[child::foo]["0"]`, `child::foo[child::bar]["0"]`]);
  });

  test(`path()`, () => {
    expect(
      [
        NodeSet.root()
          .path(NodeSet.element(`foo`).path(NodeSet.element(`bar`)))
          .path(NodeSet.element(`baz`)),

        NodeSet.element(`foo`)
          .path(NodeSet.element(`bar`).path(NodeSet.element(`baz`)))
          .path(NodeSet.element(`qux`)),
      ].map(({expression}) => expression),
    ).toEqual([
      `/ child::foo / child::bar / child::baz`,
      `child::foo / child::bar / child::baz / child::qux`,
    ]);
  });

  test(`union()`, () => {
    expect(
      [
        NodeSet.root()
          .union(NodeSet.element(`foo`).union(NodeSet.element(`bar`)))
          .union(NodeSet.element(`baz`)),

        NodeSet.element(`foo`)
          .union(NodeSet.element(`bar`).union(NodeSet.element(`baz`)))
          .union(NodeSet.element(`qux`)),
      ].map(({expression}) => expression),
    ).toEqual([
      `/ | child::foo | child::bar | child::baz`,
      `child::foo | child::bar | child::baz | child::qux`,
    ]);
  });
});
