import { GetStaticPropsContext } from 'next';
import NextMarkdown from 'next-markdown';
import Head from 'next/head';
import BlogPostPage, { BlogPostPageProps } from '../components/blog-post';
import HomePage, { HomePageProps } from '../components/home';

export type MyFrontMatter = { title: string };
export type MyBlogPostFrontMatter = MyFrontMatter & { date: string; author: string };

const nextmarkdown = NextMarkdown({
  pathToContent: './pages-markdown',
});

export const getStaticProps = async (context: GetStaticPropsContext<{ nextmd: string[] }>) => {
  if (context.params?.nextmd === undefined) {
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ==> http://localhost:3000
    // we want to list all the blog posts in the home page
    // so we need to re-shape accordingly the home page's getStaticProps.
    return {
      props: {
        ...(await nextmarkdown.getStaticProps(context)).props,
        posts: (await nextmarkdown.getStaticPropsForNextmd(['posts'])).props.subPaths,
      },
    };
  } else {
    return await nextmarkdown.getStaticProps(context);
  }
};

export const getStaticPaths = nextmarkdown.getStaticPaths;

export default function MyMarkdownPage(props: HomePageProps | BlogPostPageProps) {
  const { nextmd, frontMatter } = props;

  const isHomePage = nextmd.length === 0; // == []
  const isBlogPostPage = nextmd.length === 2; // == ["posts", "slug-of-your-blog-post"]

  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
      </Head>
      <div>
        {isHomePage && <HomePage {...(props as HomePageProps)} />}
        {isBlogPostPage && <BlogPostPage {...(props as BlogPostPageProps)} />}
      </div>
    </>
  );
}
