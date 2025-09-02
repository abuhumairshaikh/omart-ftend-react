import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <>
      <Spinner
        animation="border"
        role="status"
        style={{
          display: "block",
          width: "50px",
          height: "50px",
          margin: "auto",
        }}
      />
    </>
  );
};

export default Loader;
