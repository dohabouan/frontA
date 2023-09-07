import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';

const AddSprintDialog = ({ visible, onHide, onSprintAdded }) => {
  const [sprintData, setSprintData] = useState({
    id: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '', 
    priority: '',
  });

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "startDate" || name === "endDate") {
      setSprintData({ ...sprintData, [name]: e.value });
    } else {
      setSprintData({ ...sprintData, [name]: value });
    }
  };
  

  const handleAddSprint = async () => {
    

    try {
      const response = await fetch("http://localhost:8092/sprints", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sprintData),
      });

      if (response.ok) {
        
        onSprintAdded();
        setSprintData({
          id: '',
          description: '',
          startDate: '',
          endDate: '',
          status: '',
          priority: '',
        });
        onHide();
      } else {
      }
    } catch (error) {
    }
  };

  const handleCancel = () => {
    setSprintData({
      id: '',
      description: '',
      startDate: '',
      endDate: '',
      status: '',
      priority: '',
    });
    onHide();
  };

  return (
    <Dialog
      visible={visible}
      onHide={handleCancel}
      header="Add Sprint"
      modal
    >
      <div className="p-fluid">
        {/* Sprint form fields */}
        <InputText
          name="id"
          value={sprintData.id}
          onChange={handleInputChange}
          placeholder="Sprint ID"
        />
        <InputText
          name="description"
          value={sprintData.description}
          onChange={handleInputChange}
          placeholder="Sprint Description"
          
        />
        <Calendar
          name="startDate"
          value={sprintData.startDate}
          onChange={handleInputChange}
          placeholder="Start Date"
          showIcon        />
        <Calendar
          name="endDate"
          value={sprintData.endDate}
          onChange={handleInputChange}
          placeholder="End Date"
          showIcon
        />
        <InputText
          name="status"
          value={sprintData.status}
          onChange={handleInputChange}
          placeholder="Status"
        />
        <InputText
          name="priority"
          value={sprintData.priority}
          onChange={handleInputChange}
          placeholder="Priority"
        />
      </div>
      <div className="p-dialog-footer">
        <Button label="Cancel" onClick={handleCancel} />
        <Button label="Add Sprint" onClick={handleAddSprint} />
      </div>
    </Dialog>
  );
};

export default AddSprintDialog;

