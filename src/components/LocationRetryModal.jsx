// components/LocationRetryModal.jsx
import React from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { getOrderedAddress } from "../utils/helper";





const LocationRetryModal = ({
  isOpen,
  onClose,
  onRetry,
  isLoading,
  error,
  detectedAddress,

}) => {
  // console.log(detectedAddress)
  return (
    <Modal size="sm" show={isOpen} onHide={onClose} centered >
      {/* <Modal.Header closeButton>
      </Modal.Header> */}
      <Modal.Header closeButton>
        <Modal.Title>Location</Modal.Title>

      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="text-center">
            {/* <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner> */}
            {/* <p className="mt-2">Detecting your location...</p> */}
          </div>
        ) : error ? (
          <>
            <Alert variant="danger">{error}</Alert>
            <p>Please try again or enter your address manually.</p>
          </>
        ) : detectedAddress ? (
          <div className="address-found">

            <p className="fw-bold">{getOrderedAddress(detectedAddress)}</p>

          </div>
        ) : (
          <p>No address found for your location.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
     
        <Button variant="secondary" onClick={onRetry} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-2">Retrying...</span>
            </>
          ) : (
            "Retry"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LocationRetryModal;
