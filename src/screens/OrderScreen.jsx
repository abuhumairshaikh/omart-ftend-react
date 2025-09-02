import { Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import LogoLoader from "../components/LogoLoader";
import Message from "../components/Message";
import { BASE_URL } from "../constants";
import { useGetMyOrderByOrderIdQuery } from "../slices/orderApiSlice";
import { cleanShippingAddress, isCoordinate } from "../utils/helper";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    isLoading,
    error,
  } = useGetMyOrderByOrderIdQuery({ order_id: orderId });

  // eslint-disable-next-line no-unused-vars
  const itemsPrice = order?.orderLists?.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  const address = cleanShippingAddress(order?.shipping_address);

  const orderAddress = order?.shipping_address
    ?.split(" ")
    .filter((val) => val !== "");

  const filteredLatAddress = orderAddress
    ?.filter((item) => isCoordinate(item))
    .join(" ");

  const handleOpenMap = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${filteredLatAddress}`;
    window.open(mapsUrl, "_blank");
  };

  return isLoading ? (
    <LogoLoader />
  ) : error ? (
    <Message variant={"danger"}>Order Not Found</Message>
  ) : (
    <>
      <h6 className="m-2">Order ID : {orderId}</h6>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <Card className="m-2 mt-0">
              <ListGroup.Item>
                <p className="order_detail_p">
                  <strong>Name: </strong> {order?.buyerName}
                </p>
                <p className="order_detail_p">
                  <strong>Phone Number: </strong> {order?.buyerNumber}
                </p>
                {order?.buyerEmail && (
                  <p className="order_detail_p">
                    <strong>Email: </strong>{" "}
                    <a href={`mailto:${order?.buyerEmail}`}>
                      {order?.buyerEmail}
                    </a>
                  </p>
                )}
                <p
                  className="order_detail_p clickable-address"
                  onClick={handleOpenMap}
                  style={{ cursor: "pointer" }}
                >
                  <strong>Address: </strong>
                  {address?.length > 0 ? (
                    <span className="address-text">{address}</span>
                  ) : (
                    <span className="no-address">Address not available</span>
                  )}
                  <br />
                  <span className="map-link">(Click to view on map)</span>
                </p>
                {/* {order?.isDelivered ? (
                <Message variant="success">
                Delivered on {order?.deliveredAt}
                </Message>
                ) : (
                  <Message variant="danger">Not Delivered</Message>
                  )} */}
              </ListGroup.Item>
              <ListGroup.Item>
                <p className="order_detail_p">
                  <strong>Payment Method: </strong>
                  {order?.paymentMethod ?? "COD"}
                </p>
                {/* {order?.isPaid ? (
                <Message variant="success">Paid on {order?.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
              <Button>Update to Paid</Button> */}
              </ListGroup.Item>
              <ListGroup.Item>
                <h6>Order Items</h6>
                {order?.orderItems?.length === 0 ? (
                  <Message>Order is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {order?.orderLists?.map((item, index) => (
                      <ListGroup.Item className="py-3" key={index}>
                        <Row className="align-items-center">
                          <Col xs={3} md={2}>
                            <Image
                              src={
                                `${BASE_URL}/api/Files/download/${item?.imageName}` ||
                                "https://via.placeholder.com/150"
                              }
                              alt={item.imageName}
                              fluid
                              rounded
                              width={60}
                              height={60}
                              onError={(e) =>
                                (e.target.src =
                                  "https://plus.unsplash.com/premium_photo-1679517155620-8048e22078b1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                              }
                            />
                          </Col>
                          <Col xs={9} md={10}>
                            <div className="d-flex flex-column">
                              <Link
                                to={`/product/${item.productID}`}
                                className="mb-2 text-decoration-none text-dark"
                              >
                                {item.productName ?? "Product Name"}
                              </Link>
                              <div>
                                {item.quantity} x Rs. {item.price} = Rs.{" "}
                                {item.quantity * item.price}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </Card>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card className="m-2 mt-0">
            <ListGroup variant="flush">
              {/* <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>Rs. {itemsPrice}</Col>
                </Row>
              </ListGroup.Item> */}
              {/* <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>Rs. {order?.shippingPrice ?? 0}</Col>
                </Row>
              </ListGroup.Item> */}
              {/* <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>Rs. {order?.taxPrice}</Col>
                </Row>
              </ListGroup.Item> */}
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>Rs. {Number(order?.price)}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
