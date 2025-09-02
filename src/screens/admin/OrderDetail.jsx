import { Card, Col, Image, ListGroup, Row } from "react-bootstrap";
// eslint-disable-next-line no-unused-vars
import { Link, useParams } from "react-router-dom";
import LogoLoader from "../../components/LogoLoader";
import Message from "../../components/Message";
import { BASE_URL } from "../../constants";
import { useGetMyOrderByOrderIdQuery } from "../../slices/orderApiSlice";
import { cleanShippingAddress } from "../../utils/helper";

const OrderDetail = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    isLoading,
    error,
  } = useGetMyOrderByOrderIdQuery({ order_id: orderId });

  const address = cleanShippingAddress(order?.shipping_address);

  // eslint-disable-next-line no-unused-vars
  const itemsPrice = order?.orderLists?.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  return isLoading ? (
    <LogoLoader />
  ) : error ? (
    <Message variant={"danger"}>Order Not Found</Message>
  ) : (
    <>
      {/* <h4>Order Details</h4> */}
      <Row>
        <Col md={8}>
          <Card className="m-2">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <p className="order_detail_p">
                  <strong>Order Id: </strong> {orderId}
                </p>
                <p className="order_detail_p">
                  <strong>Seller: </strong> {order?.establishment_name}
                </p>
                {/* <p className="order_detail_p">
                  <strong>Phone Number: </strong> {order?.buyerNumber}
                </p> */}
                {/* <p className="order_detail_p">
                  <strong>Email: </strong>{" "}
                  <a href={`mailto:${order?.buyerEmail}`}>{order?.buyerEmail}</a>
                </p> */}
                <p className="order_detail_p">
                  <strong>Ship to: </strong>
                  {address}
                </p>
                {/* {order?.isDelivered ? (
                <Message variant="success">
                  Delivered on {order?.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )} */}
              </ListGroup.Item>
              {/* <ListGroup.Item>
              <p>
                <strong>Payment Method: </strong>
                {order?.paymentMethod ?? "COD"}
              </p>
              {order?.isPaid ? (
                <Message variant="success">Paid on {order?.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
                )}
              <Button>Update to Paid</Button>
              </ListGroup.Item> */}
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
                            />
                          </Col>
                          <Col xs={9} md={10}>
                            <div className="d-flex flex-column">
                              <Link
                                to={`/product/${item.productID}`}
                                className="mb-2 text-decoration-none text-dark"
                              >
                                {item.productName ?? "--"}
                              </Link>
                              <div>
                                {item.quantity} x ₹ {item.price} = ₹{" "}
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
            </ListGroup>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="m-2 mt-0">
            <ListGroup variant="flush">
              {/* <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item> */}
              {/* <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹  {itemsPrice}</Col>
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
              <ListGroup.Item className="d-flex align-items-center justify-content-end ">
                <Row>
                  <Col>
                    <strong>Total: </strong>
                  </Col>
                  <Col>
                    <strong>₹ {Number(order?.price)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderDetail;
