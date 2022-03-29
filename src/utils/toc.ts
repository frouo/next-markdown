import slugger from 'github-slugger';
import { TableOfContentItem, TableOfContents } from '../types';

export function getTableOfContents(mdContent: string) {
  const regexp = new RegExp(/^(###### |##### |#### |### |## |# )(.*)\n/, 'gm');
  const headings = [...mdContent.matchAll(regexp)];
  const headingLevelMap = new Map<number, TableOfContentItem[]>();
  const tableOfContents: TableOfContents = [];

  if (headings.length) {
    let currentItem: TableOfContentItem;
    headings.forEach((heading) => {
      const headingText = heading[2].trim();
      const headingLevel = heading[1].trim().length;
      const headingId = slugger.slug(headingText, false);

      const tocItem: TableOfContentItem = {
        text: headingText,
        id: headingId,
        level: headingLevel,
        subItems: [],
      };

      if (!headingLevelMap.has(headingLevel)) {
        headingLevelMap.set(headingLevel, []);
      }
      headingLevelMap.get(headingLevel)!.push(tocItem);

      if (currentItem && currentItem.level < tocItem.level) {
        // the level is higher than the current item, so we need to add it to the current item's subItems
        currentItem.subItems.push(tocItem);
      } else {
        // the level is lower or equal the the current one, we need to find the nearest upper heading

        for (let i = headingLevel - 1; i >= 0; i--) {
          if (i === 0) {
            // no upper heading found, push it to the root of the ToC
            tableOfContents.push(tocItem);
            break;
          } else {
            const headingLevels = headingLevelMap.get(i);
            if (headingLevels) {
              const lastLevelIndex = headingLevels.length - 1;
              headingLevels[lastLevelIndex].subItems.push(tocItem);
              break;
            }
          }
        }
      }

      currentItem = tocItem;
    });
  }

  return tableOfContents;
}
