import React, { useEffect } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";
import {
  useDeleteCartQuantityMutation,
  useGetCartByUserIdQuery,
  useUpdateCartQuantityMutation,
} from "../slices/cartApiSlice";
import { addToCart, removeFromCart } from "../slices/cartSlice"; // Adjust the import path as needed
import { handleApiRequest } from "../utils/helper";
const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInformation } = useSelector((state) => state?.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const user_id = userInformation && userInformation?.NameIdentifier;
  const { data, refetch, isSuccess } = useGetCartByUserIdQuery(user_id, {
    skip: !user_id, // Skip the query if user_id is falsy
  });
  const cartData = data && data?.data?.carts;
  const [updateQuantity] = useUpdateCartQuantityMutation();
  const [deleteCart] = useDeleteCartQuantityMutation();
  const updatedCart =
    cartData &&
    Object?.values(
      cartData?.reduce((acc, item) => {
        if (!acc[item?.product_id]) {
          acc[item?.product_id] = { ...item };
        } else {
          acc[item?.product_id].quantity += item?.quantity;
        }
        return acc;
      }, {})
    );
  const newCartData = updatedCart ?? cartItems;
  // Calculate total, GST, and discounts
  useEffect(() => {
    if (user_id && isSuccess) {
      refetch();
    }
  }, [refetch, user_id, isSuccess]);

  const itemsPrice =
    newCartData &&
    newCartData.reduce(
      (acc, item) => acc + (item?.price ?? item?.total_price) * item?.quantity,
      0
    );
  // const gst = itemsPrice * 0.18;
  // const discount = itemsPrice > 1000 ? 100 : 0;
  const total_price = itemsPrice;

  const handleRemoveFromCart = async (product_id) => {
    try {
      if (userInformation) {
        // Call API to delete cart item
        await handleApiRequest(() =>
          deleteCart({
            user_id,
            product_id: product_id.toString(),
          }).unwrap()
        );
        // Dispatch action to remove item from Redux store
        dispatch(removeFromCart(product_id));
      } else {
        // Directly dispatch action if user information is not present
        dispatch(removeFromCart(product_id));
      }

      // Ensure refetch only runs if the query was started
      if (isSuccess && typeof refetch === "function") {
        const updatedCartData = await refetch();
        if (updatedCartData?.error) {
          console.error("Error refetching cart data:", updatedCartData.error);
        }
      } else {
        console.warn("Cannot refetch as the query is not active.");
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred.");
    }
  };

  const handleQuantityChange = async (item, quantity) => {
    const product_id = item.product_id;
    const updatedQuantity = Number(quantity);
    dispatch(addToCart({ ...item, quantity: updatedQuantity }));

    try {
      if (userInformation) {
        // Make the API request to update the quantity
        await handleApiRequest(() =>
          updateQuantity({
            user_id: user_id,
            product_id,
            entity_id: item?.entity_id,
            quantity: updatedQuantity,
          }).unwrap()
        );
      }

      // After successfully updating the backend, refetch the updated data
      refetch();
    } catch (error) {
      console.log("error", error);
      // Optionally revert the UI change if the API request fails
      dispatch(addToCart({ ...item, quantity: item.quantity }));
    }
  };

  const checkOutHandler = () => {
    navigate(`/shipping`);
  };

  return (
    <Container className="py-1 pb-5">
      {newCartData?.length > 0 && (
        <>
          <Row>
            <h3 className="mb-2">Cart</h3>

            <Col md={8}>
              <ListGroup variant="flush">
                {newCartData?.map((item) => (
                  <ListGroup.Item
                    

                    key={item?.product_id}
                    className="mb-2 px-3"
                    style={{ border: "1px solid #ddd", borderRadius: "8px" }}
                  >
                    <Row className="align-items-center gx-3">
                      {/* Product Image */}
                      <Col xs="auto" className="p-1">
                        <Link
                          to={`/product/${item?.product_id}`}
                          aria-label={`View details for ${item?.productName}`}
                        >
                          <img
                            src={`${BASE_URL}/${item?.imageName}`}
                            alt={item?.productName || "Product image"}
                            onError={(e) =>
                            (e.target.src =
                              "https://plus.unsplash.com/premium_photo-1679517155620-8048e22078b1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                            }
                            className="img-fluid rounded"
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                          />
                        </Link>
                      </Col>

                      {/* Product Details and Controls */}
                      <Col className="d-flex flex-column justify-content-between">
                        {/* Product Name */}
                        <Link
                          to={`/product/${item?.product_id}`}
                          className="text-decoration-none"
                          aria-label={`View details for ${item?.productName}`}
                          style={{ color: "inherit" }}
                        >
                          <h5 className="mb-1">{item?.productName || ""}</h5>
                        </Link>

                        {/* Establishment Name */}
                        {item?.establishment_name && (
                          <small className="text-muted mb-2" style={{ fontSize: "0.85em" }}>
                            {item.establishment_name}
                          </small>
                        )}

                        {/* Price, Quantity Controls, and Total Price */}
                        <div className="d-flex align-items-center justify-content-between">
                          {/* Price */}
                          <span className="text-muted" style={{ fontSize: ".9em" }}>
                            ₹{item?.price?.toFixed(2)}
                          </span>

                          {/* Quantity Selector */}
                          <div className="d-flex align-items-center">
                            <Button
                              variant="light"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(item, Math.max(1, item?.quantity - 1))
                              }
                              className="border btn-primary"
                              style={{ fontSize: "12px" }}
                              aria-label={`Decrease quantity of ${item?.productName}`}
                            >
                              <FaMinus />
                            </Button>

                            <span
                              className="mx-3"
                              aria-live="polite"
                              aria-atomic="true"
                              style={{ minWidth: "24px", textAlign: "center" }}
                            >
                              {item?.quantity}
                            </span>

                            <Button
                              variant="light"
                              size="sm"
                              onClick={() => handleQuantityChange(item, item?.quantity + 1)}
                              className="border btn-primary"
                              style={{ fontSize: "12px" }}
                              aria-label={`Increase quantity of ${item?.productName}`}
                            >
                              <FaPlus />
                            </Button>
                          </div>

                          {/* Total Price */}
                          <span style={{ fontWeight: "600" }}>
                            ₹{(item?.price * item?.quantity).toFixed(2)}
                          </span>
                        </div>
                      </Col>

                      {/* Remove Button - positioned top-right */}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveFromCart(item?.product_id, item?.entity_id)}
                        aria-label={`Remove ${item?.productName} from cart`}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          width: "25px",
                          height: "25px",
                          padding: 0,
                          fontSize: "14px",
                          lineHeight: "25px",
                          textAlign: "center",
                          borderRadius: "8px",
                          zIndex: 10,
                        }}
                      >
                        <FaTimes />
                      </Button>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>


            <Col
              md={4}
              className="order-md-2 order-1 mt-3 mt-md-0 d-none d-md-block"
            >
              <Card className="w-100">
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex align-items-center justify-content-between">
                      <span>Total:</span>
                      <strong>₹{total_price?.toFixed(2)}</strong>
                    </ListGroup.Item>
                  </ListGroup>

                  {/* Checkout Button - Hidden on small screens */}
                  <Button
                    variant="success"
                    className="w-100 mt-3 d-none d-md-block"
                    disabled={newCartData.length === 0}
                    onClick={() => checkOutHandler()}
                  >
                    Place Order
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Fixed bottom bar for small screens only */}
          <div
            className="d-md-none position-fixed bottom-0 start-0 end-0 bg-white p-2 border-top shadow-sm mx-2 border rounded-2"
            style={{ zIndex: 1000, marginBottom: "5rem" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="me-2">Total:</span>
                <strong>₹{total_price?.toFixed(2)}</strong>
              </div>
              <Button
                variant="success"
                size="sm"
                disabled={newCartData.length === 0}
                onClick={() => checkOutHandler()}
                className="ms-3 flex-grow-0 "
                style={{ maxWidth: "200px" }}
              >
                <strong> Place Order</strong>

              </Button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default Cart;
