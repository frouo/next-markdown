# Blogging

`next-markdown` is blog aware.

## One Simple Rule

In a folder, all files that start with `YYYY-MM-DD` are passed as `props` to the `index.md` rendered page.

## Example

```
├ blog/
  ├ index.md   .................. ➡️ /blog
  ├ 2022-01-01-hello-world.md  .. ➡️ /blog/hello-world
  ├ 2022-02-02-my-thoughts.md  .. ➡️ /blog/my-thoughts
```

Taking the above example, `index.md` rendered page `props` is like:

```
props: {
    slug: "blog";
    parentRoute: "/";
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

If no file is found, `props.posts` is `null`.

Note that in this example, we named the folder `blog/` but it can been named to whatever you please, the route will match your folder name. We could have used `posts/` for example.

## Dynamic Routes Still Work

Dynamic routes continue to work as normal:

- Create a file `blog/top-rated.md` to generate `/blog/top-rated`
- Create a file `about.md` to generate `/about`
- etc...
