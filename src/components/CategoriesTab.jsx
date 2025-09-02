import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";
import { useGetAllCategoryQuery } from "../slices/productsApiSlice";
import { setProductCategory } from "../slices/productSlice";
import Message from "./Message";

const CategoriesTab = () => {
  const { data, error } = useGetAllCategoryQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (error) {
    return (
      <Message variant={"error"}>
        {error?.data?.message || error?.error}
      </Message>
    );
  }

  // const containerStyle = {
  //   backgroundColor: "#f8f9fa", // Light background for better contrast
  //   borderRadius: "10px",
  // };

  // const headerStyle = {
  //   backgroundColor: "#ffffff", // White background for header
  //   padding: "15px",
  //   borderRadius: "10px",
  //   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow
  // };

  const cardStyle = {
    backgroundColor: "white",
    border: "none",
    borderRadius: "5px",
    overflow: "hidden",
    height: "100%",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow for depth
  };

  // eslint-disable-next-line no-unused-vars
  const hoverEffectStyle = {
    transform: "scale(1.05)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
  };

  const handleSearchRedirect = (category) => {
    dispatch(setProductCategory(category));
    navigate(`/search/${category}`);
  };

  return (
    <Container className="my-2 p-2">
      <div className="mb-2">
        <h3>Categories</h3>
      </div>
      <Row>
        {data?.data?.categories?.map((category, index) => (
          <Col
            key={index}
            xs={3}
            sm={4}
            md={3}
            className="mb-2"
            onClick={() => handleSearchRedirect(category?.category)}
            style={{ height: "8rem", padding: "0px 5px" }}
          >
            <Card
              className="h-100 px-0"
              style={cardStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <Card.Img
                variant="top"
                src={`${BASE_URL}/${category?.imageName}`}
                className="img-fluid"
                onError={(e) =>
                  (e.target.src =
                    "https://plus.unsplash.com/premium_photo-1679517155620-8048e22078b1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                }
                style={{ height: "80%", objectFit: "cover" }}
                loading="lazy"
              />
              <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-1">
                <Card.Title
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    fontSize: "0.75rem",
                    maxWidth: "90%",
                  }}
                >
                  {category?.category}
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CategoriesTab;
