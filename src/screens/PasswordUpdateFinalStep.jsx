import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { validatePassword } from "../utils/helper";
import { useSelector } from "react-redux";

const PasswordUpdateFinalStep = ({
  formData,
  updateFormData,
  onSubmit,
  onBack,
}) => {
  const [error, setError] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const userPhone = useSelector((state) => state?.auth?.number);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    updateFormData({ [id]: value });
    if (id === "password") {
      let outErr = validatePassword(value);
      setError(outErr);
    }
  };

  const handleTogglePassword = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(["Passwords do not match"]);
      return;
    }
    if (error.length > 0) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="my-2" controlId="email">
        <Form.Label>Mobile Number</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter Mobile Number"
          value={userPhone || ""}
          onChange={handleInputChange}
          required
          disabled={userPhone}
        />
      </Form.Group>

      <Form.Group className="my-2" controlId="password">
        <Form.Label>Password</Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={formData.password || ""}
            onChange={handleInputChange}
            required
          />
          <Button
            variant="outline-secondary"
            onClick={() => handleTogglePassword("password")}
          >
            {showPassword ? "Hide" : "Show"} Password
          </Button>
        </InputGroup>
        {formData.password?.length > 0 && error.length > 0 && (
          <Form.Text className="text-danger">
            <ul>
              {error.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </Form.Text>
        )}
      </Form.Group>

      <Form.Group className="my-2" controlId="confirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <InputGroup>
          <Form.Control
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={formData.confirmPassword || ""}
            onChange={handleInputChange}
            required
          />
          <Button
            variant="outline-secondary"
            onClick={() => handleTogglePassword("confirmPassword")}
          >
            {showConfirmPassword ? "Hide" : "Show"} Password
          </Button>
        </InputGroup>
        {formData.confirmPassword?.length > 0 &&
          formData.password !== formData.confirmPassword && (
            <Form.Text className="text-danger">
              Passwords do not match.
            </Form.Text>
          )}
      </Form.Group>

      <div className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button variant="light" type="submit" className="border-black">
          Update Password
        </Button>
      </div>
    </Form>
  );
};

export default PasswordUpdateFinalStep;
