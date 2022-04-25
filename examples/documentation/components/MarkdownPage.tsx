import Head from 'next/head';
import { MyNextMarkdownProps } from '../lib/types';

export default function MarkdownPage(props: MyNextMarkdownProps) {
  const { html, frontMatter } = props;
  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
      </Head>
      <div>{html && <div dangerouslySetInnerHTML={{ __html: html }} />}</div>
    </>
  );
}
