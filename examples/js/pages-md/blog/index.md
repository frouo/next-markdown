---
title: 'Blog'
---

You won't see this text because of `!equals(nextmd, ['blog'])` (in `{html && !equals(nextmd, ['blog']) && <div dangerouslySetInnerHTML={{ __html: html }} />}`) in `[[...nextmd]].jsx`.

This is purely arbitrary. In this example I don't want to render things from this markdown, I just want to list all posts.

⚠️ However `index.md` need to exist in order to notify next-markdown that this route (/blog) is valid and must be rendered. Try to remove this `index.md`, you will see that http://localhost:3000/blog routesR to 404.
