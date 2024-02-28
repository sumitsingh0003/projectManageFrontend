import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASEURL from "../constant/baseurl.js";
import styles from "../Styles/Analytics.module.css";
import LeftSideBar from "./LeftSideBar";
import LogoutPopup from "./LogoutPopup";

const Analytics = () => {
  const navigate = useNavigate();
  const [tasksData, setTasksData] = useState([]);

  const getTaskData = async () => {
    try {
      const token = localStorage.getItem("token");
      const taskAllData = await axios.get(`${BASEURL}/api/task/all-task`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const taskData = taskAllData.data.data;

      if (taskAllData.status === 200 || taskAllData.status === 201) {
        setTasksData(taskData);
      } else {
        console.error("Errors:", taskData.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // const backlogTasks = tasksData.filter(task => task.status === "backlog");
  // const numberOfBacklogTasks = backlogTasks.length;
  // console.log(numberOfBacklogTasks)

  let backlogTask = 0;
  for (let i = 0; i < tasksData.length; i++) {
    if (tasksData[i].status === "backlog") {
      backlogTask++;
    }
  }
  let todoTask = 0;
  for (let i = 0; i < tasksData.length; i++) {
    if (tasksData[i].status === "todo") {
      todoTask++;
    }
  }
  let progressTask = 0;
  for (let i = 0; i < tasksData.length; i++) {
    if (tasksData[i].status === "in_progress") {
      progressTask++;
    }
  }
  let doneTask = 0;
  for (let i = 0; i < tasksData.length; i++) {
    if (tasksData[i].status === "done") {
      doneTask++;
    }
  }

  let lowPriority = 0;
  for (let i = 0; i < tasksData.length; i++) {
    if (tasksData[i].priority === "low priority") {
      lowPriority++;
    }
  }
  let hiegPriority = 0;
  for (let i = 0; i < tasksData.length; i++) {
    if (tasksData[i].priority === "high priority") {
      hiegPriority++;
    }
  }
  let moderatePriority = 0;
  for (let i = 0; i < tasksData.length; i++) {
    if (tasksData[i].priority === "moderate priority") {
      moderatePriority++;
    }
  }
  let duoDateTask = 0;
  for (let i = 0; i < tasksData.length; i++) {
    if (tasksData[i].dueDate !== null && tasksData[i].dueDate !== "") {
      duoDateTask++;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/login");
    }
    getTaskData();
    // eslint-disable-next-line
  }, []);

  const [showDeleteBox, setShowDeleteBox] = useState(false);

  const logOutUser = async () => {
    setShowDeleteBox(!showDeleteBox);
  };

  return (
    <div className={styles.mainDashboard}>
      <LeftSideBar logOutPop={logOutUser} />

      <div className={styles.rightPageSec}>
        <div className={styles.rightPageNav}>
          <h2>Analytics</h2>
          <p>17th Jan, 2024</p>
        </div>

        <div className={styles.analMainSec}>
          <div className={styles.analTasksBox}>
            <ul>
              <li>
                <div className={styles.itemBoxPrity}>
                  <div className={styles.itemBoxPritytitle}>
                    <div className={styles.priorityDots}></div>
                    <p>Backlog Task</p>
                  </div>
                  <span>{backlogTask}</span>
                </div>
              </li>
              <li>
                <div className={styles.itemBoxPrity}>
                  <div className={styles.itemBoxPritytitle}>
                    <div className={styles.priorityDots}></div>
                    <p>To-Do Task</p>
                  </div>
                  <span>{todoTask}</span>
                </div>
              </li>
              <li>
                <div className={styles.itemBoxPrity}>
                  <div className={styles.itemBoxPritytitle}>
                    <div className={styles.priorityDots}></div>
                    <p>In-Progress Tasks</p>
                  </div>
                  <span>{progressTask}</span>
                </div>
              </li>
              <li>
                <div className={styles.itemBoxPrity}>
                  <div className={styles.itemBoxPritytitle}>
                    <div className={styles.priorityDots}></div>
                    <p>Complete Tasks</p>
                  </div>
                  <span>{doneTask}</span>
                </div>
              </li>
            </ul>
          </div>

          <div className={styles.analTasksBox}>
            <ul>
              <li>
                <div className={styles.itemBoxPrity}>
                  <div className={styles.itemBoxPritytitle}>
                    <div className={styles.priorityDots}></div>
                    <p>Low Priority</p>
                  </div>
                  <span>{lowPriority}</span>
                </div>
              </li>
              <li>
                <div className={styles.itemBoxPrity}>
                  <div className={styles.itemBoxPritytitle}>
                    <div className={styles.priorityDots}></div>
                    <p>Moderate Priority</p>
                  </div>
                  <span>{moderatePriority}</span>
                </div>
              </li>
              <li>
                <div className={styles.itemBoxPrity}>
                  <div className={styles.itemBoxPritytitle}>
                    <div className={styles.priorityDots}></div>
                    <p>High Priority</p>
                  </div>
                  <span>{hiegPriority}</span>
                </div>
              </li>
              <li>
                <div className={styles.itemBoxPrity}>
                  <div className={styles.itemBoxPritytitle}>
                    <div className={styles.priorityDots}></div>
                    <p>Due Date Tasks</p>
                  </div>
                  <span>{duoDateTask}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showDeleteBox && <LogoutPopup logOutPop={logOutUser} />}
    </div>
  );
};

export default Analytics;
