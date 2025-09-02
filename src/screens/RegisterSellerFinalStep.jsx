import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getAddressFromCoords, validatePhoneNumber } from "../utils/helper";
import { useGetAllCategoryQuery } from "../slices/productsApiSlice";

const RegisterSellerFinalStep = ({
  formData,
  onSubmit,
  onBack,
  updateFormData,
  updateToSellerLoading,
}) => {
  const [error, setError] = useState({
    phoneNumber: "",
    password: [],
  });

  useEffect(() => {
    const handleUseCurrentLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { longitude, latitude } = position.coords;
        formData.longitude = longitude;
        formData.latitude = latitude;
        const address = await getAddressFromCoords(latitude, longitude);
        formData.address = address;
      } catch (error) {
        console.error("Error getting location:", error);
        alert("Could not get your location. Please enter manually.");
      }
    };
    if (navigator.geolocation) {
      handleUseCurrentLocation();
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, [formData]);
  const { data } = useGetAllCategoryQuery();
  const categories = data && data?.data?.categories;

  const userEmail = useSelector((state) => state?.auth?.email);
  const userPhone = useSelector(
    (state) => state?.auth?.userInformation?.MobilePhone
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    updateFormData({ [id]: value });
  };
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    const phoneErrors = validatePhoneNumber(value);
    // If there are no errors, update the form data, otherwise set errors
    if (phoneErrors.length === 0) {
      updateFormData({ contactPhoneNumber: value });
      setError((prevError) => ({ ...prevError, phoneNumber: "" }));
    } else {
      setError((prevError) => ({
        ...prevError,
        phoneNumber: phoneErrors?.join(", "),
      }));
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="my-2" controlId="email">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={userEmail || ""}
          required
          disabled={userEmail}
        />
      </Form.Group>
      <Form.Group className="my-2" controlId="phoneNumber">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Phone Number"
          value={userPhone || ""}
          onChange={handlePhoneNumberChange}
          // required
          maxLength={10}
          disabled
        />
        {formData?.contactPhoneNumber && error.phoneNumber && (
          <Form.Text className="text-danger">{error.phoneNumber}</Form.Text>
        )}
      </Form.Group>
      <Form.Group className="my-2" controlId="companyName">
        <Form.Label>Company Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Company Name"
          value={formData?.companyName}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group className="my-2" controlId="companyType">
        <Form.Label>Company Type</Form.Label>
        <Form.Control
          as="select"
          value={formData?.companyType}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Company Type</option>
          {categories?.map((data) => (
            <option value={data?.category}>{data?.category}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group className="my-2" controlId="address">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Address"
          value={formData?.address}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group className="my-2" controlId="deliveryRadius">
        <Form.Label>Delivery Radius (In Km)</Form.Label>
        <Form.Control
          type="number"
          min={0}
          placeholder="in KM"
          value={formData?.deliveryRadius}
          onChange={(e) => {
            // Save in km for UI, but store in meters for API
            const kmValue = e.target.value;
            updateFormData({
              deliveryRadius: kmValue,
              deliveryRadiusMeters: kmValue ? Number(kmValue) * 1000 : "",
            });
          }}
          required
        />
      </Form.Group>

      <div className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="light"
          type="submit"
          className="border-black"
          disabled={updateToSellerLoading}
        >
          Register
        </Button>
      </div>
    </Form>
  );
};

export default RegisterSellerFinalStep;
