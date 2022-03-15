# Blogging

`next-markdown` is blog aware.

## One Simple Rule

In a folder, all files that start with `YYYY-MM-DD` are passed as `props` to the `index.md` rendered page.

Want to write drafts?

By default `next-markdown` ignores `README.md` files and files whose name starts with an underscore (eg. `_YYYY-MM-DD-draft.md` or `_not-ready.md`). This behavior can be overriden by defining your own `include` in the nextmd initializer. For example:

```
{
  include: (file, frontMatter) => file.name !== "README.md" && frontMatter.publish === true
  // 👆 warning, with this example, ALL your md files must now have a boolean `publish` in its front matter.
}
```

## Example

```
├ blog/
  ├ index.md   .................. ➡️ /blog
  ├ _1970-01-01-draft.md  ....... ➡️ ❌ because file name starts with "_"
  ├ 2022-01-01-hello-world.md  .. ➡️ /blog/hello-world
  ├ 2022-02-02-my-thoughts.md  .. ➡️ /blog/my-thoughts
```

Taking the above example, `index.md` will receive the `props`:

```
props: {
    slug: "blog";
    html: "...";
    frontMatter: { ... };
    posts: [
      {
        slug: "hello-world";
        date: "2022-01-01";
        frontMatter: { ... };
        html: "...";
      }, {
        slug: "my-thoughts";
        date: "2022-02-02";
        frontMatter: { ... };
        html: "...";
      }
    ]
}
```

Note:

- if no file is found, `props.posts` is `null`.
- in this example, we named the folder `blog/` but it can been named to whatever you please, the route will match your folder name. We could have used `posts/` for example.

## Dynamic Routes Still Work

Dynamic routes continue to work as normal:

- Create a file `blog/top-rated.md` to generate `/blog/top-rated`
- Create a file `about.md` to generate `/about`
- etc...

## How To Run This Demo

```
git clone https://github.com/frouo/next-markdown.git
cd examples/blogging/
npm install
npm run dev
```

open [http://localhost:3000](http://localhost:3000)
