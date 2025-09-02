import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

export const OtpStep = ({
  otp,
  setOtp,
  onSubmit,
  onBack,
  onResendOtp,
  length = 6,
}) => {
  // const inputRefs = useRef([]);
  const [timer, setTimer] = useState(30); // Start timer from 30 seconds
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Initially disable resend button

  useEffect(() => {
    let countdown;
    if (isButtonDisabled && timer > 0) {
      // Decrease the timer every second if the button is disabled
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0) {
      // Enable the button when timer reaches 0
      setIsButtonDisabled(false);
    }

    return () => clearTimeout(countdown); // Clear timer on component unmount
  }, [timer, isButtonDisabled]);

  const handleResendClick = () => {
    onResendOtp(); // Call the resend function
    setIsButtonDisabled(true); // Disable the button
    setTimer(30); // Reset the timer to 30 seconds
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>OTP</Form.Label>
        <Form.Control
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="text-center"
          required
        />
      </Form.Group>
      <div className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button variant="light" type="submit" className="border-black">
          Verify
        </Button>
      </div>

      {/* Resend OTP Button */}
      <div>
        <br />
        <Button
          variant="link"
          onClick={handleResendClick}
          disabled={isButtonDisabled} // Disable based on timer state
          style={{
            textDecoration: "none",
            fontWeight: "bold",
            color: isButtonDisabled ? "gray" : "#007bff",
            cursor: isButtonDisabled ? "not-allowed" : "pointer",
          }}
        >
          Resend OTP
        </Button>
      </div>

      {/* Show timer if button is disabled */}
      {isButtonDisabled && (
        <div className="text-center text-muted mt-2">
          You can resend OTP in {timer} seconds
        </div>
      )}
    </Form>
  );
};
