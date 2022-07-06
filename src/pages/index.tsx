import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getSession } from 'next-auth/react';

const Home: NextPage = ({ greeting, link, linkText }: any) => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <Head>
        <title>Mamon Finance App</title>
      </Head>

      <main className='flex w-full h-full flex-1 flex-col items-center justify-center px-20 text-center'>
        <Image src='/logo.png' alt='Mamon Finance' width={128} height={128} />
        <h1 className='mb-6 text-3xl font-bold text-white'>{greeting}</h1>
        <Link href={link}>
          <a className='cursor-pointer flex px-5 py-3 font-medium bg-primary text-sm rounded hover:shadow-md hover:shadow-secondary focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out'>
            {linkText}
          </a>
        </Link>
      </main>

      <footer className='flex w-full h-16 items-center justify-center'>
        Made with ❤️ by&nbsp;
        <a
          className='flex items-center justify-center gap-2'
          href='https://stfn.tech'
          target='_blank'
          rel='noopener noreferrer'
        >
          Stefano C. Wiryana
        </a>
      </footer>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const greetings = [
    'Hello',
    'Bonjour',
    'Hola',
    'Ciao',
    'こんにちは',
    '안녕하세요',
    '你好',
  ];

  return {
    props: {
      session,
      greeting: session
        ? `${greetings[Math.floor(Math.random() * greetings.length)]} ${
            session.user?.name?.split(' ')[0]
          }!`
        : 'Start Managing Your Finances Now!',
      link: session ? '/dashboard' : '/auth/signin',
      linkText: session ? 'Go to Dashboard' : 'Get Started',
    },
  };
}

export default Home;
