---
title: 'About'
---

# About

## Rehype

Inspect and check that "👋" emoji is wrapped inside a `<span/>` element, thanks to [rehype-accessible-emojis](https://github.com/GaiAma/Coding4GaiAma/tree/HEAD/packages/rehype-accessible-emojis).

## Remark

We used [remark-prism](https://github.com/sergioramos/remark-prism) to highlight the following code:

```bash
npm install remark-prism
npm install rehype-accessible-emojis
```

```typescript
import remarkPrism from 'remark-prism';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';

const nextmd = NextMarkdown({
  ...,
  remarkPlugins: [remarkPrism],
  rehypePlugins: [rehypeAccessibleEmojis],
});
```
