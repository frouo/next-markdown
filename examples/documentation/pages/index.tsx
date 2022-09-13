import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div>
      <h1>Documentation Demo</h1>
      <p>Hello, I am next-markdown,</p>
      <p>
        Visit my{' '}
        <Link href="/docs">
          <a>docs ➡️</a>
        </Link>
      </p>
    </div>
  );
};

export default Home;
