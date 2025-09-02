import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import LogoLoader from "../components/LogoLoader";
import Message from "../components/Message";
import { clearCartItems, resetCart } from "../slices/cartSlice";
import { useCreateOrderMutation } from "../slices/orderApiSlice";
import { getOrderedAddress } from "../utils/helper";
const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state?.cart);
  const { shippingAddress } = cart || {};

  let latitude,
    longitude,
    restOfAddress = {};
  if (shippingAddress && typeof shippingAddress === "object") {
    try {
      ({ latitude, longitude, ...restOfAddress } = shippingAddress);
    } catch (error) {
      latitude = undefined;
      longitude = undefined;
      restOfAddress = {};
      console.error("Error destructuring shippingAddress:", error);
    }
  }
  const { userInformation } = useSelector((state) => state?.auth);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const user_id = userInformation && userInformation?.NameIdentifier;
  const mobileNumber = userInformation && userInformation?.MobileNumber;
  const userName = userInformation && userInformation?.Name;
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();
  const formatCurrency = (amount, locale = "en-IN", currency = "INR") => {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      }).format(amount);
    } catch (e) {
      // Fallback to a simple formatting if Intl.NumberFormat fails
      return `Rs. ${amount?.toFixed(2)}`;
    }
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  const handleTestPayment = () => {
    const options = {
      key: "rzp_test_QW4QKOZaNPmQJB", // your test key here
      amount: cart?.itemsPrice * 100, // INR in paise
      currency: "INR",
      name: "Suuq Store",
      description: "Suuq Transaction",
      image: "https://yourlogo.url/logo.png", // optional
      handler: function (response) {
        alert(
          `Payment Successful! Payment ID: ${response.razorpay_payment_id}`
        );
      },
      prefill: {
        name: userName,
        contact: mobileNumber,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    if (!shippingAddress || !shippingAddress?.area) {
      navigate("/shipping");
    } else if (!cart?.paymentMethod) {
      navigate("/payment");
    }
  }, [cart?.paymentMethod, navigate, shippingAddress]);

  const cartItemsNew =
    cart &&
    cart.cartItems?.map((item) => {
      return {
        productID: item?.product_id?.toString(),
        quantity: item?.quantity,
        price: item?.price,
        establishment_name: item?.establishment_name,
        productName: item?.productName,
        entity_id: item?.entity_id,
      };
    });

  const ordersMap = cartItemsNew?.reduce((acc, item) => {
    if (!acc[item.entity_id] && !acc[item?.productID]) {
      acc[item.entity_id] = {
        user_id,
        entity_id: item?.entity_id,
        establishment_name: item?.establishment_name,
        productName: item?.productName,
        pickup_address: "",
        shipping_address: `${
          shippingAddress
            ? Object?.values(shippingAddress)?.join(" ")
            : shippingAddress?.district ?? shippingAddress?.streetAddress
        }`,
        price: 0,
        orderItems: [],
      };
    }

    acc[item.entity_id].price += item.quantity * item.price;

    acc[item.entity_id].orderItems.push({
      price: item.price,
      productID: item.productID,
      quantity: item.quantity,
      amount: item.price * item.quantity,
    });
    return acc;
  }, {});
  // console.log("ordersMap :>> ", ordersMap);
  const ordersArray = Object.values(ordersMap);

  const handlePaymentMethodChange = (e) => {
    // const selectedPaymentMethod = e.target.value;
    // setPaymentMethod(selectedPaymentMethod);
    setPaymentMethod("COD");
  };

  const placeOrderHandler = async () => {
    if (paymentMethod !== "COD") {
      console.log("in other payment method");
      handleTestPayment();
      return;
    }
    try {
      await createOrder({
        orders: ordersArray,
      }).unwrap();
      dispatch(clearCartItems());
      dispatch(resetCart());
      toast.success("Order Placed");
      navigate(`/profile`);
      // navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.msg);
    }
  };

  const orderedAddress = getOrderedAddress(restOfAddress);
  return (
    <React.Fragment>
      <CheckoutSteps step1 step2 step3 step4 />
      <Container>
        <Row style={{ overflowWrap: "break-word" }}>
          <Col md={8}>
            <ListGroup className="mb-1 no-border">
              <ListGroup.Item className="mb-3 rounded-2">
                Shipping Address : {orderedAddress}
              </ListGroup.Item>

              <Card className="mb-1">
                {ordersArray.map((order) => (
                  <div key={order.entity_id}>
                    <ListGroup>
                      <ListGroup.Item>
                        <Row>
                          <span className="d-flex align-items-center justify-content-end ">
                            Shop : <strong>{order.establishment_name}</strong>
                          </span>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Product</Col>
                          <Col>Quantity</Col>
                          <Col>Price</Col>
                          <Col>Amount</Col>
                        </Row>
                      </ListGroup.Item>
                      {order?.orderItems.map((item) => (
                        <ListGroup.Item key={item.productID}>
                          <Row>
                            <Col>
                              <Link to={`/product/${item?.productID}`}>
                                {order.productName}
                              </Link>
                            </Col>
                            <Col>{item.quantity}</Col>
                            <Col>{formatCurrency(item.price)}</Col>
                            <Col>{formatCurrency(item.amount)}</Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                      <ListGroup.Item>
                        <Row>
                          <span className="d-flex align-items-center justify-content-end ">
                            Total Amount :{" "}
                            <strong>{formatCurrency(order.price)}</strong>
                          </span>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                  </div>
                ))}
              </Card>
            </ListGroup>
          </Col>
          <div style={{ paddingBottom: "60px" }}>
            <Col md={4} className="mb-4">
              <Card className="p-2">
                <ListGroup>
                  <ListGroup.Item>
                    <strong>Select Payment Method</strong>
                    <Form className="mt-2" onChange={handlePaymentMethodChange}>
                      <Form.Check
                        type="radio"
                        label="Cash on Delivery (COD)"
                        name="paymentMethod"
                        id="cod"
                        value="COD"
                        className="mb-2"
                        // checked={paymentMethod === "COD"}
                        checked={"COD"}
                      />
                      {/* <Form.Check
                        type="radio"
                        label="Pay Now"
                        name="paymentMethod"
                        id="upi"
                        value="Pay Now"
                        className="mb-2"
                        checked={paymentMethod === "Pay Now"}
                      /> */}
                    </Form>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </div>
          <Col
            md={4}
            style={{
              position: "fixed",
              bottom: "70px",
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <Card>
              <ListGroup variant="flush">
                {error && (
                  <ListGroup.Item>
                    <Message variant="danger">
                      {JSON.stringify(error?.data?.message)}
                    </Message>
                  </ListGroup.Item>
                )}

                <ListGroup.Item className="d-flex align-items-center justify-content-between">
                  <Row>
                    <strong className="d-flex align-items-center justify-content-between ">
                      Grand Total : {formatCurrency(cart.itemsPrice)}
                    </strong>
                  </Row>
                  <Row>
                    <Button
                      variant={`${
                        paymentMethod !== "COD" ? "primary" : "success"
                      }`}
                      type="button"
                      className="btn-block "
                      disabled={cart?.cartItems === 0}
                      onClick={placeOrderHandler}
                      style={{ pointerEvents: "auto" }}
                    >
                      {paymentMethod !== "COD" ? "Pay Now" : "Place Order"}
                    </Button>
                  </Row>
                  {isLoading && <LogoLoader />}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default PlaceOrderScreen;
