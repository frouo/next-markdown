import NextMarkdown, { Config } from '..';
import { parseMarkdownFileContent } from '../utils/markdown';

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
});
