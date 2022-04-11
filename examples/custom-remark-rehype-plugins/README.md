# Custom remark and rehype Plugins

`next-markdown` comes with some default remark and rehype plugins to ensure its basic functionality.

In some cases you might want to specify additional plugins to enrich your page with extra features.

## How

You can pass custom remark and rehype plugins via the `next-markdown` initializer config.

```nodejs
import NextMarkdown from "next-markdown";

const nextmd = NextMarkdown({
  pathToContent: "./pages-markdown",
  remarkPlugins: [],
  rehypePlugins: [],
});
```

## Example

```bash
npm install remark-prism
npm install rehype-accessible-emojis
```

```nodejs
import NextMarkdown from "next-markdown";
import remarkPrism from 'remark-prism';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';

const nextmd = NextMarkdown({
  pathToContent: "./pages-markdown",
  remarkPlugins: [remarkPrism],
  rehypePlugins: [rehypeAccessibleEmojis],
});
```

![rehype remark plugins](https://user-images.githubusercontent.com/2499356/162773438-327c9053-41cd-44fb-9c0d-2cff21ad6d4c.jpg)

## Demo

Here is how to run this demo

```
git clone https://github.com/frouo/next-markdown.git

cd next-markdown
npm install
npm run build

cd examples/custom-remark-rehype-plugins/
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
