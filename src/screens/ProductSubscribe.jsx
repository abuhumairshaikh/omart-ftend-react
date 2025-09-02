// src/pages/SubscriptionFormPage.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Updated to use navigate
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";

const SubscriptionFormPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // To navigate after form submission

  // State for form fields
  const [deliveryChoice, setDeliveryChoice] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert state for success message

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!deliveryChoice || !timeSlot || !paymentMethod || !address || !name) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    // Handle form submission logic here, e.g., sending data to the backend
    console.log({ id, deliveryChoice, timeSlot, paymentMethod, address, name });
    setShowAlert(true); // Show success message
  };

  // Handler to reset the form
  const handleReset = () => {
    setDeliveryChoice("");
    setTimeSlot("");
    setPaymentMethod("");
    setAddress("");
    setName("");
  };

  return (
    <Container className="my-5">
      <h2>Subscribe to Product ID: {id}</h2>
      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
          Subscription successfully submitted!
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            {/* Delivery Choice */}
            <Form.Group controlId="deliveryChoice" className="mb-3">
              <Form.Label>Delivery Choice</Form.Label>
              <Form.Select
                value={deliveryChoice}
                onChange={(e) => setDeliveryChoice(e.target.value)}
                required
              >
                <option value="">Select Delivery Choice</option>
                <option value="everyday">Every Day</option>
                <option value="onceAWeek">Once a Week</option>
                <option value="onceAMonth">Once a Month</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            {/* Time Slot */}
            <Form.Group controlId="timeSlot" className="mb-3">
              <Form.Label>Preferred Delivery Time</Form.Label>
              <Form.Select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                required
              >
                <option value="">Select Time Slot</option>
                <option value="morning">Morning (8-12)</option>
                <option value="afternoon">Afternoon (12-4)</option>
                <option value="evening">Evening (4-9)</option>
                <option value="night">Night (9-12)</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            {/* Payment Method */}
            <Form.Group controlId="paymentMethod" className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="">Select Payment Method</option>
                <option value="cod">Cash on Delivery (COD)</option>
                <option value="online">Online Payment</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            {/* Customer Name */}
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Address */}
        <Form.Group controlId="address" className="mb-3">
          <Form.Label>Delivery Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Group>

        {/* Action Buttons */}
        <div className="d-flex justify-content-between">
          <Button variant="primary" type="submit" className="me-2">
            Subscribe
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Clear Form
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default SubscriptionFormPage;
