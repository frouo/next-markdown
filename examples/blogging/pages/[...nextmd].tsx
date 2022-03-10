import { InferGetStaticPropsType } from 'next';
import NextMd from 'next-markdown';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

type MyFrontMatter = { title: string };
type BlogPostFrontMatter = MyFrontMatter & { author: string };

const next = NextMd<MyFrontMatter, BlogPostFrontMatter>({
  pathToContent: './pages-markdown',
});

export const getStaticProps = next.getStaticProps;
export const getStaticPaths = next.getStaticPaths;

export default function MyMarkdownPage({ html, frontMatter, posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
      </Head>
      <div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        {posts && (
          <ul>
            {posts
              .sort((a, b) => b.date.localeCompare(a.date)) // sort by date
              .map((post, index) => (
                <li key={index}>
                  {post.date}{' '}
                  <Link href={`${router.asPath}/${post.slug}`}>
                    <a>{post.slug}</a>
                  </Link>{' '}
                  by {post.frontMatter.author}
                </li>
              ))}
          </ul>
        )}
      </div>
    </>
  );
}
