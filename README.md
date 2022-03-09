# next-markdown

Made for people:
- having a [nextjs](https://nextjs.org/) project
- in ❤️ with markdown
- who want to generate boring (but very necessary!) pages like `/about`, `/terms`, `/blog` or `/whatever/other/route` from markdown files with 0 effort (eg. `about.md`, `whatever/other/route.md`)
- (optional) who want these `.md` files to be hosted on a separate git repo

Currently in use in:
- lembot.com: all pages except the home page are generated from md files hosted on [github.com/frouo/lembot-public-website](https://github.com/frouo/lembot-public-website) using `next-markdown`

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
  // (optional) if your content is hosted elsewhere, you can define where using `contentGitRepo`
  // Note that you'd probably change your pathToContent to "./"
  // contentGitRepo: { remoteUrl: "https://path.to/your/content.git", branch: "main" }
});

export const getStaticPaths = nextmd.getStaticPaths;
export const getStaticProps = nextmd.getStaticProps;

export default function MarkdownPage({ frontMatter, html, posts, parentRoute }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

That's it 🎉

As a result, the following nextjs project will result into creating the following pages:

```
pages/
├ index.jsx    .................. ➡️ /
├ caveat.jsx   .................. ➡️ /caveat
├ [...nextmd].jsx

pages-markdown/
├ about.md     .................. ➡️ /about
├ caveat.md    .................. ➡️ ❌ because /caveat already exists though caveat.jsx up there, cf. https://nextjs.org/docs/routing/dynamic-routes#caveats
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

## Demo

![nextmd demo](https://user-images.githubusercontent.com/2499356/157421649-6be78442-400c-43cd-81e5-27ba6da1ee7b.png)
