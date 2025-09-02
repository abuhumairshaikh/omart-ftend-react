import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Nav,
  Navbar,
  Row,
  Spinner,
} from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/logo.png";
import useAddressDetection from "../hooks/useAddressDetection";
import { saveShippingAddress } from "../slices/cartSlice";
import LocationRetryModal from "./LocationRetryModal";
import UserMenu from "./UserMenu";
export default function Header() {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInformation } = useSelector((state) => state?.auth);
  const shippingAddress = useSelector((state) => state?.cart?.shippingAddress);
  const areaUpdated = shippingAddress && shippingAddress?.area;
  const { error, isLoading, detectLocation } = useAddressDetection();
  const isShippingAddressLoading =
    !shippingAddress?.area ||
    !shippingAddress?.latitude ||
    !shippingAddress?.longitude;

  // eslint-disable-next-line no-unused-vars
  const [area, setArea] = useState(shippingAddress?.area || "");

  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSaveAddress = (payload) => {
    if (payload) {
      dispatch(saveShippingAddress(payload));
    }
  };
  const isShippingAddressValid = Object.entries(shippingAddress)?.some(
    (item) => item !== null || item !== undefined
  );
  const handleLocationSuccess = async () => {
    try {
      const payload = await detectLocation();
      handleSaveAddress(payload);
    } catch {
      setIsModalOpen(true);
    }
  };

  const handleRetryLocation = async () => {
    try {
      const payload = await detectLocation();
      handleSaveAddress(payload);
      // setIsModalOpen(false);
    } catch (err) {
      console.error("Retry failed:", err);
    }
  };

  useEffect(() => {
    if (!isShippingAddressValid) {
      handleLocationSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShippingAddressValid]);

  // Using RTK Query hooks for address management

  // Geolocation handler with better cleanup and error handling;

  return (
    <header>
      <Navbar
        style={{
          padding: "0rem 0rem",
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
        }}
        expand="md"
        collapseOnSelect
        className="navbar-glassmorph"
      >
        <Container>
          <Row className="align-items-center w-100">
            {/* Logo and Address Section */}
            <Col xs={9} md={4} className="d-flex align-items-center">
              <LinkContainer to="/">
                <Navbar.Brand className="me-1">
                  <img src={logo} alt="suuq" height={28} width={56} />
                </Navbar.Brand>
              </LinkContainer>

              {isShippingAddressLoading ? (
                <div
                  className="d-flex align-items-center gap-2"
                  style={{ maxWidth: "200px" }}
                >
                  <Spinner animation="border" size="sm" role="status" />
                  <small className="text-muted">Fetching address...</small>
                </div>
              ) : areaUpdated || area ? (
                <div
                  className="address-container"
                  style={{
                    maxWidth: "200px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                  //title={areaUpdated ?? area}
                >
                  <p style={{ margin: "0" }} onClick={setIsModalOpen}>
                    {areaUpdated ?? area}
                  </p>
                </div>
              ) : (
                <p style={{ margin: "0" }} onClick={handleRetryLocation}>
                  No Address
                </p>
              )}
              <LocationRetryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRetry={handleRetryLocation}
                isLoading={isLoading}
                error={error}
                detectedAddress={shippingAddress}
              />
            </Col>

            {/* User Info Section */}
            {userInformation ? (
              <Col
                xs={3}
                md={8}
                className="d-flex align-items-center justify-content-end p-0"
              >
                <h6 className="text-nowrap ms-2 mb-0">
                  {userInformation?.Name}
                </h6>
              </Col>
            ) : (
              <Col
                xs={3}
                md={8}
                className="d-flex align-items-center justify-content-end p-0"
              >
                <LinkContainer to="/login">
                  <Button
                    variant="light"
                    size="sm"
                    className="border-black d-block d-md-none"
                  >
                    Sign In
                  </Button>
                </LinkContainer>
              </Col>
            )}
          </Row>

          {/* Navigation Collapse Section */}
          <Navbar.Collapse id="basic-navbar" className="collapse-class">
            <Nav className="ms-auto align-items-center">
              <LinkContainer to="/cart">
                <Nav.Link className="nav-link-cart d-none d-md-block">
                  <FaShoppingCart className="nav-icon" />
                  Cart
                  {cartItems?.length > 0 && (
                    <Badge pill bg="success" className="nav-icon-pill">
                      {cartItems?.length}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              <div className="user-menu">
                {userInformation ? (
                  <UserMenu />
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link className="d-none d-md-block nav-link">
                      <FaUser className="nav-icon" />
                      Login
                    </Nav.Link>
                  </LinkContainer>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
