import React,{useEffect,useState} from "react";
import jwtDecode from 'jwt-decode';
import axios from "axios";

function checkTokenExpiration() {
// Add Axios interceptor
axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        // Decode the token to check expiration
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // Token has expired, remove it from local storage
          localStorage.removeItem('token');
          window.location = "/"
          // Perform any additional logout actions or redirects
          // e.g., redirect to the login page or show a logout message
          // logout();
        } else {
          // Token is still valid, add it to the request headers
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
        return Promise.reject(error);
      }
    );
}

export default checkTokenExpiration;