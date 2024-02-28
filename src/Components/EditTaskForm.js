import 'react-datepicker/dist/react-datepicker.css';
import React, { useState, useEffect } from "react";
import styles from "../Styles/CreateTaskPopup.module.css";
import BASEURL from "../constant/baseurl.js";
import axios from "axios";
import DatePicker from "react-datepicker";

const EditTaskForm = ({ taskData, closeEditForm }) => {
  // console.log(closeEditForm)
  const [errData, setErrData] = useState(false);
  const [formData, setFormData] = useState({
    _id:"",
    title: "",
    priority: 'high priority',
    checklist: [{ item: '', status: false }],
    dueDate: ''
  });

  useEffect(() => {
    setFormData({_id:taskData._id,
      title: taskData.title || "",
      priority: taskData.priority || 'high priority',
      checklist: taskData.checklist || [{ item: '', status: false }],
      dueDate: taskData.dueDate || ''
    });
  }, [taskData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCheckboxChange = (index) => {
    const updatedChecklist = [...formData.checklist];
    updatedChecklist[index].status = !updatedChecklist[index].status;
    setFormData(prevState => ({ ...prevState, checklist: updatedChecklist }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    setFormData(prevState => ({
      ...prevState,
      checklist: [...prevState.checklist, { item: '', status: false }]
    }));
  };

  const handleRemoveItem = (index) => (e) =>  {
    e.preventDefault();
    console.log('gh')
    const updatedChecklist = [...formData.checklist];
    updatedChecklist.splice(index, 1);
    setFormData(prevState => ({ ...prevState, checklist: updatedChecklist }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, checklist } = formData;
    if (!title || !checklist.every(item => item.item.trim() !== '')) {
      return setErrData(true);
    }
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(`${BASEURL}/api/task/updated-task`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200 || response.status === 201) {
        closeEditForm(); 
      } else {
        console.error("Error:", response.data.error);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  return (
    <div className={styles.mainPopup}>
      <div className={styles.popUpBg} onClick={closeEditForm} ></div>
      <div className={styles.popUpForm}>
        <form>
          <div className={styles.enterTitle}>
            <label>
              Title<sup>*</sup>
            </label>
            <input type="text" placeholder="Enter Task Title" name="title" value={formData.title} onChange={handleInputChange} />
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
                value="high priority" checked={formData.priority === 'high priority'} onChange={handleInputChange}
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
                checked={formData.priority === 'moderate priority'} onChange={handleInputChange}
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
                checked={formData.priority === 'low priority'} onChange={handleInputChange}
              />
              <div className={`${styles.radioDots} ${styles.lowRadio}`}></div>
              <label htmlFor="contactChoice3">Low Priority</label>
            </div>
          </div>

          <div className={styles.itemBoxTitle}>
            <p>
              Checklist (1/{formData.checklist.length})<sup>*</sup>
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
                onChange={() => handleCheckboxChange(index)} /> 
                <input type="text" 
                  value={item.item} onChange={(e) => {
                  const updatedChecklist = [...formData.checklist];
                  updatedChecklist[index].item = e.target.value;
                  setFormData({ ...formData, checklist: updatedChecklist });
                }}
                 />
                
                 {formData.checklist.length === 1 ? <i className="fa fa-trash" aria-hidden="true" style={{opacity:"0.5"}}></i> 
                 :
                 <i className="fa fa-trash" aria-hidden="true" onClick={handleRemoveItem(index)}></i>
                 }
              </li>
                  {errData && item.item.length === 0 ? (
                      <p className={styles.errField}>Please fill the field.</p>
                    ) : (
                      ""
                    )}
                </React.Fragment>
              ))}
            </ul>
            <button className={styles.addItemTask} onClick={handleAddItem}>
              <i className="fa fa-plus" aria-hidden="true"></i> Add New
            </button>
          </div>

          <div className={styles.formFootSec}>
            <div className={styles.formDuoDate}>
              <div className={styles.formateDate}>
              {/* <input
                  type="date"
                  id="contactDate"
                  name="dueDate" value={formData.dueDate} onChange={handleInputChange}
                /> */}
                
                  <DatePicker        
                  placeholderText='Select Due Date'       
                  selected={formData.dueDate}
                  onChange={handleInputChange}
                  dateFormat="dd/MM/yyyy"
                /> 
                {/* {formData.dueDate===''? <label htmlFor="contactDate">Select Duo Date</label> : '' } */}
              </div>
            </div>
            <div className={styles.formBtnSec}>
              <button className={styles.addTaskBtn} onClick={closeEditForm} >Cancle</button>
              <button className={`${styles.addTaskBtn} ${styles.saveBtn}`} onClick={handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskForm;
