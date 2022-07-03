import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { getProviders, signIn } from 'next-auth/react';

const SignIn: NextPage = ({ providers }: any) => {
  return (
    <div className='h-screen container flex flex-col justify-center items-center'>
      <Head>
        <title>Mamon Finance App | Sign In</title>
      </Head>
      <Image src='/logo.png' alt='Mamon Finance' width={128} height={128} />
      <div>
        {Object.values(providers).map((provider: any) => (
          <div key={provider.name}>
            <button
              className='flex px-7 py-3 font-medium bg-white text-sm rounded shadow-md border hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out'
              onClick={() => signIn(provider.id, { callbackUrl: '/' })}
            >
              <Image
                className='mr-4'
                src='https://img.icons8.com/color/48/000000/google-logo.png'
                alt={provider.name}
                width={24}
                height={24}
              />
              Sign in with {provider.name}
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
