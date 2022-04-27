import NextMarkdown from '..';

test('generate nextmd from a file tree', async () => {
  const nextMD = NextMarkdown({ pathToContent: 'src/__tests__/__filesystem__/' });

  expect(await nextMD.getStaticPaths()).toMatchSnapshot();
});
