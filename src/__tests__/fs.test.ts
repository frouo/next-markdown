import { TreeObject } from '../types';
import { pathToContent, exclude, generateNextmd, isMDX } from '../utils/fs';

describe('nextmd', () => {
  test('generate nextmd for "index" at the root', () => {
    expect(generateNextmd('index.abc')).toEqual([]);
  });

  test('generate nextmd for a nested index file"', () => {
    expect(generateNextmd('path/index.abc')).toEqual(['path']);
  });

  test('generate nextmd for a nested file', () => {
    expect(generateNextmd('path/hello.abc')).toEqual(['path', 'hello']);
  });

  test('generate nextmd for a very nested file', () => {
    expect(generateNextmd('path/to/a/file/hello.abc')).toEqual(['path', 'to', 'a', 'file', 'hello']);
  });

  test('generate nextmd for a file starting with "_"', () => {
    // indeed, the fact to exclude file starting with "_" is not the responsibility of this function.
    expect(generateNextmd('_hello.abc')).toEqual(['_hello']);
  });

  test('exclude brackets at the beginning of the file name', () => {
    expect(generateNextmd('[doc1]hello.abc')).toEqual(['hello']);
  });

  test('exclude brackets in the file name', () => {
    expect(generateNextmd('_[doc1]hello.abc')).toEqual(['_hello']);
  });

  test('exclude only the first brackets occurence in the file name', () => {
    expect(generateNextmd('_[doc1]hel[trap]lo.abc')).toEqual(['_hel[trap]lo']);
  });

  test('exclude brackets and any following whitespaces in the file name', () => {
    expect(generateNextmd('[doc1]   hello.abc')).toEqual(['hello']);
  });

  test('check the brackets rule for a nested file', () => {
    expect(generateNextmd('path/[doc1]hello.abc')).toEqual(['path', 'hello']);
  });

  test('ensure the brackets rule only applied to the file name', () => {
    expect(generateNextmd('path/[brackets-rule-only-applied-to-filename]to/hello.abc')).toEqual([
      'path',
      '[brackets-rule-only-applied-to-filename]to',
      'hello',
    ]);
  });
});

describe('tree object to exclude from generating a path', () => {
  const aFileWithExt = (extension: string): TreeObject => ({
    type: 'file',
    name: `hello.${extension}`,
    path: `path/hello.${extension}`,
  });

  const aFile = aFileWithExt('');

  test('include directories with children', () => {
    const gitDir: TreeObject = { type: 'dir', name: 'blog', path: 'path/to/blog', children: [aFile] };
    expect(exclude(gitDir)).toBe(false);
  });

  test('include md files', () => {
    expect(exclude(aFileWithExt('md'))).toBe(false);
  });

  test('include mdx files', () => {
    expect(exclude(aFileWithExt('mdx'))).toBe(false);
  });

  test('exclude empty directories', () => {
    const gitDir: TreeObject = { type: 'dir', name: 'blog', path: 'path/to/blog', children: [] };
    expect(exclude(gitDir)).toBe(true);
  });

  test('exclude .git directories', () => {
    const gitDir: TreeObject = { type: 'dir', name: '.git', path: 'path/to/.git', children: [aFile, aFile] };
    expect(exclude(gitDir)).toBe(true);
  });

  test('exclude files if not .md or .mdx', () => {
    expect(exclude(aFileWithExt('abc'))).toBe(true);
  });
});

describe('is mdx', () => {
  test('path/to/hello.mdx is a MDX file', () => {
    expect(isMDX('path/to/hello.mdx')).toBe(true);
  });

  test('hello.mdx is a MDX file', () => {
    expect(isMDX('hello.mdx')).toBe(true);
  });

  test('hello.md is not a MDX file', () => {
    expect(isMDX('hello.md')).toBe(false);
  });

  test('hello.abc is not a MDX file', () => {
    expect(isMDX('hello.abc')).toBe(false);
  });
});

describe('path to content creation', () => {
  test('when using local config', () => {
    expect(pathToContent('', false)).toBe('./');
  });

  test('when using local config with path', () => {
    expect(pathToContent('path/to', false)).toBe('path/to');
  });

  test('when using remote config', () => {
    expect(pathToContent('', true)).toBe('.git/next-md');
  });

  test('when using remote config with path', () => {
    expect(pathToContent('path/to', true)).toBe('.git/next-md/path/to');
  });
});
