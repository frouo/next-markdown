import { getNextmdFromFilePath } from '../utils/fs';

describe('nextmd', () => {
  test('generate nextmd from path/index.abc', () => {
    expect(getNextmdFromFilePath('files/path/index.abc', 'files')).toEqual(['path']);
  });

  test('generate nextmd from path/hello.abc', () => {
    expect(getNextmdFromFilePath('files/path/hello.abc', 'files')).toEqual(['path', 'hello']);
  });

  test('generate nextmd from hello.abc', () => {
    expect(getNextmdFromFilePath('hello.abc', './')).toEqual(['hello']);
  });

  test('generate nextmd from _hello.abc', () => {
    expect(getNextmdFromFilePath('_hello.abc', './')).toEqual(['_hello']);
  });

  test('generate nextmd from 1970-01-01-helloworld.abc', () => {
    expect(getNextmdFromFilePath('1970-01-01-helloworld.abc', './')).toEqual(['helloworld']);
  });

  test('generate nextmd from path/1970-01-01-helloworld.abc', () => {
    expect(getNextmdFromFilePath('path/1970-01-01-helloworld.abc', './')).toEqual(['path', 'helloworld']);
  });
});
