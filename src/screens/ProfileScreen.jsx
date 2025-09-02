import React, { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { FaBox, FaStore, FaUserEdit } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import LogoLoader from "../components/LogoLoader";
import Message from "../components/Message";
import UserProfileUpdate from "../components/UserProfileUpdate";
import { logout } from "../slices/authSlice";
import { clearCartItems, resetCart } from "../slices/cartSlice";
import { useGetMyOrdersQuery } from "../slices/orderApiSlice";
import { formatDate } from "../utils/helper";

const ProfileScreen = () => {
  const [activeSection, setActiveSection] = useState("orders");
  const [showOrders, setShowOrders] = useState(true);
  const { userInformation } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userId = userInformation?.NameIdentifier;

  const {
    data: ordersData,
    error,
    isLoading: ordersLoading,
  } = useGetMyOrdersQuery(
    { userId: userId },
    {
      skip: !showOrders,
    }
  );
  //Color change of buttons
  const buttonStyleOrder = {
    color: showOrders ? "red" : "black", // Change color based on state
    // Add any other styles you want here
  };
  const buttonStyleProduct = {
    color: showOrders ? "black" : "red",
  };

  const handleMyOrdersClick = () => {
    setShowOrders(true);
    setActiveSection("orders");
  };

  const handleEditUserClick = () => {
    setActiveSection("editUser");
    setShowOrders(false);
  };

  const logoutHandler = () => {
    try {
      dispatch(clearCartItems());
      dispatch(resetCart());
      dispatch(logout());
      toast.success("Logged Out Successfully");
    } catch (error) {
      console.log("error", error);
      toast.error(error?.data?.message || error?.error);
    }
  };

  return (
    <>
      <Container className="my-2">
        <Row className="g-0" style={{ maxWidth: "auto" }}>
          {userInformation?.Role !== "Seller" && (
            <Col xs={12}>
              <Button
                variant="light"
                className="w-100 py-2 rounded-0 d-flex align-items-center justify-content-center gap-2"
                as={Link}
                to="/shop/sellers"
              >
                <FaStore className="me-2" />
                Become a Seller
              </Button>
            </Col>
          )}
          <Col xs={4} className="border-end">
            <Button
              variant="light"
              className="w-100 py-2 rounded-0 d-flex align-items-center justify-content-center gap-2"
              onClick={handleMyOrdersClick}
              style={buttonStyleOrder}
            >
              <FaBox size={18} />
              <span>Orders</span>
            </Button>
          </Col>

          <Col xs={4}>
            <Button
              variant="light"
              className="w-100 py-2 rounded-0 d-flex align-items-center justify-content-center gap-2"
              onClick={handleEditUserClick}
              style={buttonStyleProduct}
            >
              <FaUserEdit size={18} />
              <span>Profile</span>
            </Button>
          </Col>

          <Col xs={4}>
            <Button
              variant="light"
              className="w-100 py-2 rounded-0 d-flex align-items-center justify-content-center gap-2"
              style={{ color: "" }}
              onClick={logoutHandler}
            >
              <MdOutlineLogout size={18} />
              <span style={{ color: "black" }}>Logout</span>
            </Button>
          </Col>
        </Row>

        <div className="d-md-none">
          {activeSection === "editUser" && <UserProfileUpdate />}

          {activeSection === "orders" && (
            <Row>
              <Col md={12}>
                <h2>My Orders</h2>
                {ordersLoading ? (
                  <LogoLoader />
                ) : error ? (
                  <Message variant="danger">
                    {error?.data?.message || error.error}
                  </Message>
                ) : (
                  ordersData &&
                  ordersData.orders.length > 0 && (
                    <div>
                      {ordersData.orders.map((order) => (
                        <LinkContainer
                          to={`/order/${order?.order_id}`}
                          key={order?.order_id}
                        >
                          <Card
                            className="mb-2"
                            style={{
                              display: "flex",
                              flexDirection: "row",

                              border: "1px solid #e0e0e0",
                              backgroundColor: "white",
                              borderRadius: "8px",
                              transition: "transform 0.3s ease-in-out",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              cursor: "pointer",
                              overflow: "hidden",
                            }}
                            key={order?.order_id}
                          >
                            <div
                              style={{
                                flex: "1",
                                padding: "10px 20px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                gap: "10px",
                              }}
                              className="cursor-pointer"
                            >
                              <div>
                                <p className="order_detail_p">
                                  Order Id : {order?.order_id}
                                </p>
                                <p className="order_detail_p">
                                  Shop Name:{" "}
                                  <strong>
                                    {order?.establishment_name
                                      ? order?.establishment_name
                                      : "--"}
                                  </strong>
                                </p>

                                <p className="order_detail_p">
                                  Items: {order?.orderLists?.length}
                                </p>

                                {order?.added_on && (
                                  <p className="order_detail_p">
                                    Date:{" "}
                                    {formatDate(order?.added_on, "dd/mm/yyyy")}
                                  </p>
                                )}

                                {/* {order?.buyerPhone && (
                              <p className="order_detail_p">
                              Buyer Phone: {order?.buyerPhone}
                              </p>
                              )}
                              
                              <p className="order_detail_p">
                              Shiping Address: {order?.shipping_address}
                              </p> */}
                                <p className="order_detail_p">
                                  Overall Price:{" "}
                                  <strong>₹{order?.total_price}</strong>
                                </p>
                                {/* {order?.added_on && (
                              <p className="order_detail_p">
                                Date: {formatDate(order?.added_on, "dd/mm/yyyy")}
                              </p>
                            )} */}
                              </div>
                            </div>
                          </Card>
                        </LinkContainer>
                      ))}
                    </div>
                  )
                )}
                <h2>
                  {ordersData && ordersData.orders.length < 0 && "No Orders"}
                </h2>
              </Col>
            </Row>
          )}
        </div>
      </Container>
    </>
  );
};

export default ProfileScreen;
