# Remote Content

Optionally `next-markdown` is able to pull your markdown files from another git repository.

This way, the next time you deploy your app `next-markdown` will generate your static page from the `remoteUrl` and `branch` you provided in NextMd setup.

Why would you do that?

- to separate your content from your app
- to avoid tons of commits like `Update about.md` or `Update 2021-07-15-keep-your-project-minimalist.md`, etc. in your app git
- and maybe a lot more reasons (I am open to suggestion 🙂)

## Run Demo

```
git clone https://github.com/frouo/next-markdown.git
cd examples/remote-content/
npm install
npm run dev
```

open [http://localhost:3000](http://localhost:3000)
