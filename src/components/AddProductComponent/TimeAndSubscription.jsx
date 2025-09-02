import React, { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownButton,
  Form,
  ListGroup,
  Modal,
} from "react-bootstrap";

const TimeAndSubscription = ({
  times,
  addTime,
  removeTime,
  subscriptionMode,
  setSubscriptionMode,
}) => {
  const [show, setShow] = useState(false); // For modal display
  const [newTime, setNewTime] = useState(""); // For storing selected time

  // Handle modal open/close
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Add new time to the list
  const handleAddTime = () => {
    if (newTime) {
      addTime(newTime); // Call the addTime function passed as props
      setNewTime(""); // Clear the time input
    }
    handleClose(); // Close the modal
  };

  // Handle subscription mode selection
  const handleSelect = (e) => {
    setSubscriptionMode(e); // Set subscription mode using the function passed as props
  };

  // Format time to "hh:mm"
  const formatTime = (time) => {
    const date = new Date(`1970-01-01T${time}:00`);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="container mt-5">
      <Button variant="primary" className="mt-3" onClick={handleShow}>
        Add Time
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select a Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="timePicker">
            <Form.Label>Choose Time</Form.Label>
            <Form.Control
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddTime}>
            Add Time
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Display added times */}
      <div className="mt-3">
        <h5>Added Times:</h5>
        {times.length === 0 ? (
          <p>No times added yet.</p>
        ) : (
          <ListGroup>
            {times.map((time, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between"
              >
                {formatTime(time)}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeTime(index)} // Remove time at this index
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      {/* Subscription Payment Mode Dropdown */}
      <div className="mt-3">
        <h5>Subscription Payment Mode</h5>
        <DropdownButton
          id="dropdown-basic-button"
          title={subscriptionMode || "Select Subscription Mode"}
          onSelect={handleSelect}
        >
          <Dropdown.Item eventKey="Cash on delivery">
            Cash on delivery
          </Dropdown.Item>
          <Dropdown.Item eventKey="Daily">Daily</Dropdown.Item>
          <Dropdown.Item eventKey="Weekly">Weekly</Dropdown.Item>
          <Dropdown.Item eventKey="Monthly">Monthly</Dropdown.Item>
        </DropdownButton>
      </div>
    </div>
  );
};

export default TimeAndSubscription;
