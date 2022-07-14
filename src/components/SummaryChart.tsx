import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

import { monthLong } from '../constants/months';

interface SummaryChartProps {
  transactions: QueryDocumentSnapshot<DocumentData>[];
}

const date = new Date();
date.setMonth(date.getMonth() - 5);
const months = monthLong.slice(date.getMonth(), (((date.getMonth() + 6) % 12) + 12) % 12);

const options = {
  plugins: {
    title: {
      display: true,
      text: 'Summary',
      color: 'white',
    },
    legend: {
      labels: {
        color: 'white',
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: 'white',
      },
    },
    y: {
      ticks: {
        color: 'white',
      },
    },
  },
};

const SummaryChart = ({ transactions }: SummaryChartProps) => {
  const incomeTransactions = transactions.filter(
    (transaction) => transaction.data().type === 'Income' && transaction.data().date
  );
  const expenseTransactions = transactions.filter((transaction) => transaction.data().type === 'Expense');

  const incomePerMonth: number[] = [];
  const expensePerMonth: number[] = [];

  months.forEach((month) => {
    // set income per month
    const income = incomeTransactions.filter(
      (transaction) => parseInt(transaction.data().date.split('-')[1]) - 1 === monthLong.indexOf(month)
    );
    incomePerMonth.push(income.reduce((acc, transaction) => acc + transaction.data().amount, 0));

    // set expense per month
    const expense = expenseTransactions.filter(
      (transaction) => parseInt(transaction.data().date.split('-')[1]) - 1 === monthLong.indexOf(month)
    );
    expensePerMonth.push(expense.reduce((acc, transaction) => acc + transaction.data().amount, 0));
  });

  const datasets = [
    // income
    {
      label: 'Income',
      data: incomePerMonth,
      borderColor: '#4ADE80',
      backgroundColor: '#4ADE80',
    },
    // expense
    {
      label: 'Expense',
      data: expensePerMonth,
      borderColor: '#DD686A',
      backgroundColor: '#DD686A',
    },
  ];

  return <Bar options={options} data={{ labels: months, datasets }} />;
};

export default SummaryChart;
