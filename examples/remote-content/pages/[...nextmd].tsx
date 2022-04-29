import { InferGetStaticPropsType } from 'next';
import NextMarkdown from 'next-markdown';
import Head from 'next/head';

type MyFrontMatter = { title: string };

const nextmd = NextMarkdown<MyFrontMatter>({
  pathToContent: './',
  contentGitRepo: {
    remoteUrl: 'https://github.com/frouo/next-markdown-demo',
    branch: 'main',
  },
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
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </>
  );
}
