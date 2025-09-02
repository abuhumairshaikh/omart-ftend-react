/* eslint-disable no-unused-vars */
import { Button, Card, Col, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LogoLoader from "../../components/LogoLoader";
import Message from "../../components/Message";
import { BASE_URL } from "../../constants";
import {
  useDeleteProductByIdMutation,
  useGetSellerProductsQuery,
} from "../../slices/productsApiSlice";

const ProductListScreen = () => {
  const { userInformation } = useSelector((state) => state?.auth);
  const entityId = userInformation?.sellerID;
  const navigate = useNavigate();
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useGetSellerProductsQuery({
    entityID: entityId,
  });
  const [deleteProduct, { isLoading: loadingDeleteProduct }] =
    useDeleteProductByIdMutation();
  const handleCreateProduct = () => {
    navigate("/shop/createproducts");
  };

  const handleDeleteProduct = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this product?")) {
        await deleteProduct(id).unwrap();
        toast.success("Product deleted successfully");
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleSingleProductRedirection = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div>
      {/* Shop Info and Management Buttons */}
      <Row className="p-2">
        {/* <Col xs={3} className="d-flex align-items-center">
          <h1 className="mb-0">Products</h1>
        </Col> */}
        <Col xs={12} className="d-flex align-items-center justify-content-end">
          <Button
            variant="light"
            size="sm"
            onClick={handleCreateProduct}
            className="d-flex align-items-center gap-2"
            // style={{
            //   border: "1px solid black",
            // }}
          >
            <FaPlus size={15} />
            <span>Add</span>
          </Button>
        </Col>
      </Row>

      {/* Product List Section */}
      {isLoading ? (
        <LogoLoader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="">
          {products?.data?.products?.length > 0 ? (
            products?.data?.products?.map((product) => (
              <Card
                key={product.product_id}
                className="custom-card mb-2"
                aria-label="seller-product-card"
                onMouseEnter={(e) =>
                  e.currentTarget.classList.add("hover-scale")
                }
                onMouseLeave={(e) =>
                  e.currentTarget.classList.remove("hover-scale")
                }
              >
                <div
                  onClick={() =>
                    handleSingleProductRedirection(product?.product_id)
                  }
                  className="p-1"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                    cursor: "pointer",
                  }}
                >
                  {/* Image Container */}
                  <div style={{ flexBasis: "45%", flexShrink: 0 }}>
                    <img
                      src={
                        `${BASE_URL}/api/Files/download/${product?.imageName}` ||
                        "https://plus.unsplash.com/premium_photo-1679517155620-8048e22078b1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      }
                      alt={product.productName}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      onError={(e) =>
                        (e.target.src =
                          "https://plus.unsplash.com/premium_photo-1679517155620-8048e22078b1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                      }
                    />
                  </div>

                  {/* Product Details */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h5 style={{ fontWeight: "600", fontSize: "1.2rem" }}>
                        {product?.productName}
                      </h5>
                      <p className="order_detail_p">Price: ₹ {product.price}</p>
                      <p className="order_detail_p">
                        Stock Status:
                        <span
                          style={{
                            color: product.stock_quantity > 0 ? "green" : "red",
                            fontWeight: "bold",
                            marginLeft: "5px",
                          }}
                        >
                          {product.stock_quantity > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #eee",
                  }}
                  className="p-2"
                >
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDeleteProduct(product.product_id)}
                    style={{ padding: "5px 10px", fontSize: "0.85rem" }}
                    disabled={loadingDeleteProduct}
                  >
                    <FaTrash /> Delete
                  </Button>

                  <Button
                    variant="outline-primary"
                    style={{ padding: "5px 10px", fontSize: "0.85rem" }}
                    onClick={() =>
                      navigate(`/shop/editproduct/${product.product_id}`)
                    }
                  >
                    <FaEdit /> Edit
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Message variant="info">No products found.</Message>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductListScreen;
