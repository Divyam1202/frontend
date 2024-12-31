import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedCourse: any) => void;
  course: any; // The course that you want to edit
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, course }) => {
  const [editedCourse, setEditedCourse] = useState(course);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCourse({
      ...editedCourse,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editedCourse); // Submit the edited course
  };

  // Return null if modal is not open
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <h3>Edit Course</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={editedCourse.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={editedCourse.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Course Code</label>
            <input
              type="text"
              name="courseCode"
              value={editedCourse.courseCode}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              value={editedCourse.capacity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="submit-button">Save Changes</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
