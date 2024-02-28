// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  
import styles from "../Styles/Auth.module.css";
import emailIcon from "../Assets/Icons/mail.png";
import lockIcon from "../Assets/Icons/lock.png";
import OpenEye from "../Assets/Icons/eye.png";
import CloseEye from "../Assets/Icons/closeEye.png";
import wlcimg from "../Assets/Images/welcomeRobot.png";
import BASEURL from "../constant/baseurl.js";
import LoadingGif from "../Assets/Images/loading-gif.gif";


const Login = () => {
  const navigate = useNavigate();
  const [showPswd, setShowPswd] = useState(false);
  const [errData, setErrData] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const changeLoadingStae = () =>{
    setTimeout(() => {
      setLoadingState(false)
    }, 2000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingState(true)
    changeLoadingStae()
    const { email, password } = formData;

    if (!email || !password) {
      return setErrData(true);
    }

    if (!isValidEmail(email)) {
      return setEmailError("Email is invalid");
    } else {
      setEmailError("");
    }

    try {
      const response = await axios.post(`${BASEURL}/api/auth/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("token", data.token);
        // const tokenExpirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours in milliseconds
        // localStorage.setItem("token", JSON.stringify({ value: data.token, expiration: tokenExpirationTime }));
        setFormData({ email: "", password: "" });
        setEmailError("");
        navigate("/dashboard");
      } else {
        console.error("Errors:", data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
      if (error.message === "Request failed with status code 401") {
        return alert("Invalid Details");
      } else if (error.message === "Request failed with status code 404") {
        return alert("Internal Server Error");
      } else {
        alert(error.message);
      }
    }
  };

   
  // function isTokenExpired() {
  //   const token = localStorage.getItem("token");
  //   if (!token) return true; 
  //   const { expiration } = JSON.parse(token);
  //   return expiration < Date.now(); 
  // }
  
  // if (!isTokenExpired()) {
  //   // eslint-disable-next-line 
  //   const { value } = JSON.parse(localStorage.getItem("token"));
  // } else {
  //   localStorage.removeItem("token");
  // }

  const handleRegisterClick = () => {
    navigate("/");
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
          <div className={styles.innerSec}>
            <h2>Login</h2>
            <div className={styles.formSec}>
              <form onSubmit={handleSubmit}>
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
                  <p className={styles.errField}>Please fill the field.</p>
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
                  <p className={styles.errField}>Please fill the field.</p>
                ) : (
                  ""
                )}
                {loadingState? <img src={LoadingGif} alt="Loading Gif" className="loadingGif compoGif" /> :
                    <button type="submit" className={styles.submtBtn}>
                    Log in
                  </button>
                }
              </form>
              <span>Don't have an account yet?</span>
              <button
                className={styles.routPageBtn}
                onClick={handleRegisterClick}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
