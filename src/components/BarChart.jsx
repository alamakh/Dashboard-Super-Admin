import React from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Revenus } from "../data/mockData";

// function getUniqueMonths(data) {
//   const uniqueMonths = new Set();
//   const months = [
//     "january", "february", "march", "april", "may", "june",
//     "july", "august", "september", "october", "november", "december"
//   ];
//   data.forEach((item) => {
//     uniqueMonths.add(item.month);
//   });

//   const result = [];
//   months.forEach((month) => {
//     if (uniqueMonths.has(month)) {
//       result.push(month);
//     }
//   });

//   return result;
// }

// const uniqueMonths = getUniqueMonths(Revenus);
// console.log(uniqueMonths);
function countRevenueByMonth(Revenus) {
  const countByMonth = Revenus.reduce((acc, item) => {
    const { month, expenses } = item;
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += expenses;
    return acc;
  }, {});

  return countByMonth;
}

const revenusCounts = countRevenueByMonth(Revenus);
console.log("Revenue by month:", revenusCounts);
const labels = Object.keys(revenusCounts);
const dataValues = Object.values(revenusCounts);


const BarChart = () => {
  

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Revenue by month",
        backgroundColor: "rgb(255, 75, 1)",
        borderColor: "rgb(254, 152, 1)",
        // borderWidth: 2,
        // borderRadius : 7,
        data: dataValues,
      },
    ],
  };
  return (
    <div>
      <Bar data={data} />
    </div>
  );
};

export default BarChart;