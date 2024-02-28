import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASEURL from "../constant/baseurl.js";
import LeftSideBar from "./LeftSideBar";
import CreateTaskPopup from "./CreateTaskPopup";
import BacklogsComponent from "./Backlogs.js";
import TodoItemComponent from "./TodoItem.js";
import DoneItemComponent from "./DoneItem.js";
import ProgressItemComponent from "./ProgressItem.js";
import styles from "../Styles/Dashboard.module.css";
import LogoutPopup from "./LogoutPopup";
import LoadingGif from "../Assets/Images/loading-gif.gif";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [openTaskBox, setOpenTaskBox] = useState(false);
  const [showFilterTask, setShowFilterTask] = useState(false);
  const [tasksData, setTasksData] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [timeFrame, setTimeFrame] = useState('This Week');
  const [showCheckList, setShowCheckList] = useState(-1);
  const [showSecondCheckList, setShowSecondCheckList] = useState(-1);
  const [showThirdCheckList, setShowThirdCheckList] = useState(-1);
  const [showFourthCheckList, setSshowFourthCheckList] = useState(-1);


  const changeLoadingStae = () =>{
    setTimeout(() => {
      setLoadingState(false)
    }, 2000);
  }


  const getSingleUserData = async () => {
    setLoadingState(true)
    changeLoadingStae()
    try {
      // const { value } = JSON.parse(localStorage.getItem("token"));
      const token = localStorage.getItem("token");
      const userData = await axios.get(`${BASEURL}/api/auth/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = userData.data.name;

      if (userData.status === 200 || userData.status === 201) {
        setUserName(data);
      } else {
        console.error("Errors:", data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

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


  const checkListItemsBox = (id) => {
    if (id === showCheckList) {
      setShowCheckList(-1);
    }else {
      setShowCheckList(id);
    }
  };

  const checkListsecondItemsBox = (id) => {
    if (id === showSecondCheckList) {
      setShowSecondCheckList(-1);
    }else {
      setShowSecondCheckList(id);
    }
  };

  const checkListThirdItemsBox = (id) => {
    if (id === showThirdCheckList) {
      setShowThirdCheckList(-1);
    }else {
      setShowThirdCheckList(id);
    }
  };

  const checkListFourthItemsBox = (id) => {
    if (id === showFourthCheckList) {
      setSshowFourthCheckList(-1);
    }else {
      setSshowFourthCheckList(id);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/login");
    }
    getSingleUserData();
    getTaskData();

    // const funcData = getFilteredTasks()
    // setGetTasksData(funcData)

    // eslint-disable-next-line
  }, [timeFrame]);

  const showPopupFormBox = () => {
    setOpenTaskBox(!openTaskBox);
  };

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

  const getFilteredTasks = () => {
    const today = new Date();
    const tasksToShow = [];
  
    let startDate, endDate;
    switch (timeFrame) {
      case 'Today':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        break;
      case 'This Week':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - today.getDay());
        endDate = new Date(today);
        endDate.setDate(endDate.getDate() + (6 - today.getDay()));
        break;
      case 'This Month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      default:
        startDate = null;
        endDate = null;
    }
  
    for (let i = 0; i < tasksData.length; i++) {
      const taskDate = new Date(tasksData[i].createdOn);
      if (
        (timeFrame === 'Today' && taskDate >= startDate && taskDate < endDate) || 
        (startDate && endDate && taskDate >= startDate && taskDate <= endDate)
      ) {
        tasksToShow.push(tasksData[i]);
      }
    }
  
    return tasksToShow;
  };
  
  
  const handleTimeFrameChange = (selectedTimeFrame) => {
    setTimeFrame(selectedTimeFrame);
    setShowFilterTask(!showFilterTask)
  };


  return (
    <div className={styles.mainDashboard}>
      <LeftSideBar logOutPop={logOutUser}/>

      <div className={styles.rightPageSec}>
      <div className="mainHeader">     
        <div className={styles.rightPageNav}>
          <h2>Welcome! {loadingState? <img src={LoadingGif} alt="Loading Gif" className="loadingGif" /> : userName }</h2>
          <p>{formattedDate}</p>
        </div>

        <div className={styles.rightPageTitle}>
          <h1>Board</h1>
          <div className={styles.filterItems}>
            <span onClick={() => setShowFilterTask(!showFilterTask)}>
            {timeFrame}
              {showFilterTask ? (
                <i className="fa fa-angle-up" aria-hidden="true"></i>
              ) : (
                <i className="fa fa-angle-down" aria-hidden="true"></i>
              )}
            </span>

            {showFilterTask ? (
              <ul>
                <li onClick={() => handleTimeFrameChange('Today')}>Today</li>
                <li onClick={() => handleTimeFrameChange('This Week')}>This Week</li>
                <li onClick={() => handleTimeFrameChange('This Month')}>This Month</li>
              </ul>
            ) : (
              ""
            )}
          </div>
        </div>
        </div>
        <div className={styles.allMainSections}>

          <div className={styles.itemsSec}>
            <div className={styles.itemSecTitle}>
              <p>Backlog</p>
              <div className={styles.itemSecTitleIcons} onClick={()=>checkListItemsBox(0)}>
                <i className="fa fa-clone" aria-hidden="true"></i>
              </div>
            </div>

            <div className={styles.itemsScrollSectios}>
            {loadingState? <img src={LoadingGif} alt="Loading Gif" className="loadingGif compoGif" /> :
              <BacklogsComponent
               backlogTaskData={getFilteredTasks().filter(task => task.status === "backlog")}
                popUpTaskBox={getTaskData}
                checkFunc={checkListItemsBox}
                checkListCurID={showCheckList}
              />
            }
            </div>
          </div>


          <div className={styles.itemsSec}>
            <div className={styles.itemSecTitle}>
              <p>To do</p>
              <div className={styles.itemSecTitleIcons}>
                <i
                  className="fa fa-plus"
                  style={{ marginRight: "10px" }}
                  onClick={() => setOpenTaskBox(!openTaskBox)}
                  aria-hidden="true"
                ></i>
                <i className="fa fa-clone" aria-hidden="true" onClick={()=>checkListsecondItemsBox(0)}></i>
              </div>
            </div>

            <div className={styles.itemsScrollSectios}>
            {loadingState? <img src={LoadingGif} alt="Loading Gif" className="loadingGif compoGif" /> :
              <TodoItemComponent
                todoTaskData={getFilteredTasks().filter(task => task.status === "todo")}
                popUpTaskBox={getTaskData}
                checkFunc={checkListsecondItemsBox}
                checkListCurID={showSecondCheckList}
              />
            }
            </div>
          </div>


          <div className={styles.itemsSec}>
            <div className={styles.itemSecTitle}>
              <p>In progress</p>
              <div className={styles.itemSecTitleIcons} onClick={()=>checkListThirdItemsBox(0)}>
                <i className="fa fa-clone" aria-hidden="true"></i>
              </div>
            </div>

            <div className={styles.itemsScrollSectios}>
            {loadingState? <img src={LoadingGif} alt="Loading Gif" className="loadingGif compoGif" /> :
              <ProgressItemComponent
                progTaskData={getFilteredTasks().filter(task => task.status === "in_progress")}
                popUpTaskBox={getTaskData}
                checkFunc={checkListThirdItemsBox}
                checkListCurID={showThirdCheckList}
              />
            }
            </div>
          </div>


          <div className={styles.itemsSec}>
            <div className={styles.itemSecTitle}>
              <p>Done</p>
              <div className={styles.itemSecTitleIcons} onClick={()=>checkListFourthItemsBox(0)}>
                <i className="fa fa-clone" aria-hidden="true"></i>
              </div>
            </div>

            <div className={styles.itemsScrollSectios}>
            {loadingState? <img src={LoadingGif} alt="Loading Gif" className="loadingGif compoGif" /> :
              <DoneItemComponent
                doneTaskData={getFilteredTasks().filter(task => task.status === "done")}
                popUpTaskBox={getTaskData}
                checkFunc={checkListFourthItemsBox}
                checkListCurID={showFourthCheckList}
              />
            }
            </div>
          </div>
        </div>
      </div>

      {openTaskBox ? (
        <CreateTaskPopup
          popUpTaskBox={showPopupFormBox}
          runFuncTaskData={getTaskData}
        />
      ) : (
        ""
      )}

      {showDeleteBox && (
        <LogoutPopup logOutPop={logOutUser} />
      )}
    </div>
  );
};

export default Dashboard;
