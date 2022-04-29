import NextMarkdown from 'next-markdown';
import DocumentationPage from '../components/DocumentationPage';
import MarkdownPage from '../components/MarkdownPage';
import remarkPrism from 'remark-prism';
import 'prismjs/themes/prism-tomorrow.css';
import { GetStaticPropsContext } from 'next';
import { DocumentationPageProps, FMatter, MyNextMarkdownProps } from '../lib/types';

const nextmd = NextMarkdown({
  pathToContent: './pages-markdown',
  remarkPlugins: [remarkPrism],
});

export const getStaticProps = async (context: GetStaticPropsContext<{ nextmd: string[] }>) => {
  if (isDocumentation(context.params?.nextmd)) {
    return {
      props: {
        ...(await nextmd.getStaticProps(context)).props,
        nav: [
          { title: 'Getting Started', ...(await nextmd.getStaticPropsForNextmd(['docs', 'getting-started'])) },
          { title: 'Features', ...(await nextmd.getStaticPropsForNextmd(['docs', 'features'])) },
          { title: 'Examples', ...(await nextmd.getStaticPropsForNextmd(['docs', 'examples'])) },
        ],
      },
    };
  } else {
    return nextmd.getStaticProps(context);
  }
};

export const getStaticPaths = nextmd.getStaticPaths;

export default function MyMarkdownPage(props: DocumentationPageProps | MyNextMarkdownProps) {
  if (isDocumentation(props.nextmd)) {
    return <DocumentationPage {...(props as DocumentationPageProps)} />;
  } else {
    return <MarkdownPage {...(props as MyNextMarkdownProps)} />;
  }
}

// ----------
// Utils
// ----------

const isDocumentation = (nextmd: string[] | undefined) => nextmd?.includes('docs'); // tslint:disable-line:no-shadowed-variable
