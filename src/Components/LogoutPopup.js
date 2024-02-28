import React from 'react'
import styles from "./../Styles/LogoutPopup.module.css";
import { useNavigate } from "react-router-dom";
import BASEURL from "../constant/baseurl.js";
import axios from "axios";

const LogoutPopup = ({logOutPop}) => {
  // console.log(logOutPop)

  const navigate = useNavigate();

  const logOutUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASEURL}/api/auth/logout`,{}, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, 'response')
      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };



  return (
    <div className={styles.logoutMainSec}>
      <div className={styles.logoutBG}></div>
      <div className={styles.logoutBox}>
          <p>Are you sure want to Logout?</p>
          <button className={`${styles.delTskBtn} ${styles.saveBtn}`} onClick={logOutUserData}>Yes, Logout </button>
          <button className={styles.logOutBtn} onClick={logOutPop}>Cancle</button>
      </div>
    </div>
  )
}

export default LogoutPopup;