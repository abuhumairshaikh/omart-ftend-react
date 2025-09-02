import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <Card
      className="m-3 shadow-sm"
      style={{ minWidth: "18rem", maxWidth: "20rem" }}
    >
      <Card.Body>
        <Card.Title className="mb-3">{product?.productName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {product?.category}
        </Card.Subtitle>
        <Card.Text>
          <strong>Stock Quantity:</strong> {product?.stock_quantity}
        </Card.Text>
        <Card.Text>
          <strong>Replaced:</strong> {product?.can_be_replaced ? "Yes" : "No"}
        </Card.Text>
        <Card.Text>
          <strong>Returned:</strong> {product?.can_be_returned ? "Yes" : "No"}
        </Card.Text>
        <Card.Text className="h5 text-primary">Rs. {product?.price}</Card.Text>

        <Button
          variant="light"
          className="border-black"
          as={Link}
          to={`/product/${product?.id}`}
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};
export default Product;
