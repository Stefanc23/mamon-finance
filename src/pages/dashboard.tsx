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

import LoadingOverlay from '../components/LoadingOverlay';
import Navbar from '../components/Navbar';
import { expenseCategories, incomeCategories } from '../constants/categories';
import { db } from '../../firebase';

const Dashboard: NextPage = () => {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(incomeCategories);
  const typeInputRef = useRef<HTMLSelectElement>(null);
  const categoryInputRef = useRef<HTMLSelectElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'transactions'), where('user', '==', session!.user!.email), orderBy('date', 'desc')),
        (snapshot) => {
          setTransactions(snapshot.docs);
        }
      ),
    [session]
  );

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
    <div>
      <Head>
        <title>Mamon Finance App | Dashboard</title>
      </Head>
      {loading && <LoadingOverlay />}
      <Navbar avatar={session!.user!.image as string} />
      <main>
        <div className='min-h-[85vh] grid grid-cols-1 lg:grid-cols-3 gap-3 px-8 pb-4'>
          <div className='w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-sm shadow-sm lg:col-span-2'>Analytics</div>
          <div className='w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-sm shadow-sm'>
            <div className='p-1'>
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
              <div className='w-full max-h-10 mt-6'>
                Transactions
                <div className='max-h-32 mt-6 overflow-y-auto scrollbar-hide'>
                  {transactions.length === 0 ? (
                    <div className='h-32 flex justify-center items-center text-gray-300 text-xs'>Nothing here yet.</div>
                  ) : (
                    transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className={`mb-2 flex justify-between items-center ${
                          transaction.data().type === 'Income' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        <div className='flex justify-center'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            enableBackground='new 0 0 64 64'
                            viewBox='0 0 64 64'
                            fill='currentcolor'
                            width='48'
                            height='48'
                          >
                            <path
                              d='M32,12.895c-10.535,0-19.105,8.57-19.105,19.105S21.465,51.105,32,51.105S51.105,42.535,51.105,32S42.535,12.895,32,12.895z
                            M38.002,37.836c-0.577,0.841-1.333,1.472-2.324,1.943c-0.731,0.324-1.492,0.523-2.278,0.597v2.568c0,0.392-0.317,0.708-0.708,0.708
                            h-2.119c-0.392,0-0.708-0.317-0.708-0.708v-2.79c-0.399-0.098-0.792-0.235-1.186-0.415c-1.059-0.432-1.913-1.136-2.512-2.083
                            c-0.601-0.879-0.924-1.906-0.974-3.119c-0.016-0.384,0.277-0.71,0.66-0.736l1.903-0.13c0.383-0.022,0.707,0.249,0.752,0.623
                            c0.076,0.637,0.255,1.164,0.519,1.524c0.297,0.446,0.678,0.739,1.254,0.975c1.22,0.537,2.772,0.538,3.846,0.125
                            c0.476-0.204,0.813-0.438,1.036-0.726c0.191-0.274,0.285-0.562,0.285-0.906c0-0.323-0.083-0.561-0.284-0.819
                            c-0.105-0.14-0.376-0.402-1.089-0.687c-0.348-0.115-1.252-0.372-2.628-0.705c-1.607-0.401-2.537-0.705-3.114-1.018
                            c-0.859-0.454-1.504-1.02-1.909-1.679c-0.415-0.671-0.625-1.437-0.625-2.275c0-0.912,0.255-1.781,0.757-2.583
                            c0.52-0.782,1.287-1.396,2.229-1.792c0.315-0.143,0.673-0.263,1.081-0.359v-2.361c0-0.392,0.317-0.708,0.708-0.708h2.119
                            c0.392,0,0.708,0.317,0.708,0.708v2.236c0.637,0.106,1.227,0.267,1.762,0.48c1.035,0.465,1.786,1.088,2.322,1.917
                            c0.537,0.782,0.84,1.721,0.893,2.774c0.019,0.386-0.275,0.716-0.661,0.742l-1.948,0.131c-0.376,0.026-0.699-0.242-0.75-0.611
                            c-0.109-0.799-0.376-1.357-0.817-1.704c-0.501-0.427-1.228-0.626-2.244-0.626c-0.995,0-1.794,0.193-2.251,0.545
                            c-0.371,0.286-0.545,0.63-0.545,1.082c0,0.348,0.109,0.621,0.324,0.813c0.114,0.09,0.736,0.495,2.747,0.918
                            c1.661,0.392,2.882,0.749,3.551,1.037c1.066,0.48,1.828,1.099,2.275,1.843c0.499,0.747,0.75,1.583,0.75,2.527
                            C38.809,36.094,38.538,37.01,38.002,37.836z'
                            />
                          </svg>
                          <div className='ml-4 flex flex-col'>
                            <span className='text-sm'>{transaction.data().category}</span>
                            <span className='text-xs text-gray-400'>
                              Rp {transaction.data().amount} - {transaction.data().date}
                            </span>
                          </div>
                        </div>
                        <button className='text-gray-500' onClick={() => deleteTransaction(transaction.id)}>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 512 512'
                            fill='currentcolor'
                          >
                            <path d='M413.7 133.4c-2.4-9-4-14-4-14-2.6-9.3-9.2-9.3-19-10.9l-53.1-6.7c-6.6-1.1-6.6-1.1-9.2-6.8-8.7-19.6-11.4-31-20.9-31h-103c-9.5 0-12.1 11.4-20.8 31.1-2.6 5.6-2.6 5.6-9.2 6.8l-53.2 6.7c-9.7 1.6-16.7 2.5-19.3 11.8 0 0-1.2 4.1-3.7 13-3.2 11.9-4.5 10.6 6.5 10.6h302.4c11 .1 9.8 1.3 6.5-10.6zM379.4 176H132.6c-16.6 0-17.4 2.2-16.4 14.7l18.7 242.6c1.6 12.3 2.8 14.8 17.5 14.8h207.2c14.7 0 15.9-2.5 17.5-14.8l18.7-242.6c1-12.6.2-14.7-16.4-14.7z' />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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
