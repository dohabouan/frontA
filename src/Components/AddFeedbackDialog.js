import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

const AddFeedbackDialog = ({ visible, onHide, onFeedbackAdded }) => {
  const [FeedbackData, setFeedbackData] = useState({
    id: '',
    description: '',
    Date: '',
    Author: '', 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData({ ...FeedbackData, [name]: value });
  };

  const handleAddFeedback = async () => {
    // Validate input (e.g., check if required fields are filled)

    try {
      const response = await fetch("http://localhost:8092/feedbacks", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(FeedbackData),
      });

      if (response.ok) {
        // Feedback added successfully
        onFeedbackAdded();
        setFeedbackData({
            id: '',
            description: '',
            Date: '',
            Author: '', 
        });
        onHide();
      } else {
      }
    } catch (error) {
      
    }
  };

  const handleCancel = () => {
    setFeedbackData({
        id: '',
        description: '',
        Date: '',
        Author: '', 
    });
    onHide();
  };

  return (
    <Dialog
      visible={visible}
      onHide={handleCancel}
      header="Add Feedback"
      modal
      // Add any other styling or properties as needed
    >
      <div className="p-fluid">
        {/* Feedback form fields */}
        <InputText
          name="id"
          value={FeedbackData.id}
          onChange={handleInputChange}
          placeholder="Feedback ID"
        />
        <InputText
          name="description"
          value={FeedbackData.description}
          onChange={handleInputChange}
          placeholder="Feedback Description"
        />
        <InputText
          name="Date"
          value={FeedbackData.Date}
          onChange={handleInputChange}
          placeholder="Date"
        />
        <InputText
          name="author"
          value={FeedbackData.Author}
          onChange={handleInputChange}
          placeholder="Author"
        />
      </div>
      <div className="p-dialog-footer">
        <Button label="Cancel" onClick={handleCancel} />
        <Button label="Add Feedback" onClick={handleAddFeedback} />
      </div>
    </Dialog>
  );
};

export default AddFeedbackDialog;
