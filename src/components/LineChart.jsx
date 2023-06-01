import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import axios from "axios";

const LineChart = () => {
  const [revenue, setRevenue] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "http://localhost:8080/api/revenueRouter/getrevenue"
      );
      setRevenue(response?.data?.data);
      console.log("==>", response?.data?.data);
    }
    fetchData();
  }, []);

  const calculateTotalExpenses = (data) => {
    const totalExpenses = data?.reduce((sum, item) => sum + item.expenses, 0);
    return totalExpenses;
  };

  const totalExpenses = calculateTotalExpenses(revenue);
  console.log("Total Expenses:", totalExpenses);
  // console.log("Total Expenses:", totalExpenses);

  const data = {
    labels: revenue?.map((rev) => rev.country),
    datasets: [
      {
        label: "Revenue by Company" + "\n Total : " + totalExpenses + "$",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: revenue?.map((rev) => rev.expenses),
      },
    ],
  };
  return (
    <div className="line_chart">
      <h1></h1>
      <Line data={data} />
    </div>
  );
};

export default LineChart;
