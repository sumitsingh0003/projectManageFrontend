import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import styles from "../Styles/Auth.module.css";
import emailIcon from "../Assets/Icons/mail.png";
import lockIcon from "../Assets/Icons/lock.png";
import wlcimg from "../Assets/Images/welcomeRobot.png";
import user from "../Assets/Icons/user.png";
import OpenEye from "../Assets/Icons/eye.png";
import CloseEye from "../Assets/Icons/closeEye.png";
import BASEURL from "../constant/baseurl.js";
import LoadingGif from "../Assets/Images/loading-gif.gif";

const Register = () => {
  const navigate = useNavigate();
  const [showPswd, setShowPswd] = useState(false);
  const [showC_Pswd, setShowC_Pswd] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [errData, setErrData] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const changeLoadingStae = () => {
    setTimeout(() => {
      setLoadingState(false);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState(true);
    changeLoadingStae();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      return setErrData(true);
    }
    if (!isValidEmail(email)) {
      setEmailError("Email is invalid");
      return; // Stop execution if email is invalid
    } else {
      setEmailError("");
    }
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const response = await axios.post(
        `${BASEURL}/api/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("token", data.token);
        // const tokenExpirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours in milliseconds
        // localStorage.setItem("token", JSON.stringify({ value: data.token, expiration: tokenExpirationTime }));

        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setEmailError("");
        navigate("/dashboard");
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
      if (error.response && error.response.status === 401) {
        alert("Invalid Details");
      } else if (error.response && error.response.status === 404) {
        alert("Internal Server Error");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className={styles.mainSec}>
      <div className={styles.parentBox}>
        <div className={styles.leftSideSec}>
          <div className={styles.rgstrPageImgBox}>
            <img src={wlcimg} alt="Robot" />
            <h4>Welcome aboard, my friend</h4>
            <p>Just a couple of clicks and we start</p>
          </div>
        </div>
        <div className={styles.rightSideSec}>
          <div className={`${styles.innerSec} ${styles.rgstr_bx}`}>
            <h2>Register</h2>
            <div className={styles.formSec}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formField}>
                  <img src={user} alt="user" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                {errData && formData.name.length === 0 ? (
                  <p className={styles.errField}>Please Enter the Name</p>
                ) : (
                  ""
                )}

                <div className={styles.formField}>
                  <img src={emailIcon} alt="email" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                {errData && formData.email.length === 0 ? (
                  <p className={styles.errField}>Please Enter the Email</p>
                ) : (
                  ""
                )}
                {emailError === "" ? (
                  ""
                ) : (
                  <p className={styles.errField}>{emailError}</p>
                )}

                <div className={styles.formField}>
                  <img src={lockIcon} alt="lock" />
                  <input
                    type={`${showPswd ? "text" : "password"}`}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
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
                {errData && formData.password.length === 0 ? (
                  <p className={styles.errField}>Please Enter the Password</p>
                ) : (
                  ""
                )}

                <div className={styles.formField}>
                  <img src={lockIcon} alt="lock" />
                  <input
                    type={`${showC_Pswd ? "text" : "password"}`}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
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
                {errData && formData.confirmPassword.length === 0 ? (
                  <p className={styles.errField}>Please Re-enter the Password</p>
                ) : (
                  ""
                )}
                {loadingState ? (
                  <img
                    src={LoadingGif}
                    alt="Loading Gif"
                    className="loadingGif compoGif"
                  />
                ) : (
                  <button className={styles.submtBtn} type="submit">
                    Register
                  </button>
                )}
              </form>
              <span>Already have an account?</span>
              <button className={styles.routPageBtn} onClick={handleLoginClick}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
