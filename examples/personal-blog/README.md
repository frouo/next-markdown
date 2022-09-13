# Personal Blog

`next-markdown` lets you create a personal blog, with only 1 tsx/jsx file: `[[nextmd]].tsx` and markdown files.

This example demonstrate that `next-markdown` is flexible enough to list all blog post in your website home page.

## Custom home page

Create a file `pages/index.tsx` and code your home page.

Use `next-markdown` to list all your posts in your home page without effort.

I have done this for my personal blog [frouo.com](https://frouo.com). See how here [pages/index.tsx#L24](https://github.com/frouo/blog/blob/master/pages/index.tsx#L24).

## Or, home page generated from a markdown file

To let next-markdown generate your home page, we need to enable "optional catch all routes" (see the nextjs documentation [here](https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes)).

To do so, create a file `[[nextmd]].js` (note the double brackets).

You probably want to list your blog posts in the home page. For that you need to reshape a little your `getStaticProps`.

See how in the `pages/[[nextmd]].tsx` file of this demo. To run the demo:

```shell
git clone https://github.com/frouo/next-markdown.git

cd next-markdown
npm install
npm run build

cd examples/personal-blog/
npm install
npm run dev
```

open [http://localhost:3000](http://localhost:3000)
