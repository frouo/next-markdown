import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div>
      <h1>MDX Support</h1>
      <p>
        Open{' '}
        <Link href="/hello">
          <a>hello.mdx</a>
        </Link>
      </p>
      <p>
        Open{' '}
        <Link href="/about">
          <a>about.md</a>
        </Link>
      </p>
    </div>
  );
};

export default Home;
