import fs from 'fs';
import matter from 'gray-matter';
import { Root } from 'mdast';
import { MDXRemoteSerializeResult, SerializeOptions } from 'next-mdx-remote/dist/types';
import { join } from 'path';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { Config, File, MarkdownPlugins, TableOfContents, YAMLFrontMatter } from '../types';
import { extractDataFromAlt } from './alt';
import { getNextmdFromFilePath, isMDX } from './fs';
import { getTableOfContents } from './table-of-contents';

export const getPostsFromNextmd = async <T extends YAMLFrontMatter>(
  files: File[],
  localRepoPath: string,
  nextmd: string[],
  config: Config<T>,
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
          const postPageData = await readMarkdownFile<T>(e.file.path, config);
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

export const readMarkdownFile = async <T extends YAMLFrontMatter>(filePath: string, config: Config<T>) => {
  const rawdata = fs.readFileSync(filePath).toString('utf-8');
  const mdx = isMDX(filePath);

  return await transformFileRawData<T>(rawdata, mdx ? 'mdx' : 'md', config, {
    markdownToHtml,
    mdxSerialize: (await import('next-mdx-remote/serialize')).serialize,
    tableOfContents: getTableOfContents,
  });
};

export const transformFileRawData = async <T extends YAMLFrontMatter>(
  rawdata: string,
  type: 'md' | 'mdx',
  config: Config<T>,
  plugins: {
    markdownToHtml: (content: string, config: Config<T>) => Promise<string>;
    mdxSerialize: (
      source: string,
      { scope, mdxOptions, parseFrontmatter }?: SerializeOptions,
    ) => Promise<MDXRemoteSerializeResult>;
    tableOfContents: (content: string) => TableOfContents;
  },
) => {
  const { frontMatter, content } = extractFrontMatter<T>(rawdata);

  return {
    frontMatter,
    markdown: content,
    html: type === 'md' ? await plugins.markdownToHtml(content, config) : null,
    mdxSource:
      type === 'mdx'
        ? await plugins.mdxSerialize(content, {
            mdxOptions: {
              rehypePlugins: (config.rehypePlugins || [])?.concat([rehypeVideos, rehypeSlug]),
              remarkPlugins: config.remarkPlugins,
            },
            parseFrontmatter: false,
          })
        : null,
    tableOfContents: plugins.tableOfContents(content),
  };
};

export const extractFrontMatter = <T extends YAMLFrontMatter>(rawdata: string) => {
  const { data, content } = matter(rawdata);

  return {
    frontMatter: data as T,
    content,
  };
};

export const markdownToHtml = async (markdown: string, config: MarkdownPlugins) => {
  const processor = unified().use(remarkParse);

  // inject custom remark plugins
  if (config.remarkPlugins) {
    processor.use(config.remarkPlugins);
  }
  processor.use(remarkRehype);

  // inject custom rehype plugins
  if (config.rehypePlugins) {
    processor.use(config.rehypePlugins);
  }
  processor.use(remarkRehype).use(rehypeVideos).use(rehypeStringify).use(rehypeSlug);

  const result = await processor.process(markdown);

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
