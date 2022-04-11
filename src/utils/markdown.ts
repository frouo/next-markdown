import fs from 'fs';
import matter from 'gray-matter';
import { Root } from 'mdast';
import { MDXRemoteSerializeResult, SerializeOptions } from 'next-mdx-remote/dist/types';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { MarkdownPlugins, TableOfContents, YAMLFrontMatter } from '../types';
import { extractDataFromAlt } from './alt';
import { isMDX } from './fs';
import { getTableOfContents } from './table-of-contents';

export const readMarkdownFile = async <T extends YAMLFrontMatter>(filePath: string, config: MarkdownPlugins) => {
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
  config: MarkdownPlugins,
  transformers: {
    markdownToHtml: (content: string, config: MarkdownPlugins) => Promise<string>;
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
    html: type === 'md' ? await transformers.markdownToHtml(content, config) : null,
    mdxSource:
      type === 'mdx'
        ? await transformers.mdxSerialize(content, {
            mdxOptions: {
              rehypePlugins: [rehypeVideos, rehypeSlug, ...(config.rehypePlugins || [])],
              remarkPlugins: config.remarkPlugins,
            },
            parseFrontmatter: false,
          })
        : null,
    tableOfContents: transformers.tableOfContents(content),
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

  processor.use(remarkRehype).use(rehypeVideos).use(rehypeSlug);

  // inject custom rehype plugins
  if (config.rehypePlugins) {
    processor.use(config.rehypePlugins);
  }

  processor.use(rehypeStringify);

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
