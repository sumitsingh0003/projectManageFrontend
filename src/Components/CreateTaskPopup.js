import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";

import styles from "../Styles/CreateTaskPopup.module.css";
import BASEURL from "../constant/baseurl.js";
import axios from "axios";
import DatePicker from "react-datepicker";

const CreateTaskPopup = ({ popUpTaskBox, runFuncTaskData }) => {
  const [errData, setErrData] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    priority: "high priority",
    checklist: [],
    dueDate: "",
  });
  const [checkedCount, setCheckedCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (index) => {
    const updatedChecklist = [...formData.checklist];
    updatedChecklist[index].status = !updatedChecklist[index].status;
    setFormData({ ...formData, checklist: updatedChecklist });

    // Update checked count
    const newCheckedCount = updatedChecklist.filter(
      (item) => item.status
    ).length;
    setCheckedCount(newCheckedCount);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      checklist: [...formData.checklist, { item: "", status: false }],
    });
  };

  const handleRemoveItem = (index) => {
    const updatedChecklist = [...formData.checklist];
    updatedChecklist.splice(index, 1);
    setFormData({ ...formData, checklist: updatedChecklist });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, checklist } = formData;
    if (!title || !checklist.every((item) => item.item.trim() !== "")) {
      return setErrData(true);
    }
    if (checklist.length === 0) {
      return alert("Please add Task");
    }
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${BASEURL}/api/task/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("3");
      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        setFormData({
          title: "",
          priority: "high priority",
          checklist: [{ item: "", status: false }],
          dueDate: "",
        });
        popUpTaskBox();
        runFuncTaskData();
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
      console.log(formData);
    }
  };

  return (
    <div className={styles.mainPopup}>
      <div className={styles.popUpBg} onClick={popUpTaskBox}></div>
      <div className={styles.popUpForm}>
        <form onSubmit={handleSubmit}>
          <div className={styles.enterTitle}>
            <label>
              Title<sup>*</sup>
            </label>
            <input
              type="text"
              placeholder="Enter Task Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
            {errData && formData.title.length === 0 ? (
              <p className={styles.errField}>Please fill the field.</p>
            ) : (
              ""
            )}
          </div>

          <div className={styles.formSelectPriority}>
            <span>
              Select Priority<sup>*</sup>
            </span>

            <div className={styles.radioPriority}>
              <input
                type="radio"
                id="contactChoice1"
                name="priority"
                value="high priority"
                checked={formData.priority === "high priority"}
                onChange={handleInputChange}
              />
              <div className={`${styles.radioDots} ${styles.highRadio}`}></div>
              <label htmlFor="contactChoice1">High Priority</label>
            </div>
            <div className={styles.radioPriority}>
              <input
                type="radio"
                id="contactChoice2"
                name="priority"
                value="moderate priority"
                checked={formData.priority === "moderate priority"}
                onChange={handleInputChange}
              />
              <div className={`${styles.radioDots} ${styles.modeRadio}`}></div>
              <label htmlFor="contactChoice2">Moderate Priority</label>
            </div>
            <div className={styles.radioPriority}>
              <input
                type="radio"
                id="contactChoice3"
                name="priority"
                value="low priority"
                checked={formData.priority === "low priority"}
                onChange={handleInputChange}
              />
              <div className={`${styles.radioDots} ${styles.lowRadio}`}></div>
              <label htmlFor="contactChoice3">Low Priority</label>
            </div>
          </div>

          <div className={styles.itemBoxTitle}>
            <p>
              Checklist ({checkedCount}/{formData.checklist.length})<sup>*</sup>
            </p>
          </div>

          <div className={styles.tasklisting}>
            <ul>
              {formData.checklist.map((item, index) => (
                <React.Fragment key={index}>
                  <li>
                    <input
                      type="checkbox"
                      checked={item.status}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    <input
                      type="text"
                      value={item.item}
                      onChange={(e) => {
                        const updatedChecklist = [...formData.checklist];
                        updatedChecklist[index].item = e.target.value;
                        setFormData({
                          ...formData,
                          checklist: updatedChecklist,
                        });
                      }}
                    />

                    {formData.checklist.length === 1 ? (
                      <i
                        className="fa fa-trash"
                        aria-hidden="true"
                        style={{ opacity: "0.5" }}
                      ></i>
                    ) : (
                      <i
                        className="fa fa-trash"
                        aria-hidden="true"
                        onClick={() => handleRemoveItem(index)}
                      ></i>
                    )}
                  </li>
                  {errData && item.item.length === 0 ? (
                    <p className={styles.errField}>Please fill the field.</p>
                  ) : (
                    ""
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
          <button className={styles.addItemTask} onClick={handleAddItem}>
            <i className="fa fa-plus" aria-hidden="true"></i> Add New
          </button>

          <div className={styles.formFootSec}>
            <div className={styles.formDuoDate}>
              <div>
                {/* <input
                  type="date"
                  id="contactDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                 

                  
                /> */}

                <DatePicker
                  // open={true}
                  // id="contactDate"
                  // name="dueDate"
                  placeholderText="Select Due Date"
                  selected={formData.dueDate}
                  onChange={(date) =>
                    setFormData({ ...formData, dueDate: date })
                  }
                  dateFormat="dd/MM/yyyy"
                />
                {/* {formData.dueDate === "" ? (
                  <label htmlFor="contactDate">Select Due Date</label>
                ) : (
                  ""
                )} */}
              </div>
            </div>
            <div className={styles.formBtnSec}>
              <button className={styles.addTaskBtn} onClick={popUpTaskBox}>
                Cancle
              </button>
              <button className={`${styles.addTaskBtn} ${styles.saveBtn}`}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskPopup;
