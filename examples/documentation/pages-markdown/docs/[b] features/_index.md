This file won't generate a path because it starts with an underscore (`_`)

Meaning http://localhost:3000/docs/getting-started will return a 404.

So why this file?

To allow `getStaticProps` to return something for the route `/docs/getting-started`.
