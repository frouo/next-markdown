import slugger from 'github-slugger';

interface ToCItem {
  text: string;
  id: string;
  level: string;
  subItems: ToCItem[];
}

export type TableOfContents = ToCItem[];

export function getTableOfContents(mdxContent: string) {
  const regexp = new RegExp(/^(### |## )(.*)\n/, 'gm');
  const headings = [...mdxContent.matchAll(regexp)];
  let tableOfContents: TableOfContents = [];

  if (headings.length) {
    let lastParentHeading: ToCItem;
    headings.forEach((heading) => {
      const headingText = heading[2].trim();
      const headingType = heading[1].trim() === '##' ? 'h2' : 'h3';
      const headingLink = slugger.slug(headingText, false);

      const headingItem: ToCItem = {
        text: headingText,
        id: headingLink,
        level: headingType,
        subItems: [],
      };

      if (headingType === 'h2') {
        tableOfContents.push(headingItem);
        lastParentHeading = headingItem;
      } else {
        lastParentHeading.subItems.push(headingItem);
      }
    });
  }

  return tableOfContents;
}
