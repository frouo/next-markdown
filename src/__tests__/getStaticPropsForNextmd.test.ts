import NextMarkdown from '..';

const nextMD = NextMarkdown({ pathToContent: 'src/__tests__/__filesystem__/' });

test('/about', async () => {
  expect(await nextMD.getStaticPropsForNextmd(['about'])).toMatchSnapshot();
});

test('/blog', async () => {
  expect(await nextMD.getStaticPropsForNextmd(['blog'])).toMatchSnapshot();
});

test('/path/to/e', async () => {
  expect(await nextMD.getStaticPropsForNextmd(['path', 'to', 'e'])).toMatchSnapshot();
});

test('an unknown path', async () => {
  await expect(nextMD.getStaticPropsForNextmd(['empty'])).rejects.toThrowError(
    Error('Could not find markdown file at path "empty"'),
  );
});

test('/docs/getting-started', async () => {
  expect(await nextMD.getStaticPropsForNextmd(['docs', 'getting-started'])).toMatchSnapshot();
});

test('/docs/api', async () => {
  expect(await nextMD.getStaticPropsForNextmd(['docs', 'api'])).toMatchSnapshot();
});

test('/docs/examples (no index.md)', async () => {
  await expect(nextMD.getStaticPropsForNextmd(['docs', 'examples'])).rejects.toThrowError(
    Error('Could not find markdown file at path "docs/examples"'),
  );
});
