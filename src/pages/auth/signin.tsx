import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getProviders, signIn } from 'next-auth/react';

const SignIn: NextPage = ({ providers }: any) => {
  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      <Head>
        <title>Mamon Finance App | Sign In</title>
      </Head>
      <Link href='/'>
        <Image className='cursor-pointer' src='/logo.png' alt='Mamon Finance' width={128} height={128} />
      </Link>
      <div>
        {Object.values(providers).map((provider: any) => (
          <div key={provider.name}>
            <button
              className='flex p-3 font-medium bg-white text-gray-700 text-sm rounded hover:shadow-md hover:shadow-secondary focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out'
              onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })}
            >
              <Image
                src='https://img.icons8.com/color/48/000000/google-logo.png'
                alt={provider.name}
                width={24}
                height={24}
              />
              &nbsp; Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default SignIn;
