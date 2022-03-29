# next-markdown

Made for people

- having a [nextjs](https://nextjs.org/) project
- in ❤️ with markdown
- who want to generate boring (but very necessary!) pages like `/about`, `/terms`, `/blog` or `/whatever/other/route` from markdown files with 0 effort (eg. `about.md`, `whatever/other/route.md`)
- (optional) who want these `.md` files to be hosted on a separate git repo

Currently in use in

- **lembot.com** : all pages except the home page are generated from md files hosted on [github.com/frouo/lembot-public-website](https://github.com/frouo/lembot-public-website)
- create a PR to add your website or Twitter DM

Follow [@nextmarkdown](https://twitter.com/nextmarkdown) on Twitter for updates.

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

export default function MarkdownPage({ frontMatter, html, posts }) {
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

See the [example](./examples/dynamic-routes/).

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

The rule is simple: all files whose name starts with `YYYY-MM-DD` are passed to the `index.md` in `props.posts`.

See the [example](./examples/blogging/).

### Fetch your .md files from another repo

For many good reasons you probably want to host your content in another Git repo.

For that, use the `contentGitRepo` param. Remember that _pathToContent_ is relative to provided git repo.

See the [example](./examples/remote-content/).

```
const nextmd = NextMarkdown({
  pathToContent: "./",
  contentGitRepo: {
    remoteUrl: "https://path.to/your/content.git",
    branch: "main"
  }
});
```

### Caveat

By default, `next-markdown` ignores `README.md` files and files whose name starts with an underscore (eg. `_draft.md`).

This can be overriden by implementing the `include` function in the config object.

## Examples 🖥

Feel free to browse the [examples](./examples) to see `next-markdown` in action.

## Contributing 🏗️

> Thanks for your interest in next-markdown! You are very welcome to contribute. If you are proposing a new feature, please [open an issue](https://github.com/frouo/next-markdown/issues/new) to make sure it is inline with the project goals.

### 1. Fork this repository to your own GitHub account and clone it to your local device

```bash
git clone https://github.com/your-name/next-markdown.git
cd next-markdown
```

### 2. Install the dependencies and run dev script

```bash
npm install
npm run dev
```

![terminal 1](https://user-images.githubusercontent.com/2499356/160489894-5eb85a94-0a03-4c73-bfef-eb68c030f865.jpg)

### 3. Open **another terminal**, pick an example in the `examples/` folder, install dependencies and run dev

```bash
cd examples/blogging # or dynamic-routes, or remote-content
npm install
npm run dev
```

![terminal 2](https://user-images.githubusercontent.com/2499356/160492988-1dc83947-1a74-46ba-aee8-4f66ecc70ed2.jpg)

### 4. Start coding

- edit files in `src/`, save: http://localhost:3000 gets updated automatically (aka **hot-reloading**)
- add tests in `src/__tests__/`. Run tests with `npm test` command.

![browser](https://user-images.githubusercontent.com/2499356/160491479-39b47264-5aec-4185-b472-f209d8a45181.jpg)

### 5. Submitting a PR

Before you make your pull request, make sure to run:

- `npm test` to make sure nothing is broken
- `npm run format` to make sure the code looks consistent
- `npm run lint` to make sure there is no problem in the code
