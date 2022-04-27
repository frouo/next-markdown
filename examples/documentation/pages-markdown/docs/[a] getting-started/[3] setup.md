---
title: 'Setup'
---

# Setup

## Create a [...nextmd].jsx

In pages/, create a `[...nextmd].jsx` file and paste this code:

```js
import NextMarkdown from 'next-markdown';

const nextmd = NextMarkdown({ pathToContent: './pages-markdown' });

export const getStaticPaths = nextmd.getStaticPaths;
export const getStaticProps = nextmd.getStaticProps;

export default function MarkdownPage({ frontMatter, html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />; // 👈 design your own layout 🧑‍🎨
}
```

## Create a folder for your markdown files

Create a folder called `pages-markdown` at the root of your nextjs project.

> Note: we chose to call it `pages-markdown` but it can be anything. If so, update the `pathToContent` in the nextmarkdown init.

## Start writing

Create this `helloworld.md` file in `pages-markdown/`

```md
# Welcome

Enjoy using `next-markdown`.
```

## See the magic

Run nextjs as you usually do.

Open [http://localhost:3000/helloworld](http://localhost:3000/helloworld) 🎉
