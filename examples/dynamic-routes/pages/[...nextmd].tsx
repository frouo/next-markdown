import { InferGetStaticPropsType } from 'next';
import NextMarkdown from 'next-markdown';
import Head from 'next/head';

type MyFrontMatter = { title: string };
type MyBlogPostFrontMatter = MyFrontMatter & { author: string };

const nextmd = NextMarkdown<MyFrontMatter, MyBlogPostFrontMatter>({
  pathToContent: './pages-markdown',
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
