import NextMarkdown, { Config } from '..';

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
