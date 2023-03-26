import {fn} from './fn.js';
import {NodeSet} from './node-set.js';
import {Primitive} from './primitive.js';
import {expect, test} from '@jest/globals';

test(`README: Find all HackerNews posts which have more than 50 comments`, () => {
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
});

test(`README: Select a set of nodes`, () => {
  expect(
    [
      // selects the para element children of the context node
      NodeSet.element(`para`),

      // selects all element children of the context node
      NodeSet.element(`*`),

      // selects all text node children of the context node
      NodeSet.text(),

      // selects all the children of the context node, whatever their node type
      NodeSet.node(),

      // selects the name attribute of the context node
      NodeSet.attribute(`name`),

      // selects all the attributes of the context node
      NodeSet.attribute(`*`),

      // selects the para element descendants of the context node
      NodeSet.element(`para`, `descendant`),

      // selects all div ancestors of the context node
      NodeSet.element(`div`, `ancestor`),

      // selects the div ancestors of the context node and, if the context node is a div element, the context node as well
      NodeSet.element(`div`, `ancestor-or-self`),

      // selects the para element descendants of the context node and, if the context node is a para element, the context node as well
      NodeSet.element(`para`, `descendant-or-self`),

      // selects the context node if it is a para element, and otherwise selects nothing
      NodeSet.element(`para`, `self`),

      // selects the para element descendants of the chapter element children of the context node
      NodeSet.element(`chapter`).path(NodeSet.element(`para`, `descendant`)),

      // selects all para grandchildren of the context node
      NodeSet.element(`*`).path(NodeSet.element(`para`)),

      // selects the document root (which is always the parent of the document element)
      NodeSet.root(),

      // selects all the para elements in the same document as the context node
      NodeSet.root().path(NodeSet.element(`para`, `descendant`)),

      // selects all the item elements that have an olist parent and that are in the same document as the context node
      NodeSet.root()
        .path(NodeSet.element(`olist`, `descendant`))
        .path(NodeSet.element(`item`)),

      // selects the first para child of the context node
      NodeSet.element(`para`).filter(fn(`position`).is(`=`, 1)),

      // selects the last para child of the context node
      NodeSet.element(`para`).filter(fn(`position`).is(`=`, fn(`last`))),

      // selects the last but one para child of the context node
      NodeSet.element(`para`).filter(
        fn(`position`).is(`=`, fn(`last`).subtract(1)),
      ),

      // selects all the para children of the context node other than the first para child of the context node
      NodeSet.element(`para`).filter(fn(`position`).is(`>`, 1)),

      // selects the next chapter sibling of the context node
      NodeSet.element(`chapter`, `following-sibling`).filter(
        fn(`position`).is(`=`, 1),
      ),

      // selects the previous chapter sibling of the context node
      NodeSet.element(`chapter`, `preceding-sibling`).filter(
        fn(`position`).is(`=`, 1),
      ),

      // selects the forty-second figure element in the document
      NodeSet.root()
        .path(NodeSet.element(`figure`, `descendant`))
        .filter(fn(`position`).is(`=`, 42)),

      // selects the second section of the fifth chapter of the doc document element
      NodeSet.root()
        .path(NodeSet.element(`doc`))
        .path(NodeSet.element(`chapter`))
        .filter(fn(`position`).is(`=`, 5))
        .path(NodeSet.element(`section`))
        .filter(fn(`position`).is(`=`, 2)),

      // selects all para children of the context node that have a type attribute with value warning
      NodeSet.element(`para`).filter(
        NodeSet.attribute(`type`).is(`=`, `warning`),
      ),

      // selects the fifth para child of the context node that has a type attribute with value warning
      NodeSet.element(`para`)
        .filter(NodeSet.attribute(`type`).is(`=`, `warning`))
        .filter(fn(`position`).is(`=`, 5)),

      // selects the fifth para child of the context node if that child has a type attribute with value warning
      NodeSet.element(`para`)
        .filter(fn(`position`).is(`=`, 5))
        .filter(NodeSet.attribute(`type`).is(`=`, `warning`)),

      // selects the chapter children of the context node that have one or more title children with string-value equal to Introduction
      NodeSet.element(`chapter`).filter(
        NodeSet.element(`title`).is(`=`, `Introduction`),
      ),

      // selects the chapter children of the context node that have one or more title children
      NodeSet.element(`chapter`).filter(NodeSet.element(`title`)),

      // selects the chapter and appendix children of the context node
      NodeSet.element(`*`).filter(
        NodeSet.element(`chapter`, `self`).or(
          NodeSet.element(`appendix`, `self`),
        ),
      ),

      // selects the last chapter or appendix child of the context node
      NodeSet.element(`*`)
        .filter(
          NodeSet.element(`chapter`, `self`).or(
            NodeSet.element(`appendix`, `self`),
          ),
        )
        .filter(fn(`position`).is(`=`, fn(`last`))),
    ].map(({expression}) => expression),
  ).toEqual([
    `child::para`,
    `child::*`,
    `child::text()`,
    `child::node()`,
    `attribute::name`,
    `attribute::*`,
    `descendant::para`,
    `ancestor::div`,
    `ancestor-or-self::div`,
    `descendant-or-self::para`,
    `self::para`,
    `child::chapter / descendant::para`,
    `child::* / child::para`,
    `/`,
    `/ descendant::para`,
    `/ descendant::olist / child::item`,
    `child::para[(position() = 1)]`,
    `child::para[(position() = last())]`,
    `child::para[(position() = (last() - 1))]`,
    `child::para[(position() > 1)]`,
    `following-sibling::chapter[(position() = 1)]`,
    `preceding-sibling::chapter[(position() = 1)]`,
    `/ descendant::figure[(position() = 42)]`,
    `/ child::doc / child::chapter[(position() = 5)] / child::section[(position() = 2)]`,
    `child::para[(attribute::type = "warning")]`,
    `child::para[(attribute::type = "warning")][(position() = 5)]`,
    `child::para[(position() = 5)][(attribute::type = "warning")]`,
    `child::chapter[(child::title = "Introduction")]`,
    `child::chapter[child::title]`,
    `child::*[(self::chapter or self::appendix)]`,
    `child::*[(self::chapter or self::appendix)][(position() = last())]`,
  ]);
});

test(`README: Group using parentheses`, () => {
  expect(
    [
      Primitive.literal(3).add(3).multiply(7).is(`=`, 42),
      Primitive.literal(7).multiply(3).add(3).is(`!=`, 42),
      Primitive.literal(7).multiply(Primitive.literal(3).add(3)).is(`=`, 42),
    ].map(({expression}) => expression),
  ).toEqual([
    `(((3 + 3) * 7) = 42)`,
    `(((7 * 3) + 3) != 42)`,
    `((7 * (3 + 3)) = 42)`,
  ]);
});
