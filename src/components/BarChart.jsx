import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const BarChart = () => {
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

  function countRevenueByMonth(revenue) {
    const countByMonth = revenue.reduce((acc, item) => {
      const { month, expenses } = item;
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += expenses;
      return acc;
    }, {});

    return countByMonth;
  }

  const revenusCounts = countRevenueByMonth(revenue);
  console.log("Revenue by month:", revenusCounts);
  const labels = Object.keys(revenusCounts);
  const dataValues = Object.values(revenusCounts);

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
