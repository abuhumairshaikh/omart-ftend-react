import React from "react";
import { Button, Form } from "react-bootstrap";
export const EmailStep = ({
  email,
  setEmail,
  onSubmit,
  isLoading,
  registerSellerLoading,
  registerLoading,
}) => (
  <Form onSubmit={onSubmit}>
    <Form.Group className="mb-3">
      <Form.Label>Email address</Form.Label>
      <Form.Control
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
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
