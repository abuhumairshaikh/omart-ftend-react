import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { FaMailBulk, FaMapMarkerAlt } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useGetAllCategoryQuery } from "../slices/productsApiSlice";
import {
  useSellerProfileQuery,
  useUpdateSellerUserMutation,
} from "../slices/sellerApiSlice";
import {
  getAddressFromCoords,
  handleApiRequest,
  parseAddressComponents,
} from "../utils/helper";
import LogoLoader from "./LogoLoader";
import Message from "./Message";
import { FaEdit } from "react-icons/fa";

const SellerProfile = () => {
  const { userInformation } = useSelector((state) => state?.auth);
  const sellerId = userInformation && userInformation?.sellerID;
  const { data, isLoading, error, refetch } = useSellerProfileQuery({
    sellerId,
  });
  const { data: categoryData } = useGetAllCategoryQuery();
  const shippingAddress = useSelector((state) => state?.cart?.shippingAddress);

  const [isEditing, setIsEditing] = useState(false);
  const [streetAddress, setStreetAddress] = useState(
    shippingAddress?.streetAddress || ""
  );
  const [pincode, setPincode] = useState(shippingAddress?.pincode || "");
  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
  });
  // console.log("location", location);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const categories =
    categoryData?.data?.categories.map((categories) => categories.category) ||
    [];
  const [updateSellerUser, { isLoading: updateSellerLoading }] =
    useUpdateSellerUserMutation();
  const sellerData = data && data?.data;
  if (isLoading) return <LogoLoader />;
  if (error) return <Message variant={"danger"}>{error}</Message>;

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  const handleUseCurrentLocation = async () => {
    setUseCurrentLocation(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { longitude, latitude } = position.coords;
      setLocation({ longitude, latitude });
      const address = await getAddressFromCoords(latitude, longitude);
      const addressComponents = parseAddressComponents(address);
      if (addressComponents) {
        setStreetAddress(addressComponents?.street);
        setPincode(addressComponents?.pincode);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Could not get your location. Please enter manually.");
    } finally {
      setUseCurrentLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      establishment_name: formData.get("establishment_name"),
      establishment_type: formData.get("establishment_type"),
      address: formData.get("address"),
      contact_email_2: formData.get("contact_email_2"),
      contact_no_2: formData.get("contact_no_2"),
      latitude: location.latitude || sellerData?.latitude,
      longitude: location.longitude || sellerData?.longitude,
      delRadius: +formData.get("delRadius") * 1000,
    };
    try {
      let res = await handleApiRequest(() =>
        updateSellerUser({ seller_Id: sellerId, ...updatedData }).unwrap()
      );
      setIsEditing(false);
      if (res?.succeeded === true) {
        toast.success("Profile updated successfully");
        refetch();
      } else {
        toast.error("Profile update failed");
      }
    } catch (error) {
      console.log("error", error);
      setIsEditing(true);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end p-2">
        <Button
          variant="light"
          size="sm"
          //  className="my-2 "
          className="d-flex align-items-center gap-2"
          onClick={handleEditClick}
        >
          <FaEdit size={15} />
          <span>{isEditing ? "Cancel" : "Edit"}</span>
        </Button>
        {/* <Button
                    variant="light"
                     size="sm"
                    onClick={handleCreateProduct}
                    className="d-flex align-items-center gap-2"
                    style={{
                      border: "1px solid black",
                    }}
                  >
                    <FaPlus size={15} />
                    <span>Add</span>
                  </Button> */}
      </div>

      <Card className="w-100  p-2">
        <Form className="my-2" onSubmit={handleSubmit}>
          <Form.Group controlId="formContactEmail">
            <Form.Label>Primary Email</Form.Label>
            <p>{sellerData?.contact_email_1}</p>
          </Form.Group>
          <Form.Group controlId="formContactNumber">
            <Form.Label>Primary Number</Form.Label>
            <p>{sellerData?.contact_no_1 || "-"}</p>
          </Form.Group>
          <Form.Group controlId="formEstablishmentName">
            <Form.Label>Shop Name</Form.Label>
            <Form.Control
              type="text"
              name="establishment_name"
              placeholder="Enter Shop name"
              defaultValue={sellerData?.establishment_name || ""}
              disabled={!isEditing}
            />
          </Form.Group>
          <Form.Group controlId="formEstablishmentType">
            <Form.Label>Category</Form.Label>
            <Form.Select
              id="category-type"
              name="establishment_type"
              defaultValue={sellerData?.establishment_type || ""}
              disabled={!isEditing}
            >
              <option value="">Select a Category</option>
              {categories?.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formContactEmail">
            <Form.Label>Alternate Email</Form.Label>
            <Form.Control
              type="email"
              name="contact_email_2"
              placeholder="Enter contact email"
              defaultValue={sellerData?.contact_email_2 || ""}
              disabled={!isEditing}
            />
          </Form.Group>

          <Form.Group controlId="formContactNo">
            <Form.Label>Alternate Number</Form.Label>
            <Form.Control
              type="text"
              name="contact_no_2"
              placeholder="Enter contact number"
              defaultValue={sellerData?.contact_no_2 || ""}
              disabled={!isEditing}
              maxLength={10}
              minLength={10}
              max={10}
              min={10}
            />
          </Form.Group>
          <div className="my-4">
            <Button
              variant="outline-secondary"
              onClick={handleUseCurrentLocation}
              disabled={useCurrentLocation || !isEditing}
              className="w-20 current-location-btn"
            >
              {useCurrentLocation ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <span>
                  <FaMapLocationDot className="me-2" />
                  Location
                </span>
              )}
            </Button>
          </div>

          {/* Address Fields */}
          <Row className="mb-3">
            <Col md={8}>
              <FormGroup controlId="streetAddress">
                <FormLabel>
                  <FaMapMarkerAlt className="me-2" />
                  Address*
                </FormLabel>
                <FormControl
                  type="text"
                  placeholder="Street, Area"
                  name="address"
                  value={
                    useCurrentLocation ? streetAddress : sellerData?.address
                  }
                  required
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="address-field"
                  disabled={useCurrentLocation || !isEditing}
                  defaultValue={sellerData?.address || ""}
                />
              </FormGroup>
            </Col>
            <Col md={6} className="my-2">
              <FormGroup controlId="pincode">
                <FormLabel>
                  <FaMailBulk className="me-2" />
                  Pincode*
                </FormLabel>
                <FormControl
                  type="text"
                  placeholder="6-digit pincode"
                  value={pincode}
                  required
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength="6"
                  pattern="[0-9]{6}"
                  className="address-field"
                  disabled={useCurrentLocation || !isEditing}
                />
              </FormGroup>
            </Col>
          </Row>
          <Form.Group className="my-2" controlId="deliveryRadius">
            <Form.Label>Delivery Radius (In Km)</Form.Label>
            <Form.Control
              type="number"
              min={0}
              placeholder="Delivery Radius"
              name="delRadius"
              required
              disabled={!isEditing}
              defaultValue={sellerData?.delRadius / 1000 || ""}
            />
          </Form.Group>
          <div className="w-100 d-flex justify-content-end">
            <Button
              variant="success"
              type="submit"
              className=" mt-2"
              disabled={!isEditing || updateSellerLoading}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
};

export default SellerProfile;
