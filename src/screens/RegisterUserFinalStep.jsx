import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { validatePassword } from "../utils/helper";

const RegisterUserFinalStep = ({
  formData,
  updateFormData,
  onSubmit,
  onBack,
  userRegisterLoading,
}) => {
  const [error, setError] = useState({
    phoneNumber: "",
    password: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const userPhone = useSelector((state) => state?.auth?.number);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    updateFormData({ [id]: value });

    if (id === "password") {
      const outErr = validatePassword(value);
      setError((prevError) => ({ ...prevError, password: outErr }));
    }
  };

  const handleTogglePassword = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // const handlePhoneNumberChange = (e) => {
  //   const value = e.target.value;
  //   const phoneErrors = validatePhoneNumber(value);
  //   // console.log("phoneErrors", phoneErrors);
  //   // If there are no errors, update the form data, otherwise set errors
  //   if (phoneErrors.length === 0) {
  //     updateFormData({ contactPhoneNumber: value });
  //     setError((prevError) => ({ ...prevError, phoneNumber: "" }));
  //   } else {
  //     setError((prevError) => ({
  //       ...prevError,
  //       phoneNumber: phoneErrors.join(", "),
  //     }));
  //   }
  // };

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
  console.log("error", error);
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="my-2" controlId="phoneNumber">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Phone Number"
          value={userPhone}
          disabled
          maxLength={10}
        />
        {formData.contactPhoneNumber && error.phoneNumber && (
          <Form.Text className="text-danger">{error.phoneNumber}</Form.Text>
        )}
      </Form.Group>

      <Form.Group className="my-2" controlId="firstName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Name"
          value={formData.firstName}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="my-2" controlId="password">
        <Form.Label>Password</Form.Label>
        <span style={{ color: "red", marginLeft: "5px" }}>*</span>
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
            {showPassword ? "Hide" : "Show"}
          </Button>
        </InputGroup>
        {formData.password?.length > 0 && error?.password && (
          <Form.Text className="text-danger">
            <ul>
              {error?.password?.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </Form.Text>
        )}
      </Form.Group>

      <Form.Group className="my-2" controlId="confirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <span style={{ color: "red", marginLeft: "5px" }}>*</span>
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
            {showConfirmPassword ? "Hide" : "Show"}
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
        <Button
          variant="light"
          type="submit"
          disabled={userRegisterLoading}
          className="border-black"
        >
          Register
        </Button>
      </div>
    </Form>
  );
};

export default RegisterUserFinalStep;
