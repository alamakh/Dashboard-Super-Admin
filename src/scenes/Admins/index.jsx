// import { Box, Typography, useTheme } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { tokens } from "../../theme";
// import { mockDataTeam } from "../../data/mockData";
// import Header from "../../components/Header";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Avatar from "@mui/material/Avatar";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { toast, ToastContainer } from "react-toastify";
import "./index.css";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [adminCount, setAdminCount] = useState(0);
  const [popup, setPopup] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [search, setSearch] = useState("");

  const toggleModel = (admin) => {
    setSelectedAdmin(admin);
    setPopup(!popup);
    console.log("gggg", popup);
  };

  if (popup) {
    document.body.classList.add("active-popup");
  } else {
    document.body.classList.remove("active-popup");
  }

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "http://localhost:8080/api/adminRouters/getAll"
      );
      setAdmins(response.data?.admins);
      setAdminCount(response.data.admins.length);
    }
    fetchData();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(admins.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentAdmins = admins.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDelete = (selectedAdmin) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Admin ?"
    );
    if (!confirmed) {
      return;
    }
    axios
      .delete(
        `http://localhost:8080/api/adminRouters/deleteadmin/${selectedAdmin._id}`
      )
      .then((response) => {
        setAdminCount(adminCount - 1);
        setAdmins((prevAdmins) =>
          prevAdmins.filter((o) => o._id !== selectedAdmin._id)
        );
        console.log("Deleted", response);
        toast.success("Deleted successfully!");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Deletion failed!");
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="Admin_gird">
        <div className="number_of_admins">
          <p>Number of Admins : {adminCount}</p>
        </div>
        <div className="search_container">
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <form>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                className="search_input"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </form>
          </Search>
        </div>
        <div className="Admin">
          {currentAdmins.length > 0 ? (
            currentAdmins
              .filter((selectedAdmin) => {
                return search.toLowerCase() === ""
                  ? selectedAdmin
                  : selectedAdmin.email.toLowerCase().includes(search);
              })
              .map((selectedAdmin) => (
                <div className="Admin_container" key={selectedAdmin._id}>
                  <div className="Admin_infromation">
                    <div className="Admin_avatar">
                      <Avatar src="/broken-image.jpg" />
                    </div>

                    <div className="Admin_email">{selectedAdmin.email}</div>
                  </div>
                  <div className="buttons">
                    <button
                      className="button_display"
                      type="submit"
                      onClick={() => toggleModel(selectedAdmin)}
                    >
                      Display
                    </button>
                    <button
                      className="button_display"
                      type="submit"
                      onClick={() => handleDelete(selectedAdmin)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div>No Admin to display</div>
          )}
        </div>
        <div className="pagination_container">
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </div>
      </div>
      {popup && (
        <div className="popup_container" style={{ zIndex: "10" }}>
          <div className="overlay" onClick={() => toggleModel(null)}></div>
          <div className="popu_content">
            <div className="admin_info">
              <table>
                Email : <div className="admin_data">{selectedAdmin?.email}</div>
                Type of user :
                <div className="admin_data">{selectedAdmin?.TypeOfUser}</div>
                Name :<div className="admin_data"> {selectedAdmin?.Name}</div>
                Country :{" "}
                <div className="admin_data">{selectedAdmin?.country}</div>
              </table>
              <table>
                Town :<div className="admin_data"> {selectedAdmin?.town}</div>
                Adresse :{" "}
                <div className="admin_data">{selectedAdmin?.adresse}</div>
                Zipcode :{" "}
                <div className="admin_data">{selectedAdmin?.Zipcode}</div>
                phone : <div className="admin_data">{selectedAdmin?.Phone}</div>
              </table>
            </div>

            <button
              className="close_popup"
              type="button"
              onClick={() => toggleModel(null)}
            >
              close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Admins;
