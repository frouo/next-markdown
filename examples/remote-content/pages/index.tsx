import type { NextPage } from 'next';
import Link from 'next/link';

const markdownPages = ['/about', '/terms', '/thank-you', '/hello', '/hello/world'];

const Home: NextPage = () => {
  return (
    <div>
      <h1>My 100% custom home page</h1>
      <p>
        This page is generated from <code>pages/index.ts</code>
      </p>
      <p>
        Pages listed below have been generated from another Git repository:{' '}
        <a href="https://github.com/frouo/next-markdown-demo">github.com/frouo/next-markdown-demo</a>.
      </p>
      <ul>
        {markdownPages.map((route, index) => (
          <li key={index}>
            <Link href={route}>
              <a>{route}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
