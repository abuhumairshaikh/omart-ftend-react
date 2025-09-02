import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { validatePhoneNumber } from "../utils/helper";
export const MobileStep = ({
  phoneNumber,
  setPhoneNumber,
  onSubmit,
  isLoading,
  registerSellerLoading,
  registerLoading,
}) => {
  const [error, setError] = useState({
    phoneNumber: "",
  });
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    const phoneErrors = validatePhoneNumber(value);
    // console.log("phoneErrors", phoneErrors);
    if (phoneErrors.length === 0) {
      setError((prevError) => ({ ...prevError, phoneNumber: "" }));
      setPhoneNumber(value);
    } else {
      setError((prevError) => ({
        ...prevError,
        phoneNumber: phoneErrors.join(", "),
      }));
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Mobile Number (+91)</Form.Label>
        <Form.Control
          type="text"
          placeholder="Phone Number"
          onChange={handlePhoneNumberChange}
          required
          maxLength={10}
        />
        {phoneNumber && error.phoneNumber && (
          <Form.Text className="text-danger">{error.phoneNumber}</Form.Text>
        )}
      </Form.Group>
      <div className="d-flex justify-content-between">
        <div />
        <Button
          variant="light"
          type="submit"
          className="border-black"
          disabled={isLoading || registerLoading || registerSellerLoading}
        >
          Send OTP
        </Button>
      </div>
    </Form>
  );
};
