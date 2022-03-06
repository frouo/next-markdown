# next-markdown

Made for [Nextjs](https://nextjs.org/) website.

Currently live on [lembot.com](https://lembot.com).

Lembot home page is 100% custom made with nextjs. **All** other pages are generated from [github.com/frouo/lembot-public-website](https://github.com/frouo/lembot-public-website) using `next-markdown`.

## Get started

Create a `[...nextmd].tsx` (or `.jsx`) in the `pages/` folder.

And paste the following lines

```nodejs
import NextMd from "next-markdown";

const nextmd = NextMd({
  pathToLocalRepoInDevelopmentMode: "../lembot-public-website",
  remoteRepo: "https://github.com/frouo/lembot-public-website.git",
});

export const getStaticPaths = nextmd.getStaticPaths;
export const getStaticProps = nextmd.getStaticProps;

export default function MarkdownPage({ frontMatter, html, posts, parentRoute }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

As a result, the following repo will result into creating the following pages:

```
- terms.md     .................. ➡️ https://yoursite.com/terms
- privacy.md   .................. ➡️ https://yoursite.com/privacy
- hello/
  - index.md   .................. ➡️ https://yoursite.com/hello
  - world.md   .................. ➡️ https://yoursite.com/hello/world
- my-blog/
  - index.md   .................. ➡️ https://yoursite.com/my-blog (with all the posts below as an array in `props.posts`)
  - 2022-01-01-nextmd-is-great.md ➡️ https://yoursite.com/my-blog/nextmd-is-great
  - 2022-02-02-my-thoughts.md  .. ➡️ https://yoursite.com/my-blog/my-thoughts
```
