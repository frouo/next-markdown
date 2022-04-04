import { TreeObject } from '../types';
import { exclude, getNextmdFromFilePath } from '../utils/fs';

describe('nextmd', () => {
  test('generate nextmd from path/index.abc', () => {
    expect(getNextmdFromFilePath('files/path/index.abc', 'files')).toEqual(['path']);
  });

  test('generate nextmd from path/hello.abc', () => {
    expect(getNextmdFromFilePath('files/path/hello.abc', 'files')).toEqual(['path', 'hello']);
  });

  test('generate nextmd from hello.abc', () => {
    expect(getNextmdFromFilePath('hello.abc', './')).toEqual(['hello']);
  });

  test('generate nextmd from _hello.abc', () => {
    expect(getNextmdFromFilePath('_hello.abc', './')).toEqual(['_hello']);
  });

  test('generate nextmd from 1970-01-01-helloworld.abc', () => {
    expect(getNextmdFromFilePath('1970-01-01-helloworld.abc', './')).toEqual(['helloworld']);
  });

  test('generate nextmd from path/1970-01-01-helloworld.abc', () => {
    expect(getNextmdFromFilePath('path/1970-01-01-helloworld.abc', './')).toEqual(['path', 'helloworld']);
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
