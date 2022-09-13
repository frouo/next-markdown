import Link from 'next/link';
import { NextMarkdownFile, NextMarkdownProps } from 'next-markdown';
import { MyBlogPostFrontMatter, MyFrontMatter } from '../pages/[[...nextmd]]';

export type HomePageProps = NextMarkdownProps<MyFrontMatter> & { posts: NextMarkdownFile<MyBlogPostFrontMatter>[] };

export default function HomePage(props: HomePageProps) {
  const { html, posts } = props;

  return (
    <>
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
      {posts && (
        <ul>
          {posts
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
    </>
  );
}

const readingTime = (content: string) => {
  const wpm = 225;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wpm);
};
