import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const AccountSuperAdmin = () => {
  const SuperAdmin = localStorage.getItem("token");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [type, setType] = useState("password");
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!SuperAdmin) {
      try {
        const { data } = await axios.post(
          "http://localhost:8080/api/superAdminRouters/signInSuperAdmin",
          formData
        );
        setIsSuperAdmin(true);
        localStorage.setItem("isSuperAdmin", true);
        localStorage.setItem("token", data.Newdata);
        localStorage.setItem("id", data._id);
        localStorage.setItem("firstName", data.userName);

        window.location = "/dashboard";
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          setError(error.response.data.message);
        }
      }
    } else {
      alert("you are already connected");
    }
  };

  const handleToggle = () => {
    setType(type === "password" ? "text" : "password");
  };

  useEffect(() => {
    console.log("isSuperAdmin", isSuperAdmin);
  }, [isSuperAdmin]);

  return (
    <div className="login_container">
      <div className="Account_from_container">
        <div className="left">
          <form onSubmit={handleSubmit}>
            <h1 className="title">Account Super_Admin</h1>
            <label className="user_name">User Name : </label>
            <input
              type="text"
              placeholder="user name"
              name="userName"
              onChange={handleChange}
              value={formData.userName}
              required
              className="input"
            />
            <br />
            <label className="password">Password : </label>
            <input
              type={type}
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              required
              className="input"
            />
            <div className="afficherPassword">
              <input type="checkbox" onClick={handleToggle} />
              show password
            </div>
            {error && <div className="error_msg">{error}</div>}
            <button type="submit" className="btn">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSuperAdmin;
