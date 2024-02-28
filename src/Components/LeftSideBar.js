import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../Styles/LeftSideBar.module.css";
import database from "../Assets/Icons/database.png";
import layout from "../Assets/Icons/layout.png";
import setting from "../Assets/Icons/settings.png";
import codesandbox from "../Assets/Icons/codesandbox.png";
import LogoutIcon from "../Assets/Icons/Logout.png";

const LeftSideBar = ({ logOutPop }) => {
  const location = useLocation();

  return (
    <div className={styles.leftSideBar}>
      <div className={styles.sideBarTitle}>
        <img src={codesandbox} alt="titleIcon" />
        <h2>Pro Manage</h2>
      </div>
      <div className={styles.sideBarLinks}>
        <ul>
          <li
            className={location.pathname === "/dashboard" ? styles.active : ""}
          >
            <Link to="/dashboard">
              <img src={layout} alt="titleIcon" />
              <h2>Board</h2>
            </Link>
          </li>
          <li
            className={location.pathname === "/analytics" ? styles.active : ""}
          >
            <Link to="/analytics">
              <img src={database} alt="titleIcon" />
              <h2>Analytics</h2>
            </Link>
          </li>
          <li className={location.pathname === "/setting" ? styles.active : ""}>
            <Link to="/setting">
              <img src={setting} alt="setting" />
              <h2>Settings</h2>
            </Link>
          </li>
        </ul>
      </div>

      <div className={styles.logOutLink} onClick={logOutPop}>
        <img src={LogoutIcon} alt="LogoutIcon" />
        <p> Log Out</p>
      </div>
    </div>
  );
};

export default LeftSideBar;
