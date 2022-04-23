<p align="center">
   <br/>
   <img width="150px" src="./logo.png" />
   <h3 align="center">next-markdown</h3>
   <p align="center">Markdown Pages for Next.js</p>
   <p align="center">
   Dynamic Routes. Blog Aware. Design Your Layout
   </p>
   <p align="center" style="align: center;">
      <a href="https://www.npmtrends.com/next-markdown">
        <img src="https://img.shields.io/npm/dm/next-markdown" alt="Downloads" />
      </a>
      <a href="https://github.com/frouo/next-markdown/stargazers">
        <img src="https://img.shields.io/github/stars/frouo/next-markdown" alt="Github Stars" />
      </a>
      <a href="https://www.npmjs.com/package/next-markdown">
        <img alt="npm (tag)" src="https://img.shields.io/npm/v/next-markdown/latest">
      </a>
   </p>
</p>

Made for people

- having a [nextjs](https://nextjs.org/) project
- in ❤️ with markdown
- who want to generate boring (but very necessary!) pages like `/about`, `/terms`, `/blog` or `/whatever/other/route` from markdown files with 0 effort (eg. `about.md`, `whatever/other/route.md`)
- (optional) who want these `.md` files to be hosted on a separate git repo

Currently in use in

- **lembot.com** : all pages except the home page are generated from md files hosted on [github.com/frouo/lembot-public-website](https://github.com/frouo/lembot-public-website)
- create a PR to add your website or Twitter DM

<img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/nextmarkdown?style=social">

## Get Started ✨

In your nextjs project, run

```bash
npm install next-markdown
```

Add the following `[...nextmd].jsx` file in the `pages/` folder

```nodejs
import NextMarkdown from "next-markdown";

const nextmd = NextMarkdown({ pathToContent: "./pages-markdown" });

export const getStaticPaths = nextmd.getStaticPaths;
export const getStaticProps = nextmd.getStaticProps;

export default function MarkdownPage({ frontMatter, html, files }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} /> 👈 design your own layout 🧑‍🎨
}
```

## Usage 👋

At the root of your project create a folder `pages-markdown/`, add the following `hello.md` file

```
# Hello World

This is **awesome**
```

That's it. Open `http://localhost:3000/hello` page and see the magic.

Enjoy.

![nextmd demo](https://user-images.githubusercontent.com/2499356/157421649-6be78442-400c-43cd-81e5-27ba6da1ee7b.png)

## Features 🚀

### Dynamic Routes for Markdown Files

Just like nextjs does with `pages/`.

`next-markdown` generates paths based on the path of your markdown files.

For example, the following project structure will result into creating the following pages:

```
pages/
├ index.jsx    ......... ➡️ /
├ caveat.jsx   ......... ➡️ /caveat
├ [...nextmd].jsx

pages-markdown/
├ about.md     ......... ➡️ /about
├ caveat.md    ......... ➡️ ❌ because `pages/caveat.jsx` takes precedence over [...nextmd] cf. https://nextjs.org/docs/routing/dynamic-routes#caveats
├ hello/
  ├ index.md   ......... ➡️ /hello
  ├ world.md   ......... ➡️ /hello/world
  ├ jurassic/
    ├ park.md  ......... ➡️ /hello/jurassic/park
├ blog/
  ├ index.md   ......... ➡️ /blog with `props.files` all the files within its directory
  ├ hello.md   ......... ➡️ /blog/hello
  ├ world.md   ......... ➡️ /blog/world
├ docs/
  ├ index.md   ......... ➡️ /docs with `props.files` all the files within its directory
  ├ get-started.md   ... ➡️ /docs/get-started
  ├ features.md   ...... ➡️ /docs/features
  ├ contribute.md   .... ➡️ /docs/contribute
```

See the [example](./examples/dynamic-routes/).

### Blog Aware

`next-markdown` is blog-aware, docs-aware, etc.:

- list all files
- easy to calculate the estimated reading time
- write draft or unpublish a post by simply prefixing the file name with `_` (underscore, eg. `_draft.md`)
- etc.

See the [example](./examples/blogging/).

### Table of Contents

For each page you'll receive the Table of Contents based on headings in your markdown.

See the [example](./examples/blogging/).

### MDX Support

You can mix `.md` and `.mdx` files.

See the [example](./examples/mdx/).

### Configure custom remark and rehype plugins

`next-markdown` comes with some default remark and rehype plugins to ensure its basic functionality.

In some cases you might want to specify additional plugins to enrich your page with extra features.

You can pass custom remark and rehype plugins via the `next-markdown` initializer config:

```nodejs
import NextMarkdown from "next-markdown";

const nextmd = NextMarkdown({
  ...,
  remarkPlugins: [],
  rehypePlugins: [],
});
```

See the [example](./examples/custom-remark-rehype-plugins/).

### Host Your .md Files in Another Repo

For many good reasons you may want to host your content in another GIT repo.

See the [example](./examples/remote-content/).

### Caveat

By default, `next-markdown` ignores `README.md` files and files whose name starts with an underscore (eg. `_draft.md`).

This can be overriden by implementing the `include` function in the config object.

## Examples 🖥

Feel free to browse the [examples](./examples) to see `next-markdown` in action.

## Contributing 🏗️

> Thanks for your interest in next-markdown! You are very welcome to contribute. If you are proposing a new feature, please [open an issue](https://github.com/frouo/next-markdown/issues/new) to make sure it is inline with the project goals.

#### 1. Fork this repository to your own GitHub account and clone it to your local device

```bash
git clone https://github.com/your-name/next-markdown.git
cd next-markdown
```

#### 2. Install the dependencies and run dev script

```bash
npm install
npm run dev
```

![terminal 1](https://user-images.githubusercontent.com/2499356/160489894-5eb85a94-0a03-4c73-bfef-eb68c030f865.jpg)

#### 3. Open **another terminal**, pick an example in the `examples/` folder, install dependencies and run dev

```bash
cd examples/blogging # or dynamic-routes, or remote-content
npm install
npm run dev
```

![terminal 2](https://user-images.githubusercontent.com/2499356/160492988-1dc83947-1a74-46ba-aee8-4f66ecc70ed2.jpg)

#### 4. Start coding

- edit files in `src/`, save: http://localhost:3000 gets updated automatically (aka **hot-reloading**)
- add tests in `src/__tests__/`. Run tests with `npm test` command.

![browser](https://user-images.githubusercontent.com/2499356/160491479-39b47264-5aec-4185-b472-f209d8a45181.jpg)

#### 5. Submitting a PR

Before you make your pull request, make sure to run:

- `npm test` to make sure nothing is broken
- `npm run format` to make sure the code looks consistent
- `npm run lint` to make sure there is no problem in the code

## Contributors 🙏

<a href="https://github.com/frouo/next-markdown/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=frouo/next-markdown" />
</a>
