import { generateNextmd } from '../utils/fs';

describe('generate nextmd', () => {
  test('for "index" at the root', () => {
    expect(generateNextmd('index.abc')).toEqual([]);
  });

  test('for a nested index file"', () => {
    expect(generateNextmd('path/index.abc')).toEqual(['path']);
  });
});

describe('generate nextmd', () => {
  test('for "hello"', () => {
    expect(generateNextmd('hello.abc')).toEqual(['hello']);
  });

  test('for a nested "hello"', () => {
    expect(generateNextmd('path/hello.abc')).toEqual(['path', 'hello']);
  });
});

test('generate nextmd for a very nested file', () => {
  expect(generateNextmd('path/to/a/file/hello.abc')).toEqual(['path', 'to', 'a', 'file', 'hello']);
});

describe('handle the underscore', () => {
  test('for "_index" at the root', () => {
    expect(generateNextmd('_index.abc')).toEqual([]);
  });

  test('for a nested _index file"', () => {
    expect(generateNextmd('path/_index.abc')).toEqual(['path']);
  });

  test('for "_hello"', () => {
    expect(generateNextmd('_hello.abc')).toEqual(['hello']);
  });

  test('for "_ hello"', () => {
    expect(generateNextmd('_ hello.abc')).toEqual(['hello']);
  });

  test('for "hel_lo"', () => {
    expect(generateNextmd('hel_lo.abc')).toEqual(['hel_lo']);
  });

  test('for a nested "_hello"', () => {
    expect(generateNextmd('path/_hello.abc')).toEqual(['path', 'hello']);
  });

  test('for a path starting with "_"', () => {
    expect(generateNextmd('_path/hello.abc')).toEqual(['path', 'hello']);
  });

  test('for a path that includes "_" in a subpath', () => {
    expect(generateNextmd('path/_to/hello.abc')).toEqual(['path', 'to', 'hello']);
  });

  test('for a path that includes "_ " in a subpath', () => {
    expect(generateNextmd('path/_ to/hello.abc')).toEqual(['path', 'to', 'hello']);
  });

  test('brackets in file name', () => {
    expect(generateNextmd('_[1] hello.abc')).toEqual(['hello']);
  });

  test('brackets in path', () => {
    expect(generateNextmd('_ [1] path/hello.abc')).toEqual(['path', 'hello']);
  });
});

describe('ignore brackets (file name)', () => {
  test('at the beginning of the file name', () => {
    expect(generateNextmd('[1]hello.abc')).toEqual(['hello']);
  });

  test('followed by whitespaces at the beginning of the file name', () => {
    expect(generateNextmd('[1]   hello.abc')).toEqual(['hello']);
  });

  test('only at the beginning of the file name', () => {
    expect(generateNextmd('hel[lll]lo.abc')).toEqual(['hel[lll]lo']);
  });

  test('only at the beginning of the file name (2)', () => {
    expect(generateNextmd('[1]hel[lll]lo.abc')).toEqual(['hel[lll]lo']);
  });
});

describe('ignore brackets (path)', () => {
  test('at the beginning of the path', () => {
    expect(generateNextmd('[1]path/hello.abc')).toEqual(['path', 'hello']);
  });

  test('followed by whitespaces at the beginning of the path', () => {
    expect(generateNextmd('[1]   path/hello.abc')).toEqual(['path', 'hello']);
  });

  test('in a subpath', () => {
    expect(generateNextmd('path/[1] to/hello.abc')).toEqual(['path', 'to', 'hello']);
  });
});

describe('edge cases', () => {
  test('when the path is index', () => {
    expect(generateNextmd('path/index/to/about.abc')).toEqual(['path', 'index', 'to', 'about']);
  });

  test('trimmed whitespaces', () => {
    expect(generateNextmd('   about   .abc')).toEqual(['about']);
  });
});
