import fs from 'fs';
import { join, parse, sep } from 'path';
import { File, TreeObject } from '../types';

export const pathToContent = (userPathToContent: string, remote: boolean) =>
  join(remote ? './.git/next-md' : './', userPathToContent);

export const exclude = (object: TreeObject) => {
  if (object.type === 'file' && object.name.endsWith('.md') === false && object.name.endsWith('.mdx') === false) {
    return true;
  }

  if (object.name === '.git') {
    return true;
  }

  if (object.type === 'dir' && object.children.length === 0) {
    return true;
  }

  return false;
};

export const treeSync = (path: string, absoluteToRelative: (path: string) => string) => {
  const res = fs
    .readdirSync(path)
    .map((e) => ({ name: e, dir: path }))
    .map(
      (
        (fileSystem: typeof fs) =>
        (e): TreeObject | null => {
          const _path = join(e.dir, e.name);
          const isDir = fileSystem.lstatSync(_path).isDirectory();
          if (e.name === '.git') {
            return null; // no need to inspect recursively this
          } else {
            return isDir
              ? {
                  type: 'dir',
                  name: e.name,
                  path: absoluteToRelative(_path),
                  children: treeSync(_path, absoluteToRelative),
                }
              : {
                  type: 'file',
                  name: e.name,
                  path: absoluteToRelative(_path),
                };
          }
        }
      )(fs),
    )
    .flatMap((f) => (f ? [f] : []))
    .filter((e) => exclude(e) === false);

  return res;
};

export const flatFiles = (tree: TreeObject[]): File[] => {
  const flatRecursively = (object: TreeObject): TreeObject[] =>
    object.type === 'dir' ? object.children.flatMap(flatRecursively) : [object];

  return tree.flatMap(flatRecursively) as File[];
};

export const generateNextmd = (relativeFilePath: string) => {
  return relativeFilePath
    .split(sep)
    .map((e) => e.replace(/^_(\s+)?/, '')) // replace the first occurence of "_" at the beginning of the string with ""
    .map((e) => e.replace(/^\[(.*?)\](\s+)?_?/, '')) // replace the first occurence of "[whatever-you-want]+whitespaces(if-any)" at the beginning of string with ""
    .map((e, index, arr) => {
      if (index === arr.length - 1) {
        const lastElement = e;
        const parsed = parse(lastElement);
        if (parsed.name === 'index') {
          return undefined;
        } else {
          return parsed.name;
        }
      } else {
        return e;
      }
    })
    .map((e) => e?.trim())
    .flatMap((e) => (e ? [e] : []));
};

export const getPostFilesFromNextmd = async (files: File[], nextmd: string[]) =>
  files.filter((e) => parse(e.path).dir === nextmd.join('/'));

export const isMDX = (filePath: string) => filePath.endsWith('.mdx');

export const readFileSyncUTF8 = (filePath: string) => fs.readFileSync(filePath).toString('utf-8');

export const isDraft = (relativeFilePath: string) =>
  relativeFilePath.split(sep).find((e) => e.startsWith('_')) !== undefined;
