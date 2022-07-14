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
import { useEffect, useRef, useState } from 'react';

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
  const [selectedCategories, setSelectedCategories] = useState(incomeCategories);
  const typeInputRef = useRef<HTMLSelectElement>(null);
  const categoryInputRef = useRef<HTMLSelectElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

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

  const changeSelectedCategories = () => {
    setSelectedCategories(typeInputRef.current!.value === 'Income' ? incomeCategories : expenseCategories);
  };

  const addTransaction = async () => {
    if (loading) return;
    setLoading(true);

    await addDoc(collection(db, 'transactions'), {
      user: session!.user!.email,
      type: typeInputRef.current!.value,
      category: categoryInputRef.current!.value,
      amount: parseFloat(amountInputRef.current!.value),
      date: dateInputRef.current!.value,
    });

    typeInputRef.current!.value = 'Income';
    setSelectedCategories(incomeCategories);
    categoryInputRef.current!.value = 'Business';
    amountInputRef.current!.value = '';
    dateInputRef.current!.value = new Date().toISOString().split('T')[0];

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
              <form className='mt-6'>
                <div className='flex flex-wrap -mx-3 mb-3'>
                  <div className='flex flex-col w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                    <label className='text-xs' htmlFor='type'>
                      Type
                    </label>
                    <select
                      ref={typeInputRef}
                      className='text-gray-200 bg-gray-600 mt-2 p-1 text-xs rounded-sm h-9'
                      name='type'
                      id='type'
                      onChange={changeSelectedCategories}
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
                      ref={categoryInputRef}
                      className='text-gray-200 bg-gray-600 mt-2 p-1 text-xs rounded-sm h-9'
                      name='category'
                      id='category'
                    >
                      {selectedCategories.map(({ type }) => (
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
                      ref={amountInputRef}
                      type='number'
                      className='text-gray-200 bg-gray-600 mt-2 p-1 text-xs rounded-sm h-9'
                      name='amount'
                      id='amount'
                      placeholder='Amount'
                      min='1'
                    />
                  </div>
                  <div className='flex flex-col w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                    <label className='text-xs' htmlFor='date'>
                      Date
                    </label>
                    <input
                      ref={dateInputRef}
                      type='date'
                      className='text-gray-200 bg-gray-600 mt-2 p-1 text-xs rounded-sm h-9'
                      name='date'
                      id='date'
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <button
                  type='button'
                  className='w-full mt-2 py-2 bg-gray-600 rounded-sm text-sm hover:shadow-sm hover:shadow-secondary focus:shadow-sm focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out'
                  onClick={addTransaction}
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
