import { getNextmdFromFilePath } from '../utils/fs';

describe('md file', () => {
  test('generate nextmd from path/index.md', () => {
    expect(getNextmdFromFilePath('files/path/index.md', 'files')).toEqual(['path']);
  });

  test('generate nextmd from path/hello.md', () => {
    expect(getNextmdFromFilePath('files/path/hello.md', 'files')).toEqual(['path', 'hello']);
  });

  test('generate nextmd from path/_hello.md', () => {
    expect(getNextmdFromFilePath('path/_hello.md', './')).toEqual(['path', '_hello']);
  });

  test('generate nextmd from path/1970-01-01-helloworld.md', () => {
    expect(getNextmdFromFilePath('files/path/1970-01-01-helloworld.md', 'files')).toEqual(['path', 'helloworld']);
  });
});
