import { getTableOfContents } from '../utils/table-of-contents';

describe('Table of Contents', () => {
  test('is created correctly', () => {
    const content = `
# Title 1
## Title 2
## Title 3
### Title 4
#### Title 5
### Title 6
## Title 7
### Title 8
# Title 9
abc`.trim();

    expect(getTableOfContents(content)).toMatchSnapshot();
  });

  test('is created correctly without H1', () => {
    const content = `
## Title 1
#### Title 2
### Title 3
## Title 4
### Title 5
abc`.trim();

    expect(getTableOfContents(content)).toMatchSnapshot();
  });
});
