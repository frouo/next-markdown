# Blog

`next-markdown` is blog-aware.

`next-markdown` automatically lists all files in /a-folder in `props` when _/a-folder/index.md_ is rendered.

Example:

```
├ blog/
  ├ index.md   .................. ➡️ http://localhost:3000/blog
  ├ hello.md   .................. ➡️ http://localhost:3000/blog/hello
  ├ world.md   .................. ➡️ http://localhost:3000/blog/world
```

When rendering `index.md` (`/blog` route), `next-markdown` creates the following props:

```js
props: {
  nextmd: ["blog"],
  html: ...,
  frontMatter: { ... },
  subPaths: [
    {
      nextmd: ["blog", "hello"],
      frontMatter: { ... },
      html: ...
    }, {
      nextmd: ["blog", "world"],
      frontMatter: { ... },
      html: ...
    }
  ]
}
```

## Create Drafts, Publish or Unpublish

By default `next-markdown` will create a path for every files found, **unless** the file name starts with an underscore `_`, eg: `_draft.md`.

This simple next-markdown rule gives you the flexibility to simply create drafts, or (un)publish a route.

Example:

```
├ _about.md   ................... ➡️ ❌ 404, because file name starts with "_"
├ blog/
  ├ index.md   .................. ➡️ /blog
  ├ hello.md   .................. ➡️ /blog/hello
  ├ _draft.md   ................. ➡️ ❌ 404, because file name starts with "_"
├ _sandbox/
  ├ hello.md   .................. ➡️ ❌ 404, because the folder "_sandbox" starts with an "_"
  ├ world.md   .................. ➡️ ❌ 404, because the folder "_sandbox" starts with an "_"
```

## Exclude md/mdx files

By default next-markdown will parse every `md` and `mdx` files found excluding `README.md`.

Example:

```javascript
{
  filterFile: (file: File, frontMatter: MyFrontMatter) => frontMatter.publish === true;
  // 👆 warning, in this example, only files which front matter includes the `publish: true` statement will be rendered.
}
```

## Files Classification

You might want to classify your files in your directory.

For that reason, `next-markdown` automatically ignores the first occurence of "`[text] `" in the markdown file name when creating its path.

Example:

```
├ docs/
  ├ index.md   .................. ➡️ /docs
  ├ [doc-1] get-started.md   .... ➡️ /docs/get-started
  ├ [doc-2] features.md   ....... ➡️ /docs/features
  ├ [doc-3] contribute.md   ..... ➡️ /docs/contribute
  ├ [doc-4] _draft.md   ......... ➡️ ❌ 404, because file name starts with "_" (after `[...] `)
├ [legal] terms.md   ............ ➡️ /terms
├ [legal] privacy.md   .......... ➡️ /privacy
├ about.md   .................... ➡️ /about
```

When rendering `index.md` (= `/docs` route), next-markdown creates the following props:

```js
props: {
  nextmd: ["docs"],
  html: ...,
  frontMatter: { ... },
  subPaths: [
    {
      nextmd: ["docs", "get-started"],
      frontMatter: { ... },
      html: ...
    }, {
      nextmd: ["docs", "features"],
      frontMatter: { ... },
      html: ...
    }, {
      nextmd: ["docs", "contribute"],
      frontMatter: { ... },
      html: ...
    }
  ]
}
```

## Demo

```shell
git clone https://github.com/frouo/next-markdown.git

cd next-markdown
npm install
npm run build

cd examples/blog/
npm install
npm run dev
```

open [http://localhost:3000](http://localhost:3000)
