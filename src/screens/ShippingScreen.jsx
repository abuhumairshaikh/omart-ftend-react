import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";

import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import toast from "react-hot-toast";
import {
  FaCity,
  FaGlobeAsia,
  FaHome,
  FaMailBulk,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { indianStates } from "../constants";
import { saveShippingAddress } from "../slices/cartSlice";
import { useAddUserAddressMutation } from "../slices/usersApiSlice";
const ShippingScreen = () => {
  const navigate = useNavigate();
  const { shippingAddress } = useSelector((state) => state.cart);
  const { userInformation } = useSelector((state) => state.auth);
  const userID = userInformation?.NameIdentifier;

  // Initialize state with separated address components
  const [streetAddress, setStreetAddress] = useState(
    shippingAddress?.area || ""
  );
  const [addUserAddress, { isLoading }] = useAddUserAddressMutation();
  const [state, setState] = useState(shippingAddress?.state || "");
  const [building, setBuilding] = useState(shippingAddress?.building || "");
  const [landmark, setLandmark] = useState(shippingAddress?.landmark || "");
  const dispatch = useDispatch();

  const [stateError, setStateError] = useState("");
  // Validate state whenever it changes
  useEffect(() => {
    if (state) {
      const stateExists = indianStates.some(
        (s) => s.toLowerCase() === state.toLowerCase()
      );
      if (stateExists) {
        // Find the correct case version of the state
        const correctCaseState = indianStates.find(
          (s) => s.toLowerCase() === state.toLowerCase()
        );
        setState(correctCaseState);
        setStateError("");
      } else {
        setStateError("Please enter a valid Indian state");
      }
    } else {
      setStateError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ landmark, building, ...shippingAddress }));
    try {
      const addressPayload = {
        userID,
        aptStreet: streetAddress,
        area: building,
        landmark,
        pinCode: shippingAddress?.pinCode,
        city: shippingAddress?.district,
        state,
        country: shippingAddress?.country,
        latitude: shippingAddress?.latitude,
        longitude: shippingAddress?.longitude,
      };
      const res = await addUserAddress(addressPayload).unwrap();
      if (res.message === "Added") {
        toast.success(res.message);
        navigate(`/placeorder`);
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address. Please try again.");
      return;
    }
  };

  return (
    <FormContainer className="address-form-container">
      <h2 className="mb-4">Shipping Address</h2>

      <Form onSubmit={submitHandler} className="address-form">
        {/* Address Fields */}
        <Row className="mb-3">
          <Col md={4}>
            <FormGroup controlId="building">
              <FormLabel>
                <FaHome className="me-2" />
                Building / Apartment *
              </FormLabel>
              <FormControl
                type="text"
                placeholder="Building name, Floor, Flat no."
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="address-field"
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup controlId="landmark">
              <FormLabel>
                <FaMapMarkerAlt className="me-2" />
                Landmark
              </FormLabel>
              <FormControl
                type="text"
                placeholder="Nearby landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="address-field"
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup controlId="streetAddress">
              <FormLabel>
                <FaMapMarkerAlt className="me-2" />
                Street Address
              </FormLabel>
              <FormControl
                type="text"
                placeholder="House no., Street, Area"
                value={streetAddress}
                required
                onChange={(e) => setStreetAddress(e.target.value)}
                className="address-field "
              />
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <FormGroup controlId="district">
              <FormLabel>
                <FaCity className="me-2" />
                Area
              </FormLabel>
             
            </FormGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          
          <Col md={6} className="ps-0">
            <FormGroup controlId="pincode">
              {/* <FormLabel>
                <FaMailBulk className="me-2" />
                Pincode*
              </FormLabel> */}
               <div className="address-plain-text">
                {shippingAddress?.district} ,  {state}
              </div>
              <div className="address-plain-text">
                {shippingAddress?.pinCode}
              </div>
            </FormGroup>
          </Col>
        </Row>

        {/* Save as default checkbox */}
        {/* <FormCheck
          type="checkbox"
          id="saveAsDefault"
          label="Save as default shipping address"
          className="mb-4"
        /> */}

        {/* <Button
          type="submit"
          size="sm"
          variant="light"
          className=" submit-btn fixed-bottom p-3 mb-6"
          disabled={
            !shippingAddress ||
            !shippingAddress?.district ||
            !shippingAddress?.state ||
            !shippingAddress?.pinCode ||
            isLoading
          }
        >
          Continue
        </Button> */}
        {/* Fixed bottom bar for Continue button on small screens */}
<div
  className="d-md-none position-fixed bottom-0 start-0 end-0 bg-white p-2 border-top shadow-sm mx-2 rounded-2"
  style={{ zIndex: 1000, marginBottom: "5rem" }}
  role="region"
  aria-label="Continue to next step"
>
  <Button
    type="submit"
    
    variant="light"
    className="w-100"
    disabled={
      !shippingAddress ||
      !shippingAddress?.district ||
      !shippingAddress?.state ||
      !shippingAddress?.pinCode ||
      isLoading
    }
    aria-disabled={
      !shippingAddress ||
      !shippingAddress?.district ||
      !shippingAddress?.state ||
      !shippingAddress?.pinCode ||
      isLoading
    }
  >
    Continue
  </Button>
</div>

      </Form>

      <style jsx>{`
        .address-form-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .address-form {
          margin-top: 1.5rem;
        }

        .address-type-btn {
          width: 50%;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .current-location-btn {
          padding: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .address-field {
          padding: 0.75rem;
          border-radius: 5px;
        }

        .submit-btn {
          padding: 0.75rem;
          font-weight: 600;
          border-radius: 5px;
          border: 1px solid black;
          margin-bottom: 1rem;
        }
      `}</style>
    </FormContainer>
  );
};

export default ShippingScreen;
