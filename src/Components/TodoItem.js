import React, { useState } from "react";
import styles from "../Styles/Dashboard.module.css";
import BASEURL from "../constant/baseurl.js";
import DeletePopup from "./DeletePopup.js";
import EditTaskForm from "./EditTaskForm.js";
import axios from "axios";
import { useEffect } from "react";
const TodoItem = ({
  todoTaskData,
  popUpTaskBox,
  checkFunc,
  checkListCurID,
}) => {
  // console.log(todoTaskData)
  const [showItemBoxIndex, setShowItemBoxIndex] = useState(-1);
  const [showCopyLink, setShowCopyLink] = useState(false);
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [editTaskItemData, setEditTaskItemData] = useState([]);
  const [showEditTaskPopup, setShowEditTaskPopup] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [checkedCount, setCheckedCount] = useState([]);
  const titleItemsBox = (id) => {
    if (id === showItemBoxIndex) {
      setShowItemBoxIndex(-1);
    } else {
      setShowItemBoxIndex(id);
    }
  };

  const editTask = async (taskItemId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${BASEURL}/api/task/single-task/${taskItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        setShowEditTaskPopup(!showEditTaskPopup);
        setEditTaskItemData(data);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const deleteItemBox = async (itemId) => {
    setShowDeleteBox(!showDeleteBox);
    setDeleteId(itemId);
    popUpTaskBox();
  };

  const sharedItemLink = (link) => (event) => {
    event.preventDefault();
    const domainURL =
      window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port ? ":" + window.location.port : "");
    // console.log(domainURL)
    navigator.clipboard.writeText(`${domainURL}/publicpage/${link}`);
    setShowCopyLink(true);
    setShowItemBoxIndex(-1);
    setTimeout(() => {
      setShowCopyLink(false);
    }, 3000);
  };

  const moveBacklogsItem = async (itemData) => {
    const updatedItemData = { ...itemData, status: "backlog" };
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${BASEURL}/api/task/updated-task`,
        updatedItemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        popUpTaskBox();
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const moveProgressItem = async (itemData) => {
    const updatedItemData = { ...itemData, status: "in_progress" };
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${BASEURL}/api/task/updated-task`,
        updatedItemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        popUpTaskBox();
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const moveDoneItem = async (itemData) => {
    const updatedItemData = { ...itemData, status: "done" };
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${BASEURL}/api/task/updated-task`,
        updatedItemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        popUpTaskBox();
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

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

  const closeEditFormBox = () => {
    setShowEditTaskPopup(!showEditTaskPopup);
    popUpTaskBox();
    setShowItemBoxIndex(-1);
  };

  useEffect(() => {
    const trueStatusCounts = todoTaskData.map((task) => {
      const trueCount = task.checklist.filter(
        (item) => item.status === true
      ).length;
      return { title: task.title, trueCount };
    });
    setCheckedCount(trueStatusCounts);
  }, [todoTaskData]);

  const checkInput = () => {};
  return (
    <>
      {todoTaskData.map((item, index) => {
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

              <div className={styles.itemBoxPrityIcons}>
                <i
                  className="fa fa-ellipsis-h"
                  aria-hidden="true"
                  onClick={() => titleItemsBox(index)}
                ></i>
              </div>
              {showItemBoxIndex === index && (
                <div className={styles.itemOptions}>
                  <ul>
                    <li onClick={() => editTask(item._id)}>Edit</li>
                    <li onClick={sharedItemLink(item.shareableLink)}>Share</li>
                    <li onClick={() => deleteItemBox(item._id)}>Delete</li>
                  </ul>
                </div>
              )}
            </div>
            <h3>{item.title}</h3>

            <div className={styles.itemBoxTitle}>
              <p>
                Checklist ({checkedCount[index]?.trueCount || 0}/
                {item.checklist.length})
              </p>

              <div
                className={styles.itemBoxPrityIcons}
                onClick={() => checkFunc(index + 1)}
              >
                {checkListCurID === 0 ? (
                  <i className="fa fa-angle-up" aria-hidden="true"></i>
                ) : checkListCurID === -1 ? (
                  <i className="fa fa-angle-down" aria-hidden="true"></i>
                ) : checkListCurID === index + 1 ? (
                  <i className="fa fa-angle-up" aria-hidden="true"></i>
                ) : (
                  <i className="fa fa-angle-down" aria-hidden="true"></i>
                )}
              </div>
            </div>

            <div className={styles.tasklisting}>
              {checkListCurID === index + 1 && (
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
              )}
              {checkListCurID === 0 && (
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
              )}
            </div>
            <div className={styles.chooseTaskStatus}>
              <div>
                {item.dueDate === null ? (
                  ""
                ) : (
                  <span
                    className={styles.dateStatus}
                    style={{
                      backgroundColor: curDateColor(item.dueDate)
                        ? "#cf3636"
                        : "#eeecec",
                      color: curDateColor(item.dueDate) ? "#fff" : "#000",
                    }}
                  >
                    {formatDate(item.dueDate)}
                  </span>
                )}
              </div>
              <div className={styles.secTaskStatus}>
                <span onClick={() => moveBacklogsItem(item)}>Backlog</span>
                <span onClick={() => moveProgressItem(item)}>Progress</span>
                <span onClick={() => moveDoneItem(item)}>Done</span>
              </div>
            </div>
          </div>
        );
      })}

      {showCopyLink && (
        <div className={styles.copiedBox}>
          <p>Link Copied</p>
          <div
            className={`${styles.deviderLine} ${
              showCopyLink ? styles.fullwidth : ""
            } `}
          ></div>
        </div>
      )}

      {showDeleteBox && (
        <DeletePopup deleteItemID={deleteId} deletePop={deleteItemBox} />
      )}
      {showEditTaskPopup && (
        <EditTaskForm
          taskData={editTaskItemData}
          closeEditForm={closeEditFormBox}
        />
      )}
    </>
  );
};

export default TodoItem;
