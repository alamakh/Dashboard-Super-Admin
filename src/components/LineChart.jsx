import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Revenus } from "../data/mockData";

const labels = Revenus.country

const data = {
  labels: Revenus.map((rev)=> rev.country),
  datasets: [
    {
      label: "Revenue by Company",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: Revenus.map((rev)=> rev.expenses),
    },
  ],
};

const LineChart = () => {
  return (
    <div className="line_chart">
      <Line data={data} />
    </div>
  );
};

export default LineChart;