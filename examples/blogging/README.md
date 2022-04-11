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

## Ignored Files

By default `next-markdown` ignores:

- files whose name starts with an underscore `_`, eg: `_draft.md`
- `README.md` files

```
├ blog/
  ├ index.md   .................. ➡️ /blog
  ├ _draft.md  .................. ➡️ ❌ because file name starts with "_"
```

This behavior can be overriden by defining your own `include` in the initializer. For example:

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
