/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCarousel from "../components/ProductCarousel";
import { useAddToCartApiMutation } from "../slices/cartApiSlice";
import { addToCart } from "../slices/cartSlice";
import {
  useGetProductByIdQuery,
  useGetProductImageMutation,
} from "../slices/productsApiSlice";
import { handleApiRequest } from "../utils/helper";
import { INR_CHAR } from "../constants";
import LogoLoader from "../components/LogoLoader";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInformation } = useSelector((state) => state?.auth);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [images, setImages] = useState([]);
  const [addToCartApi] = useAddToCartApiMutation();
  const { data, isLoading, error } = useGetProductByIdQuery(id);
  const [getImageData] = useGetProductImageMutation();
  const user_id = userInformation?.NameIdentifier;

  useEffect(() => {
    const getData = async () => {
      let res = await getImageData({ productId: id });
      setImages(res?.data?.data?.productImages);
    };
    getData();
  }, [getImageData, id]);

  const productDetails = data?.data?.productDetails;
  const isInCart = cartItems?.some(
    (item) => item?.product_id === productDetails?.product_id
  );
  const handleAddProductToCart = async (product) => {
    try {
      if (userInformation) {
        await handleApiRequest(() =>
          addToCartApi({
            user_id,
            entity_id: product?.entity_id,
            product_id: product?.product_id?.toString(),
            quantity: 1,
          })
        );
        dispatch(addToCart({ ...product, quantity: 1 }));
      } else {
        dispatch(addToCart({ ...product, quantity: 1 }));
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  if (isLoading) return <LogoLoader />;
  if (error) return <Message variant="danger">{JSON.stringify(error)}</Message>;

  return (
    <Container
      className="my-2 p-2"
      style={{ backgroundColor: "#eaeaea", maxWidth: "1600px" }}
    >
      <Card className="mb-2">
        <CardBody>
          <Row>
            <Col
              md={6}
              className="d-flex p-1 justify-content-center align-items-center vh-50"
            >
              {productDetails && (
                <ProductCarousel imageUrls={images} productId={id} />
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
      {/* <Card
        className="mb-2"
        style={{
          border: "none",

          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
          width: "100%",
          height: "100%", // Make the card take the full width of the container
        }}
      >
        <Card.Body style={{ padding: ".75em" }}>
          <Row>
            <Row>
              <h1
                style={{
                  fontSize: "1.5rem",

                  color: "#333",
                  marginBottom: "2px",
                }}
              >
                {productDetails?.productName}
              </h1>
            </Row>

            {productDetails?.brand && (
              <Row>
                <div>Brand: {productDetails?.brand}</div>
              </Row>
            )}
            <Row>
              {productDetails?.establishment_name && (
                <p
                  className="text-muted"
                  style={{ fontSize: "1rem", marginBottom: "2px" }}
                >
                  Sold by: {productDetails?.establishment_name}
                </p>
              )}
            </Row>
            <Row>
              <Col md={6} className="me-2">
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <h3>
                    {INR_CHAR} {productDetails?.price}
                  </h3>

                  <p className="mt-2">
                    /{productDetails?.unitofQuantity}{" "}
                    {productDetails?.unitofMeasure}
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-success" // Changed to outline-success from Shop component
                  className="me-2"
                  disabled={isInCart}
                  onClick={() => handleAddProductToCart(productDetails)}
                >
                  {isInCart ? "Added to Cart" : "Add to Cart"}
                </Button>
              </div>
            </Row>
            <Col
              md={6}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="d-flex justify-content-end ">
                {/* <Button
                  variant="outline-danger" // Changed to outline-danger from Shop component
                  className="ms-2"
                >
                  Buy Now
                </Button> *
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card> */}

      <Card
        className="mb-2"
        style={{
          border: "none",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
          width: "100%",
          height: "100%",
        }}
      >
        <Card.Body style={{ padding: ".75em" }}>
          {/* Product Name */}
          <Row className="mb-1">
            <Col>
              <h1
                style={{
                  fontSize: "1.5rem",
                  color: "#333",
                  marginBottom: "2px",
                }}
              >
                {productDetails?.productName}
              </h1>
            </Col>
          </Row>

          {/* Brand */}
          {productDetails?.brand && (
            <Row className="mb-1">
              <Col>
                <div>Brand: {productDetails.brand}</div>
              </Col>
            </Row>
          )}

          {/* Sold by */}
          {productDetails?.establishment_name && (
            <Row className="mb-2">
              <Col>
                <p
                  className="text-muted"
                  style={{
                    fontSize: "1rem",
                    marginBottom: "2px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate(
                      `/seller/${encodeURIComponent(
                        productDetails.establishment_name
                      )}/${productDetails.entity_id}`
                    )
                  }
                >
                  Sold by: {productDetails.establishment_name}
                </p>
              </Col>
            </Row>
          )}

          {/* Price and Unit */}
          <Row className="mb-3 align-items-center">
            <Col md={6} className="d-flex align-items-center gap-3">
              <h3 className="mb-0">
                {INR_CHAR} {productDetails?.price}
              </h3>
              <p className="mb-0">
                /{productDetails?.unitofQuantity}{" "}
                {productDetails?.unitofMeasure}
              </p>
            </Col>

            {/* Add to Cart Button */}
            <Col md={6} className="d-flex justify-content-end">
              <Button
                variant="outline-success"
                disabled={isInCart}
                onClick={() => handleAddProductToCart(productDetails)}
              >
                {isInCart ? "Added to Cart" : "Add to Cart"}
              </Button>
            </Col>
          </Row>

          {/* Optional Buy Now Button (commented out) */}
          {/* 
    <Row>
      <Col className="d-flex justify-content-end">
        <Button variant="outline-danger" className="ms-2">
          Buy Now
        </Button>
      </Col>
    </Row> 
    */}
        </Card.Body>
      </Card>

      {productDetails?.details && (
        <Card className="mb-2">
          <CardBody>
            <p className="mt-2">{productDetails?.details}</p>
          </CardBody>
        </Card>
      )}
    </Container>
  );
};

export default ProductDetailPage;
