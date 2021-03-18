import {fn, root, select} from '.';

test('Find all HackerNews posts which have more than 50 comments', () => {
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
});

test('W3C Location Path Examples', () => {
  expect(select('child', 'para').expression).toBe('child::para');
  expect(select('child', '*').expression).toBe('child::*');
  expect(select('child').text().expression).toBe('child::text()');
  expect(select('child').node().expression).toBe('child::node()');
  expect(select('attribute', 'name').expression).toBe('attribute::name');
  expect(select('attribute', '*').expression).toBe('attribute::*');
  expect(select('descendant', 'para').expression).toBe('descendant::para');
  expect(select('ancestor', 'div').expression).toBe('ancestor::div');

  expect(select('ancestor-or-self', 'div').expression).toBe(
    'ancestor-or-self::div'
  );

  expect(select('descendant-or-self', 'para').expression).toBe(
    'descendant-or-self::para'
  );

  expect(select('self', 'para').expression).toBe('self::para');

  expect(
    select('child', 'chapter').select('descendant', 'para').expression
  ).toBe('child::chapter / descendant::para');

  expect(select('child', '*').select('child', 'para').expression).toBe(
    'child::* / child::para'
  );

  expect(root().expression).toBe('/');

  expect(root().select('descendant', 'para').expression).toBe(
    '/ descendant::para'
  );

  expect(
    root().select('descendant', 'olist').select('child', 'item').expression
  ).toBe('/ descendant::olist / child::item');

  expect(
    select('child', 'para').filter(fn('position').is('=', 1)).expression
  ).toBe('child::para[position() = 1]');

  expect(
    select('child', 'para').filter(fn('position').is('=', fn('last')))
      .expression
  ).toBe('child::para[position() = last()]');

  expect(
    select('child', 'para').filter(
      fn('position').is('=', fn('last').subtract(1))
    ).expression
  ).toBe('child::para[position() = last() - 1]');

  expect(
    select('child', 'para').filter(fn('position').is('>', 1)).expression
  ).toBe('child::para[position() > 1]');

  expect(
    select('following-sibling', 'chapter').filter(fn('position').is('=', 1))
      .expression
  ).toBe('following-sibling::chapter[position() = 1]');

  expect(
    select('preceding-sibling', 'chapter').filter(fn('position').is('=', 1))
      .expression
  ).toBe('preceding-sibling::chapter[position() = 1]');

  expect(
    root().select('descendant', 'figure').filter(fn('position').is('=', 42))
      .expression
  ).toBe('/ descendant::figure[position() = 42]');

  expect(
    root()
      .select('child', 'doc')
      .select('child', 'chapter')
      .filter(fn('position').is('=', 5))
      .select('child', 'section')
      .filter(fn('position').is('=', 2)).expression
  ).toBe(
    '/ child::doc / child::chapter[position() = 5] / child::section[position() = 2]'
  );

  expect(
    select('child', 'para').filter(
      select('attribute', 'type').is('=', 'warning')
    ).expression
  ).toBe('child::para[attribute::type = "warning"]');

  expect(
    select('child', 'para')
      .filter(select('attribute', 'type').is('=', 'warning'))
      .filter(fn('position').is('=', 5)).expression
  ).toBe('child::para[attribute::type = "warning"][position() = 5]');

  expect(
    select('child', 'para')
      .filter(fn('position').is('=', 5))
      .filter(select('attribute', 'type').is('=', 'warning')).expression
  ).toBe('child::para[position() = 5][attribute::type = "warning"]');

  expect(
    select('child', 'chapter').filter(
      select('child', 'title').is('=', 'Introduction')
    ).expression
  ).toBe('child::chapter[child::title = "Introduction"]');

  expect(
    select('child', 'chapter').filter(select('child', 'title')).expression
  ).toBe('child::chapter[child::title]');

  expect(
    select('child', '*').filter(
      select('self', 'chapter').or(select('self', 'appendix'))
    ).expression
  ).toBe('child::*[self::chapter or self::appendix]');

  expect(
    select('child', '*')
      .filter(select('self', 'chapter').or(select('self', 'appendix')))
      .filter(fn('position').is('=', fn('last'))).expression
  ).toBe('child::*[self::chapter or self::appendix][position() = last()]');
});
