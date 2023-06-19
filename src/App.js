import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Admins from "./scenes/Admins";
import Users from "./scenes/Users";
import Message from "./scenes/msg";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import SignInSuperAdmin from "./scenes/login/index";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import checkTokenExpiration from "./VerifyTokenExpiration";

function App() {
  const token = localStorage.getItem("token");
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    checkTokenExpiration();
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {token && window.location.pathname !== "/" && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {token && window.location.pathname !== "/" && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admins" element={<Admins />} />
              <Route path="/users" element={<Users />} />
              <Route path="/messages" element={<Message />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/LineChart" element={<LineChart />} />
              <Route path="/BarChart" element={<BarChart />} />
              <Route path="/PieChart" element={<PieChart />} />
              <Route path="/" exact element={<SignInSuperAdmin />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
