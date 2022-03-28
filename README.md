# next-markdown

Made for people

- having a [nextjs](https://nextjs.org/) project
- in ❤️ with markdown
- who want to generate boring (but very necessary!) pages like `/about`, `/terms`, `/blog` or `/whatever/other/route` from markdown files with 0 effort (eg. `about.md`, `whatever/other/route.md`)
- (optional) who want these `.md` files to be hosted on a separate git repo

Currently in use in

- **lembot.com** : all pages except the home page are generated from md files hosted on [github.com/frouo/lembot-public-website](https://github.com/frouo/lembot-public-website) using `next-markdown`
- create a PR to add your website or [DM](https://twitter.com/frouo)

## Get Started ✨

In your nextjs project, run

```bash
npm install next-markdown
```

Add the following `[...nextmd].jsx` file in the `pages/` folder

```nodejs
import NextMd from "next-markdown";

const nextmd = NextMd({
  pathToContent: "./pages-markdown"
  // (optional) if your content is hosted elsewhere, you can define where using `contentGitRepo`
  // Note that you'd probably change your pathToContent to "./"
  // contentGitRepo: { remoteUrl: "https://path.to/your/content.git", branch: "main" }
});

export const getStaticPaths = nextmd.getStaticPaths;
export const getStaticProps = nextmd.getStaticProps;

export default function MarkdownPage({ frontMatter, html, posts }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} /> 👈 design your own layout 🧑‍🎨
}
```

That's it 🎉

At the root of your project create a folder `pages-markdown/`, add a `hello.md` file

```
# Hello

World 👋
```

You now have a `http://localhost:3000/hello` page.

Enjoy.

## Features 🚀

### Dynamic Routes for Markdown Files

Just like nextjs does with `pages/`.

`next-markdown` generates paths based on the path of your markdown files.

For example, the following project structure will result into creating the following pages:

```
pages/
├ index.jsx    .................. ➡️ /
├ caveat.jsx   .................. ➡️ /caveat
├ [...nextmd].jsx

pages-markdown/
├ about.md     .................. ➡️ /about
├ caveat.md    .................. ➡️ ❌ because `pages/caveat.jsx` takes precedence over [...nextmd] cf. https://nextjs.org/docs/routing/dynamic-routes#caveats
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

### Blog Aware

`next-markdown` is blog-aware.

All files whose name starts with `YYYY-MM-DD` are passed to the `index.md` in `props.posts`. See examples.

### Caveat

By default, `next-markdown` ignores `README.md` files and files whose name starts with an underscore (eg. `_draft.md`).

This can be overriden by overriding the `include` function in the config object.

## Examples 🖥

Feel free to browse the [examples](./examples) to see `next-markdown` in action.

### Screenshot

![nextmd demo](https://user-images.githubusercontent.com/2499356/157421649-6be78442-400c-43cd-81e5-27ba6da1ee7b.png)

## Dev environment ⚙️

> A few heads up if you are planning on contributing to next-markdown.

#### Examples

The examples provided in the `examples` folder are all linked to the next-markdown `dist` folder through a relative file path resolution in their `package.json` (see later why). To ensure the examples are working correctly make sure to build the library before :

```bash
npm run build
cd examples/blogging #|dynamic-routes|remote-content
npm install
npm run dev
```

#### Live testing

When working on next-markdown, you may want to live-test your changes on the example next apps, to do so, simply run :

```bash
# tsc watch
npm run dev # will watch src/**/*.ts

# in another terminal tab - start the example
cd examples/blogging #|dynamic-routes|remote-content
npm run dev
```

#### Testing

Running the jest test suite :

```bash
npm run test
```
