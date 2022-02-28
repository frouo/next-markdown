// @ts-nocheck

import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

export function rehypeVideos(): (tree: Root) => void {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img' && node.properties && typeof node.properties.src === 'string') {
        const url = node.properties.src;

        if (url.includes('.mov') || url.includes('mp4')) {
          const altData = extractDataFromAlt(node.properties.alt);

          node.tagName = 'video';
          node.properties.width = '100%';
          node.properties.controls = true;

          if (typeof altData === 'string') {
            node.properties.alt = altData;
          } else {
            Object.entries(altData).forEach(([key, value]) => {
              node.properties[key] = value;
            });
          }
        }
      }
    });
  };
}

/**
 * If the alt is a JSON, the JSON key/value will be transfered to `node.properties`.
 *
 * For example, this markdown:
 *
 * ```md
 * ![{"alt":"20211029 - edit bot demo","poster":"https://frouo.com/poster.jpg"}](https://frouo.com/video.mp4)
 * ```
 *
 * will generate:
 *
 * ```html
 * <video src="https://frouo.com/video.mp4" alt="20211029 - edit bot demo" width="100%" controls poster="https://frouo.com/poster.jpg"></video>
 * ```
 */
function extractDataFromAlt(alt: string) {
  try {
    return JSON.parse(alt) as { [key: string]: any };
  } catch (error) {
    return alt;
  }
}
