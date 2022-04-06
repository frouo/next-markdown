import fs from 'fs';
import matter from 'gray-matter';
import { Root } from 'mdast';
import { join } from 'path';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { File, YAMLFrontMatter } from '../types';
import { extractDataFromAlt } from './alt';
import { getNextmdFromFilePath, isMDX } from './fs';
import { getTableOfContents } from './table-of-contents';

export const getPostsFromNextmd = async <T extends YAMLFrontMatter>(
  files: File[],
  localRepoPath: string,
  nextmd: string[],
) => {
  type PostFile = { file: File; date: string };

  const posts = files.reduce<PostFile[]>((prev, curr) => {
    const matches = curr.name.match(/^\d{4}-\d{2}-\d{2}/i);
    if (curr.path.startsWith(join(localRepoPath, nextmd.join('/'))) && matches && matches.length > 0) {
      return prev.concat([{ file: curr, date: matches[0] }]);
    }
    return prev;
  }, []);

  return posts.length === 0
    ? null
    : await Promise.all(
        posts.map(async (e) => {
          const postPageData = await readMarkdownFile<T>(e.file.path);
          const postNextmd = getNextmdFromFilePath(e.file.path, localRepoPath);
          return {
            file: e.file,
            data: {
              ...postPageData,
              nextmd: postNextmd,
              date: e.date,
            },
          };
        }),
      );
};

export const readMarkdownFile = async <T extends YAMLFrontMatter>(filePath: string) => {
  const importMdxSerialize = async () => (await import('next-mdx-remote/serialize')).serialize;

  const rawdata = fs.readFileSync(filePath).toString('utf-8');
  const { frontMatter, content } = extractFrontMatter<T>(rawdata);
  const mdx = isMDX(filePath);

  return {
    frontMatter,
    html: mdx ? null : await markdownToHtml(content),
    mdxSource: mdx ? await importMdxSerialize().then((serialize) => serialize(content)) : null,
    tableOfContents: getTableOfContents(content),
  };
};

export const extractFrontMatter = <T extends YAMLFrontMatter>(rawdata: string) => {
  const { data, content } = matter(rawdata);

  return {
    frontMatter: data as T,
    content,
  };
};

export const markdownToHtml = async (markdown: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeVideos)
    .use(rehypeStringify)
    .use(rehypeSlug)
    .process(markdown);

  return String(result);
};

export const rehypeVideos = (): ((tree: Root) => void) => {
  return (tree) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'img' && node.properties && typeof node.properties.src === 'string') {
        const url = node.properties.src;

        if (url.includes('.mov') || url.includes('mp4')) {
          const altData = extractDataFromAlt(node.properties.alt);

          node.tagName = 'video';
          node.properties.width = '100%';
          node.properties.controls = true;

          if (typeof altData === 'string') {
            node.properties.alt = altData;
          } else {
            Object.entries(altData).forEach(([key, value]) => {
              node.properties[key] = value;
            });
          }
        }
      }
    });
  };
};
