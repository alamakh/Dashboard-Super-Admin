import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import "./index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import enUS from "date-fns/locale/en-US";

registerLocale("en-US", enUS);
setDefaultLocale("en-US");

const BarChart = () => {
  const [revenue, setRevenue] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

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

  function countRevenueByMonth(revenue, selectedMonth) {
    console.log("Selected month 1:", selectedMonth);
    if (selectedMonth) {
      const filteredRevenue = revenue?.filter(
        (item) =>
          item?.month?.toLowerCase() ===
          selectedMonth
            ?.toLocaleString("en-US", { month: "long" })
            ?.toLowerCase()
      );
      console.log("Filtered revenue 1:", filteredRevenue);

      const countByMonth = filteredRevenue?.reduce((acc, item) => {
        const { month, expenses } = item;
        if (!acc[month]) {
          acc[month] = 0;
        }
        acc[month] += expenses;
        return acc;
      }, {});

      return countByMonth;
    } else {
      const countByMonth = revenue?.reduce((acc, item) => {
        const { month, expenses } = item;
        if (!acc[month]) {
          acc[month] = 0;
        }
        acc[month] += expenses;
        return acc;
      }, {});

      return countByMonth;
    }
  }

  const handleMonthChange = (date) => {
    const formattedMonth = date?.toLocaleString("en-US", { month: "long" });
    setSelectedMonth(date);
    console.log("Selected month 0 :", formattedMonth);
  };

  const revenusCounts = countRevenueByMonth(revenue, selectedMonth);
  console.log("🚀 ", selectedMonth);
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
        data: dataValues,
      },
    ],
  };

  const clearMonthSelection = () => {
    setSelectedMonth(null);
  };

  console.log("Chart data:", data);

  return (
    <div className="Bar_chart">
      <div className="buttonss">
        <DatePicker
          className="month_selector"
          selected={selectedMonth}
          onChange={handleMonthChange}
          showMonthYearPicker
          dateFormat="MMMM"
          placeholderText="Select month"
          locale="en-US"
        />
        <button className="clear_butt" onClick={clearMonthSelection}>
          Clear
        </button>
      </div>
      <Bar data={data} />
    </div>
  );
};

export default BarChart;
