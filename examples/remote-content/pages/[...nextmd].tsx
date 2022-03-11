import { InferGetStaticPropsType } from 'next';
import NextMd from 'next-markdown';
import Head from 'next/head';

type MyFrontMatter = { title: string };
type MyBlogPostFrontMatter = MyFrontMatter & { author: string };

const next = NextMd<MyFrontMatter, MyBlogPostFrontMatter>({
  pathToContent: './',
  contentGitRepo: {
    remoteUrl: 'https://github.com/frouo/next-markdown-demo',
    branch: 'main',
  },
});

export const getStaticProps = next.getStaticProps;
export const getStaticPaths = next.getStaticPaths;

export default function MyMarkdownPage({ html, frontMatter }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
