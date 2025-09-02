/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { FaBox, FaProductHunt, FaUserEdit } from "react-icons/fa";

import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import LogoLoader from "../../components/LogoLoader";
import Message from "../../components/Message";
import SellerProfile from "../../components/SellerProfile";
import { useGetOrderBySellerIdMutation } from "../../slices/orderApiSlice";
import { cleanShippingAddress } from "../../utils/helper";
import ProductListScreen from "./ProductListScreen";
import ProductsBySeller from "../../components/ProductsBySeller";

const Shop = () => {
  const { userInformation } = useSelector((state) => state?.auth);
  const sellerId = userInformation && userInformation?.sellerID;
  const [getOrder, { data, isLoading, isError }] =
    useGetOrderBySellerIdMutation();
  useEffect(() => {
    const getData = async () => {
      await getOrder({
        entity_id: sellerId,
      });
    };
    getData();
  }, [getOrder, sellerId]);

  const orderData = data && data?.orders;

  // State for filters
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [activeSection, setActiveSection] = useState("orders");
  // Filtered orders based on status and date
  const filteredOrders = orderData?.filter((order) => {
    return (
      (!statusFilter || order?.status === statusFilter) &&
      (!dateFilter || order?.date === dateFilter)
    );
  });
  const handleMyOrdersClick = () => {
    setActiveSection("orders");
  };

  const handleEditUserClick = () => {
    setActiveSection("sellerEdit");
  };
  const buttonStyleOrder = {
    color: activeSection === "orders" ? "red" : "black", // Change color based on state
    // Add any other styles you want here
  };
  const buttonStyleProduct = {
    color: activeSection === "products" ? "red" : "black", // Change color based on state
    // Add any other styles you want here
  };
  const buttonStyleEdit = {
    color: activeSection === "sellerEdit" ? "red" : "black", // Change color based on state
    // Add any other styles you want here
  };

  return (
    <Container className="my-2">
      {/* Shop Info and Management Buttons */}
      <Row className="g-0" style={{ maxWidth: "auto" }}>
        <Col xs={4} className="border-end">
          <Button
            variant="light"
            style={buttonStyleOrder}
            className="w-100  rounded-0 d-flex align-items-center justify-content-center gap-2"
            onClick={handleMyOrdersClick}
          >
            <FaBox size={18} />
            <span>Orders</span>
          </Button>
        </Col>

        <Col xs={4} className="border-end">
          <Button
            variant="light"
            style={buttonStyleProduct}
            className="w-100 rounded-0 d-flex align-items-center justify-content-center gap-2"
            onClick={() => setActiveSection("products")}
          >
            <FaProductHunt size={18} />
            <span>Products</span>
          </Button>
        </Col>
        <Col xs={4}>
          <Button
            variant="light"
            style={buttonStyleEdit}
            className="w-100 rounded-0 d-flex align-items-center justify-content-center gap-2"
            onClick={handleEditUserClick}
          >
            <FaUserEdit size={18} />
            <span>Shop</span>
          </Button>
        </Col>
      </Row>

      {/* {activeSection === "products" && <ProductListScreen />} */}
      {activeSection === "products" && <ProductsBySeller />}
      {/* Filter Section */}

      {isLoading ? (
        <LogoLoader />
      ) : isError ? (
        <Message variant={"danger"}>something went wrong</Message>
      ) : (
        <div>
          {activeSection === "orders" && filteredOrders?.length > 0 ? (
            filteredOrders
              .slice() //
              .sort((a, b) => new Date(b.added_on) - new Date(a.added_on))
              .map((order) => (
                <LinkContainer
                  to={`/shop/order/${order?.order_id}`}
                  key={order?.order_id}
                >
                  <Card
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginBottom: "20px",
                      border: "1px solid #e0e0e0",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      transition: "transform 0.3s ease-in-out",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                      overflow: "hidden",
                    }}
                    className="mt-2"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
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
                        {order?.quantity && (
                          <p className="order_detail_p">
                            Quantity: {order?.quantity}
                          </p>
                        )}
                        <p className="order_detail_p">
                          Overall Price: ₹{order?.total_price?.toFixed(2)}
                        </p>
                        {order?.buyerPhone && (
                          <p className="order_detail_p">
                            Buyer Phone: {order?.buyerPhone}
                          </p>
                        )}
                        <p className="order_detail_p">
                          Payment Mode: {order?.mode_of_payment || "COD"}
                        </p>
                        <p className="order_detail_p">
                          Address:{" "}
                          {cleanShippingAddress(order?.shipping_address)}
                        </p>
                        {/* {order?.added_on && (
                        <p className="order_detail_p">
                           Date: {formatDate(order?.added_on, "dd/mm/yyyy HH:mm:ss")}
                        </p>
                      )} */}
                        {order?.added_on && (
                          <p className="order_detail_p">
                            Date:{" "}
                            {new Date(order.added_on).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false, // 24-hour format; change to true if you want AM/PM
                              // timeZoneName: 'short' // optional: shows timezone abbreviation like IST
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </LinkContainer>
              ))
          ) : (
            <>
              {activeSection === "orders" && (
                <p className="text-center mt-2">No Orders</p>
              )}
            </>
          )}
        </div>
      )}
      {activeSection === "sellerEdit" && <SellerProfile />}
    </Container>
  );
};

export default Shop;
