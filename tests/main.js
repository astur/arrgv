var tape = require('tape');
var arrgv = require('../');

tape.test('return array', function (t) {
    t.ok(Array.isArray(arrgv()), 'array must be returned when no args');
    t.ok(Array.isArray(arrgv('')), 'array must be returned on enpty string');
    t.ok(Array.isArray(arrgv(1)), 'array must be returned on number');
    t.ok(Array.isArray(arrgv([])), 'array must be returned on array');
    t.ok(Array.isArray(arrgv({})), 'array must be returned on object');
    t.ok(Array.isArray(arrgv(true)), 'array must be returned on true');
    t.ok(Array.isArray(arrgv(false)), 'array must be returned on false');
    t.ok(Array.isArray(arrgv(null)), 'array must be returned on null');
    t.ok(Array.isArray(arrgv(undefined)), 'array must be returned on undefined');
    t.end();
});

tape.test('split', function (t) {

    t.same(arrgv('aaa bbb ccc'),
        ['aaa', 'bbb', 'ccc'],
        'splits easy args by space');

    t.same(arrgv('aaa  bbb   ccc'),
        ['aaa', 'bbb', 'ccc'],
        'multi space works as single');

    t.end();
});

tape.test('double quotes', function (t) {

    t.same(arrgv('aaa "bbb" ccc'),
        ['aaa', 'bbb', 'ccc'],
        'no double quotes in string args');

    t.same(arrgv('aaa "b\'bb" ccc'),
        ['aaa', 'b\'bb', 'ccc'],
        'single quote saved in double quotes');

    t.same(arrgv('aaa "bb"b ccc'),
        ['aaa', 'bbb', 'ccc'],
        'no double quotes inside words');

    t.same(arrgv('aaa "bbb ccc" ddd'),
        ['aaa', 'bbb ccc', 'ddd'],
        'multi word args in double quotes');

    t.same(arrgv('aaa bbb" "ccc ddd'),
        ['aaa', 'bbb ccc', 'ddd'],
        'multi word args with double quoted space');

    t.same(arrgv('aaa b"bb cc"c ddd'),
        ['aaa', 'bbb ccc', 'ddd'],
        'double quotes in words make string arg');

    t.end();
});

tape.test('single quotes', function (t) {

    t.same(arrgv("aaa 'bbb' ccc"),
        ['aaa', 'bbb', 'ccc'],
        'no single quotes in string args');

    t.same(arrgv("aaa 'b\"bb' ccc"),
        ['aaa', 'b"bb', 'ccc'],
        'double quote saved in single quotes');

    t.same(arrgv("aaa 'bb'b ccc"),
        ['aaa', 'bbb', 'ccc'],
        'no single quotes inside words');

    t.same(arrgv("aaa 'bbb ccc' ddd"),
        ['aaa', 'bbb ccc', 'ddd'],
        'multi word args in single quotes');

    t.same(arrgv("aaa bbb' 'ccc ddd"),
        ['aaa', 'bbb ccc', 'ddd'],
        'multi word args with single quoted space');

    t.same(arrgv("aaa b'bb cc'c ddd"),
        ['aaa', 'bbb ccc', 'ddd'],
        'single quotes in words make string arg');

    t.end();
});

tape.test('spaces', function (t) {

    t.same(arrgv('aaa\nbbb'),
        ['aaa', 'bbb'],
        '\\n is delimiter');

    t.same(arrgv('aaa\bbbb'),
        ['aaa', 'bbb'],
        '\\b is delimiter');

    t.same(arrgv('aaa\rbbb'),
        ['aaa', 'bbb'],
        '\\r is delimiter');

    t.same(arrgv('aaa\tbbb'),
        ['aaa', 'bbb'],
        '\\t is delimiter');

    t.same(arrgv('aaa\fbbb'),
        ['aaa', 'bbb'],
        '\\f is delimiter');

    t.end();
});

tape.test('slashes', function (t) {

    t.same(arrgv('aaa \\"bbb c\\"cc ddd'),
        ['aaa', '"bbb', 'c"cc', 'ddd'],
        'slashed double quotes is usual char');

    t.same(arrgv("aaa \\'bbb c\\'cc ddd"),
        ['aaa', "'bbb", "c'cc", 'ddd'],
        'slashed single quotes is usual char');

    t.same(arrgv('\\$\\`\\"\\h aaa'),
        ['$`"h', 'aaa'],
        'no slashes outside quotes');

    t.same(arrgv('"\\$\\`\\"\\h aaa"'),
        ['$`"\\h aaa'],
        'slashes saved in double quotes except $`"');

    t.same(arrgv("'\\$\\`\\h aaa'"),
        ['\\$\\`\\h aaa'],
        'slashes saved in single quotes');

    t.same(arrgv('"\\\\"'),
        ['\\'],
        'slashes need escaping in double quotes');

    t.same(arrgv("'\\\\'"),
        ['\\\\'],
        'slashes saved as is in single quotes');

    t.end();
});

tape.test('errors', function (t) {

    t.throws(function(){arrgv('aaa"bbb');},
        SyntaxError,
        'double quotes must be closed');

    t.throws(function(){arrgv("aaa'bbb");},
        SyntaxError,
        'single quotes must be closed');

    t.throws(function(){arrgv('aaa\\');},
        SyntaxError,
        'end of string must not to be escaped');

    t.end();
});
