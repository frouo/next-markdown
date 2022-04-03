import { InferGetStaticPropsType } from 'next';
import NextMarkdown, { TableOfContentItem } from 'next-markdown';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

type MyFrontMatter = { title: string };
type MyBlogPostFrontMatter = MyFrontMatter & { author: string };

const nextmd = NextMarkdown<MyFrontMatter, MyBlogPostFrontMatter>({
  pathToContent: './pages-markdown',
});

export const getStaticProps = nextmd.getStaticProps;
export const getStaticPaths = nextmd.getStaticPaths;

const TableOfContentItem = (item: TableOfContentItem) => {
  return (
    <ul key={item.id}>
      <li>
        <a href={`#${item.id}`}>{item.text}</a>
      </li>
      {item.subItems.length > 0 && item.subItems.map((subItem) => <TableOfContentItem key={subItem.id} {...subItem} />)}
    </ul>
  );
};

export default function MyMarkdownPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const { html, frontMatter, posts, tableOfContents } = props;

  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
      </Head>
      <div>
        {tableOfContents.length > 0 && (
          <div>
            <strong>Table of Contents</strong>
            {tableOfContents.map((item) => (
              <TableOfContentItem key={item.id} {...item} />
            ))}
          </div>
        )}
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
