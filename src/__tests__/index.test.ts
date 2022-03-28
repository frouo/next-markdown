import NextMarkdown from '..';

test('Next-Markdown should load correctly', () => {
  const nextMD = NextMarkdown({ pathToContent: "test/path" });

  expect(nextMD.getStaticPaths).toBeDefined();
  expect(nextMD.getStaticProps).toBeDefined();
});
