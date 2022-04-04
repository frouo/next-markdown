import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div>
      <h1>MDX Support</h1>
      <p>
        Open{' '}
        <Link href="/hello">
          <a>hello.md</a>
        </Link>
      </p>
    </div>
  );
};

export default Home;
