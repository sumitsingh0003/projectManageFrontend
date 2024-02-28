import React from "react";
import styles from "./../Styles/Auth.module.css";
import BASEURL from "../constant/baseurl.js";
import axios from "axios";

const DeletePopup = ({ deleteItemID, deletePop }) => {
  // console.log(deleteItemID, deletePop)

  const deleteItemBox = async (itemId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${BASEURL}/api/task/delete-task/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        deletePop();
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <div className={styles.deleteTaskMainSec}>
        <div className={styles.delTaskBG}></div>
        <div className={styles.delTaskBGBox}>
          <p>Are you sure want to Delete?</p>
          <button
            className={`${styles.delTskBtn} ${styles.saveBtn}`}
            onClick={() => deleteItemBox(deleteItemID)}
          >
            Yes, Delete
          </button>
          <button className={styles.delTskBtn} onClick={deletePop}>
            Cancle
          </button>
        </div>
      </div>
    </>
  );
};

export default DeletePopup;
