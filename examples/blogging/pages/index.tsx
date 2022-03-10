import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div>
      <h1>Blogging</h1>
      <p>Hello, I am next-markdown,</p>
      <p>
        Visit my{' '}
        <Link href="/blog">
          <a>blog ➡️</a>
        </Link>
      </p>
    </div>
  );
};

export default Home;
