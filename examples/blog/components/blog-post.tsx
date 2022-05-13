import { NextMarkdownProps } from 'next-markdown';
import { MyBlogPostFrontMatter } from '../pages/[[...nextmd]]';
import { TableOfContentItem } from './table-of-contents';

export type BlogPostPageProps = NextMarkdownProps<MyBlogPostFrontMatter>;

export default function BlogPostPage(props: BlogPostPageProps) {
  const { html, tableOfContents } = props;

  return (
    <>
      {tableOfContents.length > 0 && (
        <>
          <div>
            <strong>Table of Contents</strong>
            {tableOfContents.map((item) => (
              <TableOfContentItem key={item.id} {...item} />
            ))}
          </div>
          <hr />
        </>
      )}
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </>
  );
}
