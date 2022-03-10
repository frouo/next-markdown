import { InferGetStaticPropsType } from 'next';
import NextMd from 'next-markdown';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

type MyFrontMatter = { title: string };
type MyBlogPostFrontMatter = MyFrontMatter & { author: string };

const next = NextMd<MyFrontMatter, MyBlogPostFrontMatter>({
  pathToContent: './pages-markdown',
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
