import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

import TransactionCard from './TransactionCard';

interface TransactionListProps {
  transactions: QueryDocumentSnapshot<DocumentData>[];
  deleteTransaction: (id: string) => void;
}

const TransactionList = ({ transactions, deleteTransaction }: TransactionListProps) => {
  return (
    <div className='mt-4 p-2 h-96 rounded-sm overflow-y-auto scrollbar-hide'>
      {transactions.length === 0 ? (
        <div className='flex justify-center items-center text-gray-300 text-xs'>Nothing here yet.</div>
      ) : (
        transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} deleteTransaction={deleteTransaction} />
        ))
      )}
    </div>
  );
};

export default TransactionList;
