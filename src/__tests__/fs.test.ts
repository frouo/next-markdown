import { join, parse, resolve } from 'path';
import { Dir, File, TreeObject } from '../types';
import { pathToContent, exclude, isMDX, flatFiles, treeSync } from '../utils/fs';

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

describe('flat files', () => {
  const createAFile = (name: string, dir: string): File => ({ type: 'file', name, path: join(dir, name) });
  const createADir = (dir: string, children: TreeObject[]): Dir => ({
    type: 'dir',
    name: parse(dir).base,
    path: dir,
    children,
  });

  test('empty', () => {
    expect(flatFiles([])).toEqual([]);
  });

  test('emty dirs', () => {
    const dir1 = createADir('docs', []);
    const dir2 = createADir('blog', []);
    const tree: Dir[] = [dir1, dir2];
    expect(flatFiles(tree)).toEqual([]);
  });

  test('only files', () => {
    const file1 = createAFile('file1', './');
    const file2 = createAFile('file2', './');
    const tree: File[] = [file1, file2];
    expect(flatFiles(tree)).toMatchSnapshot();
  });

  test('file and dirs with nested files', () => {
    const fileAbout = createAFile('about', './');
    const fileDoc1 = createAFile('file1', './docs');
    const fileDoc2 = createAFile('file2', './docs');
    const folderDocs = createADir('docs', [fileDoc1, fileDoc2]);
    const fileBlog1 = createAFile('file1', './blog');
    const folderBlog = createADir('blog', [fileBlog1]);
    expect(flatFiles([fileAbout, folderDocs, folderBlog])).toMatchSnapshot();
  });

  test('file in a subfolder', () => {
    const fileDoc1 = createAFile('file1', './docs/subfolder');
    const folderSubfolder = createADir('./docs/subfolder', [fileDoc1]);
    const folderDocs = createADir('docs', [folderSubfolder]);
    expect(flatFiles([folderDocs])).toMatchSnapshot();
  });
});

test('Tree parsing', () => {
  const dirFileSystem = resolve(__dirname, '__filesystem__/');
  expect(treeSync(dirFileSystem)).toMatchSnapshot();
});
