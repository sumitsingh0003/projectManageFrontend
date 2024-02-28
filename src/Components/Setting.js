import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASEURL from "../constant/baseurl.js";
import LeftSideBar from './LeftSideBar';
import styles from "../Styles/Setting.module.css";
import lockIcon from "../Assets/Icons/lock.png";
import OpenEye from "../Assets/Icons/eye.png";
import CloseEye from "../Assets/Icons/closeEye.png";
import user from "../Assets/Icons/user.png";
import LogoutPopup from "./LogoutPopup";

const Setting = () => {
  const navigate = useNavigate();
  const [showPswd, setShowPswd] = useState(false);
  const [showC_Pswd, setShowC_Pswd] = useState(false);
  const [userId, setUserId] = useState({ _id: "" });
  const [userData, setUserData] = useState({ name: "" });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getSingleUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASEURL}/api/auth/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        setUserData({ name: data.name });
        setUserId({ _id: data._id });
      } else {
        console.error("Errors:", data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASEURL}/api/auth/update-user`,
        { _id:userId, name: userData.name, oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        getSingleUserData()
        setSuccessMessage("Your details have been updated successfully");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        console.error("Error:", response.data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/login");
    }
    getSingleUserData();
     // eslint-disable-next-line
  }, []);


  
  // Get Current Date
  const date = new Date();
  const day = date.getDate();
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    date
  );
  const year = date.getFullYear();
  function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
  const ordinalSuffix = getOrdinalSuffix(day);
  const formattedDate = `${day}${ordinalSuffix} ${month}, ${year}`;


  const [showDeleteBox, setShowDeleteBox] = useState(false);

  const logOutUser = async () => {
    setShowDeleteBox(!showDeleteBox);
  };

  return (
    <>

      <LeftSideBar logOutPop={logOutUser} />

      <div className={styles.mainDashboard}>
        <div className={styles.rightPageSec}>
          <div className={styles.rightPageNav}>
            <h2>Settings</h2>
            <p>{formattedDate}</p>
          </div>

          <div className={styles.settingFormBox}>
            <div className={styles.formSec}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formField}>
                  <img src={user} alt="user" />
                  <input
                    type="text"
                    placeholder="Name"
                    value={userData.name}
                    onChange={(e) =>
                      setUserData({ ...userData, name: e.target.value })
                    }
                  />
                </div>
                <div className={styles.formField}>
                  <img src={lockIcon} alt="lock" />
                  <input
                    type={`${showPswd ? "text" : "password"}`}
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <div className={styles.showPsdwdImg}>
                    {showPswd ? (
                      <img
                        src={CloseEye}
                        alt="eye"
                        onClick={() => setShowPswd(!true)}
                      />
                    ) : (
                      <img
                        src={OpenEye}
                        alt="eye"
                        onClick={() => setShowPswd(!false)}
                      />
                    )}
                  </div>
                </div>
                <div className={styles.formField}>
                  <img src={lockIcon} alt="lock" />
                  <input
                   type={`${showC_Pswd ? "text" : "password"}`}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                   <div className={styles.showPsdwdImg}>
                   {showC_Pswd ? (
                      <img
                        src={CloseEye}
                        alt="eye"
                        onClick={() => setShowC_Pswd(!true)}
                      />
                    ) : (
                      <img
                        src={OpenEye}
                        alt="eye"
                        onClick={() => setShowC_Pswd(!false)}
                      />
                    )}
                  </div>
                </div>
                <button type="submit" className={styles.submtBtn}>
                  Update
                </button>
              </form>
              {successMessage && (
                <div className={styles.successMessage}>
                  {successMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteBox && (
        <LogoutPopup logOutPop={logOutUser} />
      )}
    </>
  );
};

export default Setting;
