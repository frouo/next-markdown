import { InferGetStaticPropsType } from 'next';
import NextMarkdown from 'next-markdown';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import remarkPrism from 'remark-prism';
import 'prismjs/themes/prism-tomorrow.css';
import Head from 'next/head';

type MyFrontMatter = { title: string };

const nextmd = NextMarkdown<MyFrontMatter>({
  pathToContent: './pages-markdown',
  rehypePlugins: [rehypeAccessibleEmojis],
  remarkPlugins: [remarkPrism],
});

export const getStaticProps = nextmd.getStaticProps;
export const getStaticPaths = nextmd.getStaticPaths;

export default function MyMarkdownPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { html, frontMatter } = props;

  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
