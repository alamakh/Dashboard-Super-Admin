import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import { useState, useEffect } from "react";
import axios from "axios";
import BarChart from "../../components/BarChart";
import LineChart from "../../components/LineChart";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [pageviews, setPageviews] = useState();
  const [visits, setVisits] = useState();
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  function updateCounter() {
    fetch('http://localhost:8080/api')
      .then(res => res.json())
      .then(data => {
        setPageviews(data?.pageviews);
        setVisits(data?.visits);
        sessionStorage.setItem('visit', data?.visits);
        sessionStorage.setItem('pageviews', data?.pageviews);
        console.log("data", data);
      });
  }

  /* This haroun talking from my branch 'haroun' hope you are doing well all of you and thanks */

  useEffect(() => {
    updateCounter();

    // Fetch data every 10 seconds
    const intervalId = setInterval(() => {
      updateCounter();
    }, 1000000);

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "http://localhost:8080/api/adminRouters/getAll"
      );
      setAdminCount(response.data.admins.length);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "http://localhost:8080/api/candidatRouters/getAll"
      );
      setUserCount(response.data.users.length);
    }
    fetchData();
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box gridColumn="span 4" backgroundColor={colors.primary[400]}>
          <StatBox
            title={adminCount}
            subtitle="Admins"
            progress="0.75"
            increase="+14%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box gridColumn="span 4" backgroundColor={colors.primary[400]}>
          <StatBox
            title={userCount}
            subtitle="Candidats"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box gridColumn="span 4" backgroundColor={colors.primary[400]}>
          <StatBox
            title={pageviews}
            subtitle="Views"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box gridColumn="span 8" gridRow="span 2" backgroundColor={colors.primary[400]}>
          <LineChart isDashboard={true} />
        </Box>

        {/* ROW 3 */}
        <Box gridColumn="span 4" backgroundColor={colors.primary[400]}>
          <Typography
            variant="h5"
            fontWeight="600"
            color={colors.greenAccent[500]}
            sx={{ padding: "30px 30px 0 30px", marginBottom: "20px" }}
          >
            Revenue By Month
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart className="pie" isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
