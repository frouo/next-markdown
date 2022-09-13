import NextMarkdown from 'next-markdown';
import Head from 'next/head';
import Link from 'next/link';

const nextmd = NextMarkdown({
  pathToContent: './pages-md',
});

export const getStaticProps = nextmd.getStaticProps;
export const getStaticPaths = nextmd.getStaticPaths;

export default function MyMarkdownPage(props) {
  const { html, frontMatter, subPaths, nextmd } = props;
  console.log('props:', props);
  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
      </Head>
      <div>
        {html && !equals(nextmd, ['blog']) && <div dangerouslySetInnerHTML={{ __html: html }} />}
        {subPaths && (
          <ul>
            {subPaths
              .sort((a, b) => b.frontMatter.date.localeCompare(a.frontMatter.date)) // sort by date
              .map((post, index) => (
                <li key={index}>
                  {post.frontMatter.date}{' '}
                  <Link href={post.nextmd.join('/')}>
                    <a>{post.nextmd.slice(-1).pop()}</a>
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </div>
    </>
  );
}

function equals(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}
