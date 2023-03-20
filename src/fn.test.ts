import {expect, test} from '@jest/globals';
import {fn} from './fn.js';
import {NodeSet} from './node-set.js';
import {Primitive} from './primitive.js';

test(`fn()`, () => {
  const last = fn(`last`);

  expect(last).toBeInstanceOf(Primitive);
  expect(last).not.toBeInstanceOf(NodeSet);
  expect(last.expression).toBe(`last()`);

  const position = fn(`position`);

  expect(position).toBeInstanceOf(Primitive);
  expect(position).not.toBeInstanceOf(NodeSet);
  expect(position.expression).toBe(`position()`);

  const count = fn(`count`, NodeSet.root());

  expect(count).toBeInstanceOf(Primitive);
  expect(count).not.toBeInstanceOf(NodeSet);
  expect(count.expression).toBe(`count(/)`);

  const id = fn(`id`, `0`);

  expect(id).toBeInstanceOf(NodeSet);
  expect(id.expression).toBe(`id("0")`);

  const localName1 = fn(`local-name`);
  const localName2 = fn(`local-name`, NodeSet.root());

  expect(localName1).toBeInstanceOf(Primitive);
  expect(localName1).not.toBeInstanceOf(NodeSet);
  expect(localName1.expression).toBe(`local-name()`);
  expect(localName2.expression).toBe(`local-name(/)`);

  const namespaceURI1 = fn(`namespace-uri`);
  const namespaceURI2 = fn(`namespace-uri`, NodeSet.root());

  expect(namespaceURI1).toBeInstanceOf(Primitive);
  expect(namespaceURI1).not.toBeInstanceOf(NodeSet);
  expect(namespaceURI1.expression).toBe(`namespace-uri()`);
  expect(namespaceURI2.expression).toBe(`namespace-uri(/)`);

  const name1 = fn(`name`);
  const name2 = fn(`name`, NodeSet.root());

  expect(name1).toBeInstanceOf(Primitive);
  expect(name1).not.toBeInstanceOf(NodeSet);
  expect(name1.expression).toBe(`name()`);
  expect(name2.expression).toBe(`name(/)`);

  const string1 = fn(`string`);
  const string2 = fn(`string`, `0`);

  expect(string1).toBeInstanceOf(Primitive);
  expect(string1).not.toBeInstanceOf(NodeSet);
  expect(string1.expression).toBe(`string()`);
  expect(string2.expression).toBe(`string("0")`);

  const concat1 = fn(`concat`, `0`, `1`);
  const concat2 = fn(`concat`, `0`, `1`, `2`);

  expect(concat1).toBeInstanceOf(Primitive);
  expect(concat1).not.toBeInstanceOf(NodeSet);
  expect(concat1.expression).toBe(`concat("0", "1")`);
  expect(concat2.expression).toBe(`concat("0", "1", "2")`);

  const startsWith = fn(`starts-with`, `0`, `1`);

  expect(startsWith).toBeInstanceOf(Primitive);
  expect(startsWith).not.toBeInstanceOf(NodeSet);
  expect(startsWith.expression).toBe(`starts-with("0", "1")`);

  const contains = fn(`contains`, `0`, `1`);

  expect(contains).toBeInstanceOf(Primitive);
  expect(contains).not.toBeInstanceOf(NodeSet);
  expect(contains.expression).toBe(`contains("0", "1")`);

  const substringBefore = fn(`substring-before`, `0`, `1`);

  expect(substringBefore).toBeInstanceOf(Primitive);
  expect(substringBefore).not.toBeInstanceOf(NodeSet);
  expect(substringBefore.expression).toBe(`substring-before("0", "1")`);

  const substringAfter = fn(`substring-after`, `0`, `1`);

  expect(substringAfter).toBeInstanceOf(Primitive);
  expect(substringAfter).not.toBeInstanceOf(NodeSet);
  expect(substringAfter.expression).toBe(`substring-after("0", "1")`);

  const substring1 = fn(`substring`, `0`, `1`);
  const substring2 = fn(`substring`, `0`, `1`, `2`);

  expect(substring1).toBeInstanceOf(Primitive);
  expect(substring1).not.toBeInstanceOf(NodeSet);
  expect(substring1.expression).toBe(`substring("0", "1")`);
  expect(substring2.expression).toBe(`substring("0", "1", "2")`);

  const stringLength1 = fn(`string-length`);
  const stringLength2 = fn(`string-length`, `0`);

  expect(stringLength1).toBeInstanceOf(Primitive);
  expect(stringLength1).not.toBeInstanceOf(NodeSet);
  expect(stringLength1.expression).toBe(`string-length()`);
  expect(stringLength2.expression).toBe(`string-length("0")`);

  const normalizeSpace1 = fn(`normalize-space`);
  const normalizeSpace2 = fn(`normalize-space`, `0`);

  expect(normalizeSpace1).toBeInstanceOf(Primitive);
  expect(normalizeSpace1).not.toBeInstanceOf(NodeSet);
  expect(normalizeSpace1.expression).toBe(`normalize-space()`);
  expect(normalizeSpace2.expression).toBe(`normalize-space("0")`);

  const translate = fn(`translate`, `0`, `1`, `2`);

  expect(translate).toBeInstanceOf(Primitive);
  expect(translate).not.toBeInstanceOf(NodeSet);
  expect(translate.expression).toBe(`translate("0", "1", "2")`);

  const boolean = fn(`boolean`, `0`);

  expect(boolean).toBeInstanceOf(Primitive);
  expect(boolean).not.toBeInstanceOf(NodeSet);
  expect(boolean.expression).toBe(`boolean("0")`);

  const not = fn(`not`, `0`);

  expect(not).toBeInstanceOf(Primitive);
  expect(not).not.toBeInstanceOf(NodeSet);
  expect(not.expression).toBe(`not("0")`);

  const lang = fn(`lang`, `0`);

  expect(lang).toBeInstanceOf(Primitive);
  expect(lang).not.toBeInstanceOf(NodeSet);
  expect(lang.expression).toBe(`lang("0")`);

  const number1 = fn(`number`);
  const number2 = fn(`number`, `0`);

  expect(number1).toBeInstanceOf(Primitive);
  expect(number1).not.toBeInstanceOf(NodeSet);
  expect(number1.expression).toBe(`number()`);
  expect(number2.expression).toBe(`number("0")`);

  const sum = fn(`sum`, NodeSet.root());

  expect(sum).toBeInstanceOf(Primitive);
  expect(sum).not.toBeInstanceOf(NodeSet);
  expect(sum.expression).toBe(`sum(/)`);

  const floor = fn(`floor`, `0`);

  expect(floor).toBeInstanceOf(Primitive);
  expect(floor).not.toBeInstanceOf(NodeSet);
  expect(floor.expression).toBe(`floor("0")`);

  const ceiling = fn(`ceiling`, `0`);

  expect(ceiling).toBeInstanceOf(Primitive);
  expect(ceiling).not.toBeInstanceOf(NodeSet);
  expect(ceiling.expression).toBe(`ceiling("0")`);

  const round = fn(`round`, `0`);

  expect(round).toBeInstanceOf(Primitive);
  expect(round).not.toBeInstanceOf(NodeSet);
  expect(round.expression).toBe(`round("0")`);
});
