# Documentation

`next-markdown` lets you build your documentation.

## How

You probably want to display a navigation, with a previous, next etc.

![website](https://user-images.githubusercontent.com/2499356/165123455-6da1bfe1-ae2c-46ad-8fe0-32b0658c5b87.png)

This ☝️ is generated from the following file tree

<img width="284" alt="file tree" src="https://user-images.githubusercontent.com/2499356/165125276-07926d4a-472c-4bb2-921d-875f4da58ea5.png">

To do so you can use the function `getStaticPropsForNextmd` which returns the static props for the given `nextmd` of your choice.

This way you can customize your `export default getStaticProps`. Like so

```js
export const getStaticProps = async (context: GetStaticPropsContext<{ nextmd: string[] }>) => {
  if (context.params?.nextmd.includes("docs"))) { // ⬅️ if path contains "docs", then shape your own results
    // every docs pages will have "nav" so you can render a navigation panel
    return {
      props: {
        ...(await nextmd.getStaticProps(context)).props,
        nav: [
          { title: 'Getting Started', ...(await nextmd.getStaticPropsForNextmd(['docs', 'getting-started'])) },
          { title: 'Features', ...(await nextmd.getStaticPropsForNextmd(['docs', 'features'])) },
          { title: 'Examples', ...(await nextmd.getStaticPropsForNextmd(['docs', 'examples'])) },
        ],
      },
    };
  } else {
    return nextmd.getStaticProps(context);
  }
};
```

## Demo

```shell
git clone https://github.com/frouo/next-markdown.git

cd next-markdown
npm install
npm run build

cd examples/documentation/
npm install
npm run dev
```

open [http://localhost:3000](http://localhost:3000)
