import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';
import type { NextPage } from 'next';
import Head from 'next/head';
import { getSession, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import DetailsChart from '../components/DetailsChart';
import LoadingOverlay from '../components/LoadingOverlay';
import Navbar from '../components/Navbar';
import SummaryChart from '../components/SummaryChart';
import TransactionList from '../components/TransactionList';
import { expenseCategories, incomeCategories } from '../constants/categories';
import { db } from '../../firebase';

const Dashboard: NextPage = () => {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const watchType = watch('type', 'Income');

  useEffect(() => {
    setLoading(true);
    return onSnapshot(
      query(collection(db, 'transactions'), where('user', '==', session!.user!.email), orderBy('date', 'desc')),
      (snapshot) => {
        setTransactions(snapshot.docs);
        setBalance(
          snapshot.docs.reduce(
            (acc, transaction) =>
              transaction.data().type === 'Income' ? acc + transaction.data().amount : acc - transaction.data().amount,
            0
          )
        );
        setLoading(false);
      }
    );
  }, [session]);

  const addTransaction = async (data: any) => {
    if (loading) return;
    setLoading(true);

    await addDoc(collection(db, 'transactions'), {
      user: session!.user!.email,
      type: data.type,
      category: data.category,
      amount: parseFloat(data.amount),
      date: data.date,
    });

    setLoading(false);
  };

  const deleteTransaction = async (id: string) => {
    if (loading) return;
    setLoading(true);

    await deleteDoc(doc(db, 'transactions', id));

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Mamon Finance App | Dashboard</title>
      </Head>
      {loading && <LoadingOverlay />}
      <Navbar avatar={session!.user!.image as string} balance={balance} />
      <main>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-3 px-8 pb-4'>
          <div className='w-full p-4 bg-gray-800 text-gray-200 rounded-sm shadow-sm lg:col-span-2'>
            Analytics
            <SummaryChart transactions={transactions} />
            <div className='w-full flex flex-col md:flex-row justify-around gap-8 mt-4 p-4'>
              <DetailsChart title='Income' transactions={transactions} />
              <DetailsChart title='Expense' transactions={transactions} />
            </div>
          </div>
          <div className='w-full p-4 bg-gray-800 text-gray-200 rounded-sm shadow-sm'>
            <div className='w-full'>
              Add Transaction
              <form className='mt-6' onSubmit={handleSubmit(addTransaction)}>
                <div className='flex flex-wrap -mx-3 mb-3'>
                  <div className='flex flex-col w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                    <label className='text-xs' htmlFor='type'>
                      Type
                    </label>
                    <select
                      className='text-gray-200 bg-gray-600 mt-2 p-1 text-xs rounded-sm h-9'
                      id='type'
                      {...register('type', { required: true })}
                    >
                      <option value='Income'>Income</option>
                      <option value='Expense'>Expense</option>
                    </select>
                  </div>
                  <div className='flex flex-col w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                    <label className='text-xs' htmlFor='category'>
                      Category
                    </label>
                    <select
                      className='text-gray-200 bg-gray-600 mt-2 p-1 text-xs rounded-sm h-9'
                      id='category'
                      {...register('category', { required: true })}
                    >
                      {(watchType === 'Income' ? incomeCategories : expenseCategories).map(({ type }) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className='flex flex-wrap -mx-3 mb-3'>
                  <div className='flex flex-col w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                    <label className='text-xs' htmlFor='amount'>
                      Amount
                    </label>
                    <input
                      type='number'
                      className='text-gray-200 bg-gray-600 mt-2 p-1 text-xs rounded-sm h-9'
                      placeholder='Amount'
                      id='amount'
                      {...register('amount', { required: true, min: 1 })}
                    />
                    <p className='mt-1 h-2 text-red-500 text-xs'>{errors.amount && 'Amount is required'}</p>
                  </div>
                  <div className='flex flex-col w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                    <label className='text-xs' htmlFor='date'>
                      Date
                    </label>
                    <input
                      type='date'
                      className='text-gray-200 bg-gray-600 mt-2 p-1 text-xs rounded-sm h-9'
                      id='date'
                      defaultValue={new Date().toISOString().split('T')[0]}
                      {...register('date', { required: true })}
                    />
                    <p className='mt-1 h-2 text-red-500 text-xs'>{errors.date && 'Date is required'}</p>
                  </div>
                </div>
                <button
                  type='submit'
                  className='w-full mt-2 py-2 bg-gray-600 rounded-sm text-sm hover:shadow-sm hover:shadow-secondary focus:shadow-sm focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out'
                >
                  Add
                </button>
              </form>
            </div>
            <div className='w-full mt-6'>
              Transactions
              <TransactionList transactions={transactions} deleteTransaction={deleteTransaction} />
            </div>
          </div>
        </div>
      </main>
    </>
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
