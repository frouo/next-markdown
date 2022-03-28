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
export const extractDataFromAlt = (alt: string) => {
  try {
    return JSON.parse(alt) as { [key: string]: any };
  } catch (error) {
    return alt;
  }
};