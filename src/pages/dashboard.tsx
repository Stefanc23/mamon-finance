import type { NextPage } from 'next';
import Head from 'next/head';
import { signOut } from 'next-auth/react';
import { getSession, useSession } from 'next-auth/react';

const Dashboard: NextPage = () => {
  const { data: session } = useSession();

  return (
    <div className='h-screen container flex flex-col justify-center items-center'>
      <Head>
        <title>Mamon Finance App | Dashboard</title>
      </Head>
      Hi {session!.user?.name}
      <button onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Dashboard;
