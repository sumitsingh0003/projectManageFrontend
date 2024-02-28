import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASEURL from "../constant/baseurl.js";
import axios from "axios";
import styles from "../Styles/PublicPage.module.css";
import codesandbox from "../Assets/Icons/codesandbox.png";

const PublicPage = () => {
  const navigate = useNavigate();
  const { shareLink } = useParams();
  const [quizData, setQuizData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASEURL}/api/task/shared-task/${shareLink}`
        );
        setQuizData([response.data]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "2-digit" };
    const formattedDate = date
      .toLocaleDateString("en-US", options)
      .toUpperCase();
    return formattedDate.replace(/\s/, " ");
  };

  const curDateColor = (dateString) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const currentDate = new Date();
    return dueDate <= currentDate;
  };

  const handleHomeClick = () => {
    navigate("/dashboard");
  };

  const checkInput = () => {};

  return (
    <div className={styles.mainDashboard}>
      <div className={styles.leftSideBar_publicPage}>
        <div className={styles.sideBarTitle} onClick={handleHomeClick}>
          <img src={codesandbox} alt="titleIcon" />
          <h2>Pro Manage</h2>
        </div>
      </div>
      <div className={styles.rightPageSec}>
        <div className={styles.publicPageItem}>
          <div className={styles.itemsSec}>
            {quizData.map((item, index) => {
              let priorityStyle;
              switch (item.priority) {
                case "low priority":
                  priorityStyle = { backgroundColor: "#63c05b" };
                  break;
                case "moderate priority":
                  priorityStyle = { backgroundColor: "#18b0ff" };
                  break;
                case "high priority":
                  priorityStyle = { backgroundColor: "#ff2473" };
                  break;
                default:
                  priorityStyle = {};
              }
              return (
                <div className={styles.itemMainBox} key={index}>
                  <div className={styles.itemBoxPrity}>
                    <div className={styles.itemBoxPritytitle}>
                      <div
                        className={styles.priorityDots}
                        style={priorityStyle}
                      ></div>
                      <p>{item.priority}</p>
                    </div>
                    <div className={styles.itemBoxPrityIcons}></div>
                  </div>
                  <h3>{item.title}</h3>
                  <div className={styles.itemBoxTitle}>
                    <p>Checklist (1/{item.checklist.length})</p>
                  </div>
                  <div className={styles.tasklisting}>
                    <ul>
                      {item.checklist.map((val, indx) => {
                        return (
                          <li key={indx}>
                            <input
                              type="checkbox"
                              checked={val.status}
                              onChange={checkInput}
                            />
                            {val.item}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className={styles.chooseTaskStatus}>
                    <div>
                      {item.dueDate === null ? (
                        ""
                      ) : (
                        <>
                          <span>Duo Date</span>
                          <span
                            className={styles.dateStatus}
                            style={{
                              backgroundColor: curDateColor(item.dueDate)
                                ? "#cf3636"
                                : "#eeecec",
                              color: curDateColor(item.dueDate)
                                ? "#fff"
                                : "#000",
                            }}
                          >
                            {formatDate(item.dueDate)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPage;
