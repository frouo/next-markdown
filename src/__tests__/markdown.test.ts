import { markdownToHtml, extractFrontMatter } from '../utils/markdown';

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
    const html = await markdownToHtml(mdFileContent);

    expect(html).toBe('<h1 id="present-yourself">Present yourself</h1>\n<p>I am <strong>next-markdown</strong></p>');
  });
});
