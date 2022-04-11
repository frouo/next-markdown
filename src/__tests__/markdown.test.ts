import { Config, TableOfContents, YAMLFrontMatter } from '../types';
import { extractFrontMatter, markdownToHtml, transformFileRawData } from '../utils/markdown';

const NEXTMD_CONFIG: Config<YAMLFrontMatter> = { pathToContent: './' };

describe('extract front matter', () => {
  test('extracts front matter from md file content', () => {
    const mdFileContent = "---\ntitle: 'I am a title'\n---\n# Heading";
    const { frontMatter, content } = extractFrontMatter<{ title: string }>(mdFileContent);

    expect(frontMatter?.title).toBe('I am a title');
    expect(content).toBe('# Heading');
  });

  test('frontMatter is empty when md file content does not have front matter', () => {
    const mdFileContent = '# Heading';
    const { frontMatter, content } = extractFrontMatter(mdFileContent);

    expect(frontMatter).toEqual({});
    expect(content).toBe('# Heading');
  });
});

describe('markdown to html', () => {
  test('converts markdown to HTML', async () => {
    const mdFileContent = '# Present yourself\n\nI am **next-markdown**';
    const html = await markdownToHtml(mdFileContent, NEXTMD_CONFIG);

    expect(html).toBe('<h1 id="present-yourself">Present yourself</h1>\n<p>I am <strong>next-markdown</strong></p>');
  });
});

describe('transform file raw data into props', () => {
  const rawdata = "---\ntitle: 'I am a title'\n---# This part will be mocked";
  const data = { title: 'I am a title' };
  const toc: TableOfContents = [{ text: 'Heading', id: 'heading', level: 1, subItems: [] }];
  const mdContent = '# This part will be mocked';
  const plugins = {
    markdownToHtml: () => Promise.resolve('<p>mock</p>'),
    mdxSerialize: () => Promise.resolve({ compiledSource: 'js-something' }),
    tableOfContents: () => toc,
  };

  test('from rawdata of a MD file', async () => {
    const { frontMatter, markdown, html, mdxSource, tableOfContents } = await transformFileRawData(
      rawdata,
      'md',
      NEXTMD_CONFIG,
      plugins,
    );
    expect(frontMatter).toEqual(data);
    expect(markdown).toBe(mdContent);
    expect(html).toBe('<p>mock</p>');
    expect(mdxSource).toBeNull();
    expect(tableOfContents).toEqual(toc);
  });

  test('from rawdata of a MDX file', async () => {
    const { frontMatter, markdown, html, mdxSource, tableOfContents } = await transformFileRawData(
      rawdata,
      'mdx',
      NEXTMD_CONFIG,
      plugins,
    );
    expect(frontMatter).toEqual(data);
    expect(markdown).toBe(mdContent);
    expect(html).toBeNull();
    expect(mdxSource).toBeDefined();
    expect(tableOfContents).toEqual(toc);
  });
});
