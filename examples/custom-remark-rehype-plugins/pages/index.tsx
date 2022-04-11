import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div>
      <h1>Customize remark and rehype plugins</h1>
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
