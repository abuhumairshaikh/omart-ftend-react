import { Button, Card, Col, Container, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import {
  FaCartPlus,
  FaCheck,
  FaEdit,
  FaRupeeSign,
  FaTrash,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../constants";
import {
  useAddToCartApiMutation,
  useDeleteCartQuantityMutation,
} from "../slices/cartApiSlice";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { useGetSellerProductsQuery } from "../slices/productsApiSlice";
import { handleApiRequest } from "../utils/helper";
import LogoLoader from "./LogoLoader";
import Message from "./Message";

const ProductsBySeller = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state?.cart?.cartItems);
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

  const location = useLocation();
  const entityId = userInformation?.sellerID;

  const isShopPage = location.pathname?.split("/").includes("shop");
  const { name, id } = useParams();
  const {
    data: products,
    isLoading,
    error,
  } = useGetSellerProductsQuery({
    entityID: id ?? entityId,
  });

  const handleSingleProductRedirection = (id) => {
    navigate(`/product/${id}`);
  };
  return (
    <Container>
      <h6>Products Sold By {name}</h6>

      <div>
        {isLoading ? (
          <LogoLoader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="seller-products-container">
            {products?.data?.products?.length > 0 ? (
              <div className="products-list">
                <Row className="g-2">
                  {products?.data?.products?.map((product) => (
                    <Col xs={6} sm={6} md={4} lg={3} key={product.product_id}>
                      <Card className="product-card-vertical h-100">
                        <div className="product-image-container-small">
                          <img
                            src={
                              product?.imageName
                                ? `${BASE_URL}/api/Files/download/${product?.imageName}`
                                : "https://plus.unsplash.com/premium_photo-1679517155620-8048e22078b1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            }
                            alt={product.productName}
                            className="product-image-small"
                            onError={(e) =>
                              (e.target.src =
                                "https://plus.unsplash.com/premium_photo-1679517155620-8048e22078b1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                            }
                          />
                        </div>

                        <div className="product-info-vertical">
                          <h6
                            className="product-name-small"
                            onClick={() =>
                              handleSingleProductRedirection(
                                product?.product_id
                              )
                            }
                          >
                            {product?.productName}
                          </h6>
                          <div className="price-container-small">
                            <span className="price-small">
                              <FaRupeeSign size={12} />
                              {product.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="stock-container-small">
                            <div
                              className={`stock-badge-small ${
                                product.stock_quantity > 0
                                  ? "stock-in"
                                  : "stock-out"
                              }`}
                            >
                              {product.stock_quantity > 0
                                ? "In Stock"
                                : "Out of Stock"}
                            </div>
                            {product.stock_quantity > 0 && (
                              <small className="text-muted stock-quantity">
                                {product.stock_quantity} available
                              </small>
                            )}
                          </div>

                          {userInformation &&
                          userInformation?.Role === "Seller" &&
                          isShopPage ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                              }}
                              className="p-2"
                            >
                              <Button
                                variant="outline-danger"
                                // onClick={() => handleDeleteProduct(product.product_id)}
                                style={{
                                  padding: "5px 10px",
                                  fontSize: "0.85rem",
                                }}
                                // disabled={loadingDeleteProduct}
                              >
                                <FaTrash /> Delete
                              </Button>

                              <Button
                                variant="outline-primary"
                                style={{
                                  padding: "5px 10px",
                                  fontSize: "0.85rem",
                                }}
                                onClick={() =>
                                  navigate(
                                    `/shop/editproduct/${product.product_id}`
                                  )
                                }
                              >
                                <FaEdit /> Edit
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Button
                                variant={
                                  isInCart(product.product_id)
                                    ? "success"
                                    : "outline-success"
                                }
                                className={`cart-button-small ${
                                  isInCart(product.product_id) ? "added" : ""
                                } ${
                                  product.stock_quantity === 0 ? "disabled" : ""
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (product.stock_quantity > 0) {
                                    toggleCartHandler(product);
                                  }
                                }}
                                disabled={product.stock_quantity === 0}
                              >
                                {isInCart(product.product_id) ? (
                                  <>
                                    <FaCheck size={12} />
                                    <span className="button-text">Added</span>
                                  </>
                                ) : (
                                  <>
                                    <FaCartPlus size={12} />
                                    <span className="button-text">
                                      {product.stock_quantity === 0
                                        ? "Out"
                                        : "Add"}
                                    </span>
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ) : (
              <div className="no-products-message">
                <div className="no-products-icon">📦</div>
                <h4>No products found</h4>
                <p>This seller hasn't added any products yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default ProductsBySeller;
