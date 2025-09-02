import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  useGetProfileQuery,
  useProfileMutation,
} from "../slices/usersApiSlice";
import { handleApiRequest } from "../utils/helper";
import LogoLoader from "./LogoLoader";
import Message from "./Message";

const UserProfileUpdate = () => {
  const { userInformation } = useSelector((state) => state?.auth);
  const userId = userInformation?.NameIdentifier;
  const { data, isLoading, error } = useGetProfileQuery({ Id: userId });
  const [updateProfile, { isLoading: profileUpdateLoading }] =
    useProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <LogoLoader />;
  if (error) return <Message variant={"danger"}>{error}</Message>;
  const profileData = data && data?.data;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const updatedData = {
      user_id: userId,
      first_name: formData.get("first_name"),
      middle_name: formData.get("middle_name"),
      last_name: formData.get("last_name"),
      country: formData.get("country"),
      residential_address: formData.get("residential_address"),
      permanent_address: formData.get("permanent_address"),
    };
    try {
      const res = await handleApiRequest(() =>
        updateProfile({ ...updatedData }).unwrap()
      );
      setIsEditing(false);
      if (res?.succeeded === true) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Profile update failed");
      }
      //  dispatch(setCredentials({ ...res }));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      setIsEditing(false);
    }
  };
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button variant="light" className="my-2" onClick={handleEditClick}>
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <Card className="w-100  p-2">
        <Form className="my-2" onSubmit={handleSubmit}>
          <Form.Group controlId="formContactEmail">
            <Form.Label>Primary Email</Form.Label>
            <p>{profileData?.contact_email}</p>
          </Form.Group>
          <Form.Group controlId="formContactEmail">
            <Form.Label>Primary Number</Form.Label>
            <p>{profileData?.contact_phone_number || "-"}</p>
          </Form.Group>
          <Form.Group controlId="formEstablishmentName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              placeholder="Enter First name"
              defaultValue={profileData?.first_name || ""}
              disabled={!isEditing}
            />
          </Form.Group>

          {/* <Form.Group controlId="formEstablishmentName">
            <Form.Label>Middle Name</Form.Label>
            <Form.Control
              type="text"
              name="middle_name"
              placeholder="Enter Middle name"
              defaultValue={profileData?.middle_name || ""}
              disabled={!isEditing}
            />
          </Form.Group> */}

          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              placeholder="Enter Last name"
              defaultValue={profileData?.last_name || ""}
              disabled={!isEditing}
            />
          </Form.Group>

          {/* <Form.Group controlId="formContactEmail">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              name="country"
              placeholder="Enter Country"
              defaultValue={profileData?.country || ""}
              disabled={!isEditing}
            />
          </Form.Group> */}

          <Form.Group controlId="formContactAdd">
            <Form.Label>Residential Address</Form.Label>
            <Form.Control
              as={"textarea"}
              type="text"
              name="residential_address"
              placeholder="Enter Residential Address"
              defaultValue={profileData?.residential_address || ""}
              disabled={!isEditing}
            />
          </Form.Group>

          {/* <Form.Group controlId="formContactNo">
            <Form.Label>Permanent Address</Form.Label>
            <Form.Control
              as={"textarea"}
              type="text"
              name="permanent_address"
              placeholder="Enter Permanent Address"
              defaultValue={profileData?.permenant_address || ""}
              disabled={!isEditing}
            />
          </Form.Group> */}
          <div className="w-100 d-flex justify-content-end">
            <Button
              variant="success"
              type="submit"
              className=" mt-2"
              disabled={!isEditing || profileUpdateLoading}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
};

export default UserProfileUpdate;
