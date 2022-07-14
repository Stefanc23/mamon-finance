import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

import { expenseCategories, incomeCategories } from '../constants/categories';

interface DetailsChartProps {
  title: string;
  transactions: QueryDocumentSnapshot<DocumentData>[];
}

const DetailsChart = ({ title, transactions }: DetailsChartProps) => {
  const selectedCategories = title === 'Income' ? incomeCategories : expenseCategories;
  const filteredTransactions = transactions.filter((transaction) => transaction.data().type === title);

  selectedCategories.forEach((category) => {
    category.amount = 0;
  });

  filteredTransactions.forEach((transaction) => {
    const category = selectedCategories.find((_category) => _category.type === transaction.data().category);
    if (category) category.amount += transaction.data().amount;
  });

  const filteredCategories = selectedCategories.filter((category) => category.amount > 0);

  const chartData = {
    datasets: [
      {
        data: filteredCategories.map((category) => category.amount),
        backgroundColor: filteredCategories.map((category) => category.color),
      },
    ],
    labels: filteredCategories.map((category) => category.type),
  };

  const total = filteredTransactions.reduce((acc, transaction) => acc + transaction.data().amount, 0);

  return (
    <div>
      <Doughnut
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: title,
              color: 'white',
            },
            subtitle: {
              display: true,
              text: `Total: Rp ${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
              color: 'white',
            },
            legend: {
              labels: {
                color: 'white',
                font: {
                  size: 10,
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default DetailsChart;
