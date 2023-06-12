import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { toast, ToastContainer } from "react-toastify";
import "./index.css";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [popup, setPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  const toggleModel = (user) => {
    setSelectedUser(user);
    setPopup(!popup);
    console.log("gggg", popup);
  };

  if (popup) {
    document.body.classList.add("activee-popup");
  } else {
    document.body.classList.remove("activee-popup");
  }

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "http://localhost:8080/api/candidatRouters/getAll"
      );
      setUsers(response.data?.users);
      setUserCount(response.data.users.length);
    }
    fetchData();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDelete = (selectedUser) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this candidat ?"
    );
    if (!confirmed) {
      return;
    }
    axios
      .delete(
        `http://localhost:8080/api/candidatRouters/deleteuser/${selectedUser._id}`
      )
      .then((response) => {
        setUserCount(userCount - 1);
        setUsers((prevUsers) =>
          prevUsers.filter((o) => o._id !== selectedUser._id)
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
      <div className="users_gird">
        <div className="number_of_users">
          <p>Number of Candidats : {userCount}</p>
        </div>
        <div className="search_container">
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <form>
              <StyledInputBase
                placeholder="Search…"
                className="search_input"
                inputProps={{ "aria-label": "search" }}
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </form>
          </Search>
        </div>
        <div className="users">
          {currentUsers.length > 0 ? (
            currentUsers
              .filter((selectedUser) => {
                return search.toLowerCase() === ""
                  ? selectedUser
                  : selectedUser.email.toLowerCase().includes(search);
              })
              .map((selectedUser) => (
                <div className="users_container" key={selectedUser._id}>
                  <div className="users_infromation">
                    <div className="users_avatar">
                      <Avatar src="/broken-image.jpg" />
                    </div>

                    <div className="users_email">{selectedUser.email}</div>
                  </div>
                  <div className="buttons">
                    <button
                      className="button_display"
                      type="submit"
                      onClick={() => toggleModel(selectedUser)}
                    >
                      Display
                    </button>
                    <button
                      className="button_delete"
                      type="submit"
                      onClick={() => handleDelete(selectedUser)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div>No users to display</div>
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
        <div className="popup_container" style={{ zIndex: "1" }}>
          <div className="overlay" onClick={() => toggleModel(null)}></div>
          <div className="popu_content">
            <div className="user_info">
              <table>
              Email :<div className="user_data"> {selectedUser?.email}</div>
              First Name :
              <div className="user_data">{selectedUser?.firstName}</div>Last
              Name :<div className="user_data">{selectedUser?.lastName}</div>
              Country :<div className="user_data"> {selectedUser?.country}</div>
              Town : <div className="user_data">{selectedUser?.town}</div></table>
              <table>
              Address :<div className="user_data"> {selectedUser?.address}</div>
              Age :<div className="user_data"> {selectedUser?.age}</div>
              Phone : <div className="user_data">{selectedUser?.phone}</div>
              Gender : <div className="user_data">{selectedUser?.gender}</div>
              Birthday :{" "}
              <div className="user_data">{selectedUser?.birthDate}</div>
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

export default Users;
