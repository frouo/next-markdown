import NextMarkdown, { Config } from '..';
import { markdownToHtml, parseMarkdownFileContent } from '../utils/markdown';

describe('next-markdown', () => {
  test('loads correctly', () => {
    const nextMD = NextMarkdown({ pathToContent: 'test/path' });

    expect(nextMD.getStaticPaths).toBeDefined();
    expect(nextMD.getStaticProps).toBeDefined();
  });

  test('index exports Config type', () => {
    const config: Config<{}> = { pathToContent: 'test/path' };
    expect(config).toBeDefined();
  });
});

describe('markdown.ts', () => {
  test('extracts front matter from md file content', () => {
    const mdFileContent = "---\ntitle: 'I am a title'\n---\n# Heading";
    const { frontMatter, content } = parseMarkdownFileContent<{ title: string }>(mdFileContent);

    expect(frontMatter?.title).toBe('I am a title');
    expect(content).toBe('# Heading');
  });

  test('frontMatter is undefined when md file content does not have front matter', () => {
    const mdFileContent = '# Heading';
    const { frontMatter, content } = parseMarkdownFileContent(mdFileContent);

    expect(frontMatter).toBeUndefined();
    expect(content).toBe('# Heading');
  });

  test('converts markdown to HTML', async () => {
    const mdFileContent = '# Present yourself\n\nI am **next-markdown**';
    const html = await markdownToHtml(mdFileContent);

    expect(html).toBe('<h1>Present yourself</h1>\n<p>I am <strong>next-markdown</strong></p>');
  });
});
