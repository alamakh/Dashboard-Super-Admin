import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import "./index.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import enUS from "date-fns/locale/en-US";


registerLocale("en-US", enUS);
setDefaultLocale("en-US");


const PieChart = () => {

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


  function countCompaniesByYear(revenue, selectedMonth) {
    if(selectedMonth){
      const filteredRevenue = revenue?.filter(
        (item) => item?.month?.toLowerCase() === selectedMonth?.toLocaleString("en-US", { month: "long" })?.toLowerCase()
      );
    const countByYear = filteredRevenue.reduce((acc, item) => {
      const { month, company_name } = item;
      if (!acc[month]) {
        acc[month] = new Set();
      }
      acc[month].add(company_name);
      return acc;
    }, {});
  
    const result = {};
    for (const month in countByYear) {
      result[month] = countByYear[month].size;
    }
  
    return result;
  }
  else{
    const countByYear = revenue.reduce((acc, item) => {
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
}
  
  const companyCounts = countCompaniesByYear(revenue, selectedMonth);
  console.log("rrr", companyCounts);
  const labels = Object.keys(companyCounts);
  const dataValues = Object.values(companyCounts);
  
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Number Of Company Per Year",
        backgroundColor: ["rgb(143, 192, 224)", "rgb(223, 137, 171)", "rgb(220, 137, 223)","rgb(155, 234, 218)"],
        borderColor: "rgb(0,0,0)",
        data: dataValues,
      },
    ],
  };

  const handleMonthChange = (date) => {
    const formattedMonth = date?.toLocaleString("en-US", { month: "long" });
    setSelectedMonth(date);
    console.log("Selected month 0 :", formattedMonth);
  };

  const clearMonthSelection = () => {
    setSelectedMonth(null);
  };
  return (
    <div className="pie_chart">
      <h3 className="pie_label">Number Of Company Per Year</h3>
      <div className="buttonsss">
      <DatePicker
                className="month_selector"
                selected={selectedMonth}
                onChange={handleMonthChange}
                showMonthYearPicker
                dateFormat="MMMM"
                placeholderText="Select month"
                locale="en-US"
      />
      <button className="clear_butt" onClick={clearMonthSelection}>Clear</button>
      </div>
      <Pie data={data} />
    </div>
  );
};
export default PieChart;
