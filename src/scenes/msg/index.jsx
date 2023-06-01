import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
// import DatePicker from "react-datepicker";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

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

const Message = ({ email }) => {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState([]);
  // const [date, setDate] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "http://localhost:8080/api/contactRouter/getContactBySuperAdmin"
      );
      setMessage(response.data.contact);
      console.log("hjiiii", response.data.contact);
      console.log("hjiiii", response);
    }
    fetchData();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(message.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentMessage = message.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleReply = (to) => {
    const mailtoLink = `mailto:${to}`;
    window.open(mailtoLink);
  };
  

  return (
    <div className="s_container">
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
      <TableContainer>
        <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">PhoneNumber</TableCell>
                <TableCell align="right">Message</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentMessage.length > 0 ? (
                currentMessage
                  .filter((messag) => {
                    const searchValue = search.toLowerCase();
                    const resultValue = messag?.email;
                    return searchValue === ""
                      ? message
                      : resultValue >= parseInt(searchValue);
                  })
                  .map((messag, _id) => (
                    <TableRow key={messag._id}>
                      <TableCell component="th" scope="row">
                        {messag.email}
                      </TableCell>
                      <TableCell align="right">{messag.Name}</TableCell>
                      <TableCell align="right">{messag.phoneNumber}</TableCell>
                      <TableCell align="right">{messag.message} </TableCell>
                      <TableCell align="right">{messag.date}</TableCell>
                      <TableCell align="right"> <button onClick={() => handleReply(messag.email)}> Répondre </button></TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No messages to display</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
      </TableContainer>
    </div>
  );
};

export default Message;
