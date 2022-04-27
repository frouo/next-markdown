import Head from 'next/head';
import { DocumentationPageProps } from '../lib/types';

export default function DocumentationPage(props: DocumentationPageProps) {
  const { html, frontMatter, nav, nextmd } = props;

  const pages = nav
    .map((e) => e.props.subPaths?.map((sp) => ({ ...sp, navTitle: e.title })))
    .flatMap((e) => (e ? e : []));

  const currentIndex = pages.findIndex((v) => JSON.stringify(v.nextmd) === JSON.stringify(nextmd));
  const currentPage = currentIndex !== -1 ? pages[currentIndex] : null;
  const previousPage = currentIndex < 0 ? null : pages[currentIndex - 1];
  const nextPage = currentIndex === pages.length - 1 ? null : pages[currentIndex + 1];

  return (
    <>
      <style jsx>{`
        .dark {
          color: white;
          background-color: black;
        }
        section {
          text-align: center;
          padding: 5px 0px;
        }
        nav {
          padding: 15px 15px;
          flex: 0 0 170px;
        }
        a:visited {
          color: white;
        }
        .page {
          height: 100%;
          margin-top: 10px;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
        }
        .content {
          padding: 0px 15px;
          flex-grow: 1;
          flex-shrink: 0;
          width: 0%;
        }
        .prev-next-container {
          display: flex;
          flex-direction: row;
        }
        .prev-next-link {
          width: 50%;
          text-align: center;
          padding: 10px 12px;
        }
        .prev {
          margin-right: auto;
        }
        .next {
          margin-left: auto;
        }
      `}</style>
      <Head>
        <title>{frontMatter.title}</title>
      </Head>
      <div>
        <section className="dark">example ~ documentation</section>
        <div className="page">
          <nav className="dark">
            {nav.map((e, index) => {
              return (
                <div key={index}>
                  <p>{e.title}</p>
                  <ul>
                    {e.props.subPaths?.map((ee, ii) => (
                      <li key={'li' + ii}>
                        <a href={hrefForNextmd(ee.nextmd)}>{ee.frontMatter.title}</a>
                        {currentPage?.frontMatter.title === ee.frontMatter.title && ' 👈'}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
          <div className="content">
            {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
            <div className="prev-next-container">
              {previousPage && (
                <a href={hrefForNextmd(previousPage.nextmd)} className="prev-next-link prev dark">
                  ⬅️ Previous
                </a>
              )}
              |
              {nextPage && (
                <a href={hrefForNextmd(nextPage.nextmd)} className="prev-next-link next dark">
                  Next ➡️
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// -----
// Utils
// -----

const hrefForNextmd = (nextmd: string[]) => `http://localhost:3000/${nextmd.join('/')}`;
