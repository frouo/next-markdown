---
title: 'Blog | Draft'
author: 'frouo'
date: '2022-05-07'
---

# A draft

`next-markdown` won't create the path for this page.

That's because the file name starts with an underscore.

Indeed, by default, `next-markdown` ignores files whose name is `README.md` or starts with an underscore (`_`).

You can override this behavior by defining your own `include: (file, frontMatter, html) => boolean` function.
