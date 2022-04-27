# Remote Content

`next-markdown` is able to pull your markdown files from another git repository.

For that, set the `contentGitRepo` param in the `next-markdown` initializer where you can specify:

- `remoteUrl`: the git remote URL, eg. _https://github.com/name/project.git_
- `branch`: the branch, eg. _main_

> Remember that _pathToContent_ will be relative to the root of the git repo.

```
const nextmd = NextMarkdown({
  pathToContent: "./",
  contentGitRepo: {
    remoteUrl: "https://github.com/name/project.git",
    branch: "main"
  }
});
```

## Why would you do that?

- to separate your content from your app
- to avoid tons of commits like `Update about.md` or `Update 2021-07-15-keep-your-project-minimalist.md`, etc. in your app git
- and maybe a lot more reasons (opened for suggestions 🙂)

## How To Run This Demo

```
git clone https://github.com/frouo/next-markdown.git

cd next-markdown
npm install
npm run build

cd examples/remote-content/
npm install
npm run dev
```

open [http://localhost:3000](http://localhost:3000)
