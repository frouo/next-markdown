import { getTableOfContents } from '../utils/toc';

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

    expect(getTableOfContents(content)).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "Title 1",
          "level": 1,
          "subItems": Array [
            Object {
              "id": "Title 2",
              "level": 2,
              "subItems": Array [],
              "text": "Title 2",
            },
            Object {
              "id": "Title 3",
              "level": 2,
              "subItems": Array [
                Object {
                  "id": "Title 4",
                  "level": 3,
                  "subItems": Array [
                    Object {
                      "id": "Title 5",
                      "level": 4,
                      "subItems": Array [],
                      "text": "Title 5",
                    },
                  ],
                  "text": "Title 4",
                },
                Object {
                  "id": "Title 6",
                  "level": 3,
                  "subItems": Array [],
                  "text": "Title 6",
                },
              ],
              "text": "Title 3",
            },
            Object {
              "id": "Title 7",
              "level": 2,
              "subItems": Array [
                Object {
                  "id": "Title 8",
                  "level": 3,
                  "subItems": Array [],
                  "text": "Title 8",
                },
              ],
              "text": "Title 7",
            },
          ],
          "text": "Title 1",
        },
        Object {
          "id": "Title 9",
          "level": 1,
          "subItems": Array [],
          "text": "Title 9",
        },
      ]
    `);
  });

  test('is created correctly without H1', () => {
    const content = `
## Title 1
#### Title 2
### Title 3
## Title 4
### Title 5
abc`.trim();

    expect(getTableOfContents(content)).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "Title 1",
          "level": 2,
          "subItems": Array [
            Object {
              "id": "Title 2",
              "level": 4,
              "subItems": Array [],
              "text": "Title 2",
            },
            Object {
              "id": "Title 3",
              "level": 3,
              "subItems": Array [],
              "text": "Title 3",
            },
          ],
          "text": "Title 1",
        },
        Object {
          "id": "Title 4",
          "level": 2,
          "subItems": Array [
            Object {
              "id": "Title 5",
              "level": 3,
              "subItems": Array [],
              "text": "Title 5",
            },
          ],
          "text": "Title 4",
        },
      ]
    `);
  });
});
