# MDX

`next-markdown` supports MDX out of the box.

![mdx demo](https://user-images.githubusercontent.com/2499356/161804291-e9d917af-d47f-410c-a988-e925e9328107.gif)

## Get Started

Here is how to enable MDX in your project.

### Step 1

Install both `next-markdown` and `next-mdx-remote` package.

```bash
npm install next-markdown
```

### Step 2

Use `<MDXRemote />` component to render the given `mdxSource` props

```typescript
# [...nextmd.tsx]

import Head from 'next/head';
import NextMarkdown, { NextMarkdownProps } from 'next-markdown';
import { MDXRemote } from 'next-mdx-remote';
import Button from '../components/button';

const nextmd = NextMarkdown({
  pathToContent: './pages-markdown',
});

export const getStaticProps = nextmd.getStaticProps;
export const getStaticPaths = nextmd.getStaticPaths;

type FrontMatter = { title: string }

export default function MyMarkdownPage(props: NextMarkdownProps<FrontMatter>) {
  const { frontMatter, mdxSource } = props;

  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
      </Head>
      {mdxSource && <MDXRemote {...mdxSource} components={{ Button }} />}
    </>
  );
}
```

> `<MDXRemote />` is imported from `next-mdx-remote` <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/hashicorp/next-mdx-remote?style=social">. Next.js recommands this package in their markdown [blog post](https://nextjs.org/blog/markdown). This package is made by hashicorp, it allows loading mdx content from anywhere through `getStaticProps` in next.js. Thank you for their work.

> Note, you don't need to install `next-mdx-remote` package. It is a `next-markdown` dependency.

See the [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) documentation for more examples.

## How It Works

You can mix MD and MDX files.

When `next-markdown` finds a `.md` file, it transforms the markdown into HTML and provides the plain text HTML in `const { html } = props`. In order to render plain text html you can use `<div dangerouslySetInnerHTML={{ __html: html }} />`. In this scenario `mdxSource` is `null`.

When `next-markdown` finds a `.mdx` file, it serializes (using `next-mdx-remote`) the markdown and provides the result in `const { mdxSource } = props`. In order to render the mdx source, you must use the `<MDXRemote />` component provided by `next-mdx-remote`. In this scenario `html` is `null`.

## Demo

Here is how to run this demo

```
git clone https://github.com/frouo/next-markdown.git

cd next-markdown
npm install
npm run build

cd examples/mdx/
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
