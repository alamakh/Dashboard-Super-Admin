import React from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import "./index.css";
import { Revenus } from "../data/mockData";

function countCompaniesByYear(Revenus) {
  const countByYear = Revenus.reduce((acc, item) => {
    const { year, company_name } = item;
    if (!acc[year]) {
      acc[year] = new Set();
    }
    acc[year].add(company_name);
    return acc;
  }, {});

  const result = {};
  for (const year in countByYear) {
    result[year] = countByYear[year].size;
  }

  return result;
}

const companyCounts = countCompaniesByYear(Revenus);
console.log("rrr", companyCounts);
const labels = Object.keys(companyCounts);
const dataValues = Object.values(companyCounts);

const data = {
  labels: labels,
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgb(37, 165, 253)",
      borderColor: "rgb(0,0,0)",
      data: dataValues,
    },
  ],
};
const PieChart = () => {
  return (
    <div className="pie_chart">
      <Pie data={data} />
    </div>
  );
};
export default PieChart;
