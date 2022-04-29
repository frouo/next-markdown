import { InferGetStaticPropsType } from 'next';
import NextMarkdown, { TableOfContentItem } from 'next-markdown';
import Head from 'next/head';
import Link from 'next/link';

type MyFrontMatter = { title: string };
type MyBlogPostFrontMatter = MyFrontMatter & { date: string; author: string };

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
  const { html, frontMatter, subPaths, tableOfContents } = props;

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
        <hr />
        {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
        {subPaths && (
          <ul>
            {subPaths
              .sort((a, b) => b.frontMatter.date.localeCompare(a.frontMatter.date)) // sort by date
              .map((post, index) => (
                <li key={index}>
                  {post.frontMatter.date}{' '}
                  <Link href={post.nextmd.join('/')}>
                    <a>{post.nextmd.slice(-1).pop()}</a>
                  </Link>{' '}
                  by {post.frontMatter.author} • {readingTime(post.markdown)} min read
                </li>
              ))}
          </ul>
        )}
      </div>
    </>
  );
}

const readingTime = (content: string) => {
  const wpm = 225;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wpm);
};
