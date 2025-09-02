import { Button, Card, Col, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { FaCartPlus, FaCheck } from "react-icons/fa"; // Icons for cart actions
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BASE_URL } from "../constants";
import {
  useAddToCartApiMutation,
  useDeleteCartQuantityMutation,
} from "../slices/cartApiSlice";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { handleApiRequest } from "../utils/helper";

const ProductGrid = ({ product }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [addToCartApi] = useAddToCartApiMutation();
  const [deleteCart] = useDeleteCartQuantityMutation();

  const isInCart = (productId) =>
    cartItems?.some((item) => item.product_id === productId);
  const { userInformation } = useSelector((state) => state?.auth);
  const user_id = userInformation && userInformation?.NameIdentifier;
  const toggleCartHandler = async (product) => {
    try {
      if (isInCart(product?.product_id)) {
        if (userInformation) {
          await handleApiRequest(() =>
            deleteCart({
              user_id,
              entity_id: product?.entity_id,
              product_id: product?.product_id.toString(),
            }).unwrap()
          );
          dispatch(removeFromCart(product.product_id));
        } else {
          dispatch(removeFromCart(product.product_id));
        }
      } else {
        if (userInformation) {
          let res = await handleApiRequest(() =>
            addToCartApi({
              user_id,
              entity_id: product?.entity_id,
              product_id: product?.product_id?.toString(),
              quantity: 1,
            })
          );
          if (res.error) {
            toast.error(res.error.message);
            return;
          } else {
            dispatch(addToCart({ ...product, quantity: 1 }));
          }
        } else {
          dispatch(addToCart({ ...product, quantity: 1 }));
        }
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error?.message);
    }
  };

  if (!Array.isArray(product)) {
    return <p>No products available</p>;
  }

  return (
    <Row className="">
      {product?.map((product) => (
        <Col
          key={product?.product_id}
          xs={6} // Two items per row on extra-small screens
          sm={6} // Two items per row on small screens
          md={4} // Three items per row on medium screens
          lg={3} // Four items per row on large screens
          xl={3}
          className="mb-2"
        >
          <Card
            className="shadow-sm product-card "
            style={{
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              margin: "0 auto",
              height: "100%",
            }}
          >
            <Link
              to={`/product/${product?.product_id}`}
              style={{ textDecoration: "none" }}
            >
              <Card.Img
                variant="top"
                src={`${BASE_URL}/${product?.imageName}`}
                alt={product?.productName}
                style={{
                  objectFit: "cover",
                  height: "140px",
                  width: "100%",
                }}
                onError={(e) =>
                  (e.target.src =
                    "https://cdn.pixabay.com/photo/2017/09/10/10/01/background-2734972_1280.jpg")
                }
              />
              <Card.Title
                style={{
                  fontSize: "0.9rem", // Adjusted font size
                  fontWeight: "bold",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  padding: "0.5rem 0.5rem 0.1rem 0.5rem",
                  textDecoration: "none",
                  color: "#000",
                }}
              >
                {product?.productName}
              </Card.Title>
            </Link>
            {/* Product Image on Top */}

            <Card.Body className="d-flex flex-column">
              {/* Price */}
              <div className="d-flex align-items-center gap-1">
                <strong className="">₹{product?.price}</strong>
                {/* {product?.unitofQuantity && product?.unitofMeasure && (
                    <small>
                      / {product?.unitofQuantity} {product?.unitofMeasure}
                    </small>
                  )} */}
                {product?.unitofMeasure && (
                  <small>/ {product?.unitofMeasure}</small>
                )}
              </div>
              {product?.establishment_name && (
                <Link
                  to={`/seller/${encodeURIComponent(
                    product?.establishment_name
                  )}/${product?.entity_id}`}
                  style={{
                    fontSize: "0.75rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "#000",
                    textDecoration: "none",
                    cursor: "pointer",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.textDecoration = "underline")
                  }
                  onMouseOut={(e) => (e.target.style.textDecoration = "none")}
                >
                  Shop: {product?.establishment_name}
                </Link>
              )}
              {product?.brand && <p>{product?.brand}</p>}

              {/* Add to Cart Button */}
              <Button
                variant={
                  isInCart(product.product_id) ? "success" : "outline-success"
                }
                onClick={(e) => {
                  e.preventDefault();
                  toggleCartHandler(product);
                }}
                style={{
                  fontSize: "0.8rem", // Adjusted button size
                  borderColor: "#28a745",
                  color: isInCart(product.product_id) ? "#fff" : "#28a745",
                  backgroundColor: isInCart(product.product_id)
                    ? "#28a745"
                    : "rgba(211, 211, 211, 0.5)",
                  padding: "0.25rem 0.75rem",
                  marginTop: "auto",
                  alignSelf: "flex-end",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isInCart(product.product_id) ? (
                  <FaCheck size={16} />
                ) : (
                  <FaCartPlus size={16} />
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid;
