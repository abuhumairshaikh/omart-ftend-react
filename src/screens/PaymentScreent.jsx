import { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";
const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!shippingAddress || !shippingAddress.streetAddress) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            {/* <Form.Check
              className="my-2"
              type="radio"
              label="Card or UPI"
              id="online"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === "online"}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
              }}
            ></Form.Check> */}

            <Form.Check
              className="my-2"
              type="radio"
              label="Cash on Delivery"
              id="COD"
              name="paymentMethod"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
              }}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="light" className="border-black">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
