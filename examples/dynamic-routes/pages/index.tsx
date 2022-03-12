import type { NextPage } from 'next';
import Link from 'next/link';

const markdownPages = ['/about', '/hello', '/hello/world', '/hello/jurassic/world'];

const Home: NextPage = () => {
  return (
    <div>
      <h1>My 100% custom home page</h1>
      <p>
        This home page is custom, cf. <code>pages/index.ts</code>
      </p>
      <p>
        Pages listed below are generated from markdown files in the <code>pages-markdown/</code> folder:
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
