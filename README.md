# next-markdown

Made for [Nextjs](https://nextjs.org/) website.

Currently live on [lembot.com](https://lembot.com).

Lembot home page is 100% custom made with nextjs. **All** other pages are generated from [github.com/frouo/lembot-public-website](https://github.com/frouo/lembot-public-website) using `next-markdown`.

## Get started

```bash
npm install next-markdown
```

Add the following `[...nextmd].jsx` file in the `pages/` folder

```nodejs
// file: pages/[...nextmd].jsx

import NextMd from "next-markdown";

const nextmd = NextMd({
  pathToContent: "./pages-markdown"
});

// if your content is hosted in another git repo

export const getStaticPaths = nextmd.getStaticPaths;
export const getStaticProps = nextmd.getStaticProps;

export default function MarkdownPage({ frontMatter, html, posts, parentRoute }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

Then, the following content tree will result into creating the following pages:

```
pages/
├ index.jsx    .................. ➡️ /
├ caveat.jsx   .................. ➡️ /caveat

pages-markdown/
├ about.md     .................. ➡️ /about
├ caveat.md    .................. ➡️ ❌ because caveat.jsx is already defined in pages/
├ hello/
  ├ index.md   .................. ➡️ /hello
  ├ world.md   .................. ➡️ /hello/world
  ├ jurassic/
    ├ park.md  .................. ➡️ /hello/jurassic/park
├ my-blog/
  ├ index.md   .................. ➡️ /my-blog with `props.posts` all the files in that director starting with YYYY-MM-DD
  ├ 2022-01-01-hello-world.md  .. ➡️ /my-blog/hello-world
  ├ 2022-02-02-my-thoughts.md  .. ➡️ /my-blog/my-thoughts
```

![nextmd demo](https://user-images.githubusercontent.com/2499356/157421649-6be78442-400c-43cd-81e5-27ba6da1ee7b.png)

## Nextjs dynamic routes caveats

`caveat.md` will generate `/caveat` **unless** you have created a `caveat.tsx` in `pages/`.

Indeed, this is how nextjs dynamic routes works, cf. [nextjs dynamic routes caveats](https://nextjs.org/docs/routing/dynamic-routes#caveats).

> Predefined routes take precedence over dynamic routes, and dynamic routes over catch all routes. Take a look at the following examples:
> 
> - `pages/post/create.js` - Will match `/post/create`
> 
> - `pages/post/[pid].js` - Will match `/post/1`, `/post/abc`, etc. But not `/post/create`
> 
> - `pages/post/[...slug].js` - Will match `/post/1/2`, `/post/a/b/c`, etc. But not `/post/create`.
