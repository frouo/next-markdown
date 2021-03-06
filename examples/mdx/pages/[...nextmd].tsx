import { InferGetStaticPropsType } from 'next';
import NextMarkdown from 'next-markdown';
import Head from 'next/head';
import { MDXRemote } from 'next-mdx-remote';
import Button from '../components/button';

type MyFrontMatter = { title: string };

const nextmd = NextMarkdown<MyFrontMatter>({
  pathToContent: './pages-markdown',
});

export const getStaticProps = nextmd.getStaticProps;
export const getStaticPaths = nextmd.getStaticPaths;

export default function MyMarkdownPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { frontMatter, html, mdxSource } = props;

  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
      </Head>
      {mdxSource && <MDXRemote {...mdxSource} components={{ Button }} />}
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </>
  );
}
