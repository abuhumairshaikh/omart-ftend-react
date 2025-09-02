import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

function ErrorFallback() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="text-center">
      <h1>Something went wrong.</h1>
      <Button variant="light" className="border-black" onClick={handleGoBack}>
        Go Back
      </Button>
    </div>
  );
}

export default ErrorBoundary;
