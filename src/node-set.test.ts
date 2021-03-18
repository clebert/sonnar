import {NodeSet, NodeTest, root, select} from '.';

describe('NodeSet', () => {
  test('static root()', () => {
    const value = root();

    expect(value).toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('/');
  });

  test('static select()', () => {
    const ancestorOrSelf = select('ancestor-or-self', 'foo');
    const ancestor = select('ancestor', 'foo');
    const attribute = select('attribute', 'foo');
    const child = select('child', 'foo');
    const descendantOrSelf = select('descendant-or-self', 'foo');
    const descendant = select('descendant', 'foo');
    const followingSibling = select('following-sibling', 'foo');
    const following = select('following', 'foo');
    const namespace = select('namespace', 'foo');
    const parent = select('parent', 'foo');
    const precedingSibling = select('preceding-sibling', 'foo');
    const preceding = select('preceding', 'foo');
    const self = select('self', 'foo');

    expect(ancestorOrSelf).toBeInstanceOf(NodeSet);
    expect(ancestorOrSelf.expression).toBe('ancestor-or-self::foo');
    expect(ancestor.expression).toBe('ancestor::foo');
    expect(attribute.expression).toBe('attribute::foo');
    expect(child.expression).toBe('child::foo');
    expect(descendantOrSelf.expression).toBe('descendant-or-self::foo');
    expect(descendant.expression).toBe('descendant::foo');
    expect(followingSibling.expression).toBe('following-sibling::foo');
    expect(following.expression).toBe('following::foo');
    expect(namespace.expression).toBe('namespace::foo');
    expect(parent.expression).toBe('parent::foo');
    expect(precedingSibling.expression).toBe('preceding-sibling::foo');
    expect(preceding.expression).toBe('preceding::foo');
    expect(self.expression).toBe('self::foo');

    const nodeTest = select('child');
    const comment = nodeTest.comment();
    const node = nodeTest.node();
    const processingInstruction1 = nodeTest.processingInstruction();
    const processingInstruction2 = nodeTest.processingInstruction('target');
    const text = nodeTest.text();

    expect(nodeTest).toBeInstanceOf(NodeTest);
    expect(comment).toBeInstanceOf(NodeSet);
    expect(comment.expression).toBe('child::comment()');
    expect(node.expression).toBe('child::node()');

    expect(processingInstruction1.expression).toBe(
      'child::processing-instruction()'
    );

    expect(processingInstruction2.expression).toBe(
      'child::processing-instruction(target)'
    );

    expect(text.expression).toBe('child::text()');
  });

  test('filter()', () => {
    const value = root().filter(select('child', 'foo').filter('0')).filter('1');

    expect(value).toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('/[child::foo["0"]]["1"]');
  });

  test('path()', () => {
    const nodeSet1 = root()
      .path(select('child', 'foo').path(select('child', 'bar').filter('0')))
      .path(select('child', 'baz'))
      .filter('1');

    const nodeSet2 = select('child', 'foo')
      .path(select('child', 'bar').filter('0'))
      .path(select('child', 'baz'))
      .filter('1');

    expect(nodeSet1).toBeInstanceOf(NodeSet);

    expect(nodeSet1.expression).toBe(
      '/ child::foo / child::bar["0"] / child::baz["1"]'
    );

    expect(nodeSet2).toBeInstanceOf(NodeSet);

    expect(nodeSet2.expression).toBe(
      'child::foo / child::bar["0"] / child::baz["1"]'
    );
  });

  test('union()', () => {
    const value = root()
      .union(select('child', 'foo').union(select('child', 'bar').filter('0')))
      .union(select('child', 'baz'))
      .filter('1');

    expect(value).toBeInstanceOf(NodeSet);

    expect(value.expression).toBe(
      '/ | child::foo | child::bar["0"] | child::baz["1"]'
    );
  });

  test('enclose()', () => {
    const value1 = root().enclose();
    const value2 = value1.enclose();
    const value3 = value1.add(select('child', 'foo')).add('0').enclose();

    expect(value1).toBeInstanceOf(NodeSet);
    expect(value1.expression).toBe('(/)');
    expect(value2).toBe(value1);
    expect(value3.expression).toBe('((/) + child::foo + "0")');
  });

  test('or()', () => {
    const value = root().or(select('child', 'foo')).or('0');

    expect(value).toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('/ or child::foo or "0"');
  });

  test('and()', () => {
    const value = root().and(select('child', 'foo')).and('0');

    expect(value).toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('/ and child::foo and "0"');
  });

  test('is()', () => {
    const value1 = root().is('=', select('child', 'foo'));
    const value2 = value1.is('!=', '0');
    const value3 = value1.is('<', '0');
    const value4 = value1.is('<=', '0');
    const value5 = value1.is('>', '0');
    const value6 = value1.is('>=', '0');

    expect(value1).toBeInstanceOf(NodeSet);
    expect(value1.expression).toBe('/ = child::foo');
    expect(value2).toBeInstanceOf(NodeSet);
    expect(value2.expression).toBe('/ = child::foo != "0"');
    expect(value3.expression).toBe('/ = child::foo < "0"');
    expect(value4.expression).toBe('/ = child::foo <= "0"');
    expect(value5.expression).toBe('/ = child::foo > "0"');
    expect(value6.expression).toBe('/ = child::foo >= "0"');
  });

  test('add()', () => {
    const value = root().add(select('child', 'foo')).add('0');

    expect(value).toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('/ + child::foo + "0"');
  });

  test('subtract()', () => {
    const value = root().subtract(select('child', 'foo')).subtract('0');

    expect(value).toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('/ - child::foo - "0"');
  });

  test('multiply()', () => {
    const value = root().multiply(select('child', 'foo')).multiply('0');

    expect(value).toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('/ * child::foo * "0"');
  });

  test('divide()', () => {
    const value = root().divide(select('child', 'foo')).divide('0');

    expect(value).toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('/ div child::foo div "0"');
  });

  test('mod()', () => {
    const value = root().mod(select('child', 'foo')).mod('0');

    expect(value).toBeInstanceOf(NodeSet);
    expect(value.expression).toBe('/ mod child::foo mod "0"');
  });
});
