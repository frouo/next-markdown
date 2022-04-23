# Blogging

`next-markdown` is blog-aware. Or docs-aware.

## All Files Listed

`next-markdown` will automatically list all the files in a directory in the props `files` when `index.md` is rendered.

### Example

```
├ blog/
  ├ index.md   .................. ➡️ /blog
  ├ hello.md   .................. ➡️ /blog/hello
  ├ world.md   .................. ➡️ /blog/world
```

When rendering `index.md`, next-markdown will create and pass the following props (`/blog` route):

```json
props: {
  nextmd: ["blog"],
  html: ...,
  frontMatter: { ... },
  files: [
    {
      nextmd: ["blog", "hello"],
      frontMatter: { ... },
      html: ...
    }, {
      nextmd: ["blog", "world",
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


```javascript
{
  include: (file, frontMatter) => file.name !== 'README.md' && frontMatter.publish === true;
  // 👆 warning, with this example, ALL your md files must now have a boolean `publish` in its front matter.
}
```

## Files Classification

You might want to classify your files in your directory.

For that reason, `next-markdown` automatically ignores the first occurence of "`[text] `" in the markdown file name when creating its path.

### Example

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

When rendering `index.md`, next-markdown will create and pass the following props (`/docs` route):

```json
props: {
  nextmd: ["docs"],
  html: ...,
  frontMatter: { ... },
  files: [
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

cd examples/blogging/
npm install
npm run dev
```

open [http://localhost:3000](http://localhost:3000)
