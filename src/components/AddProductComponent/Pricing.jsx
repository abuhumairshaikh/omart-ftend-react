// Pricing.js
import { Form, Row, Col } from "react-bootstrap";
import { INR_CHAR } from "../../constants";

const Pricing = ({
  price,
  setPrice,
  currency,
  setCurrency,
  stock,
  setStock,
  unitofMeasure,
  unitofQuantity,
  setUnitofMeasure,
  setUnitofQuantity,
  brand,
  setBrand,
}) => {
  const defaultStock = 100;

  return (
    <div className="pricing">
      <Row>
        <Col xs={12} md={4} className="mb-3">
          <Form.Group>
            <div>
              <Form.Label>
                Rate: {INR_CHAR} {price} / {unitofMeasure}
              </Form.Label>
            </div>
            <Form.Control
              type="number"
              id="price"
              min={1}
              value={price}
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
        </Col>
        {/* <Col className="mb-3">
          <Form.Group>
          <Form.Label>
              Unit of Quantity
            </Form.Label>
            <Form.Control
               type="number"
              id="uam_quantity"
              min={1}
              max={100000}
              value={unitofQuantity}
              placeholder="1"
              onChange={(e) => setUnitofQuantity(e.target.value)}
            />
          </Form.Group>
        </Col> */}
        <Col className="mb-3">
          <Form.Group>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Unit of Measure</Form.Label>
            <Form.Control
              id="measure"
              min={1}
              value={unitofMeasure}
              onChange={(e) => setUnitofMeasure(e.target.value)}
              placeholder="Kg."
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={4} className="mb-3">
          <Form.Group>
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              id="stock"
              min={1}
              value={stock ?? defaultStock}
              onChange={(e) => setStock(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default Pricing;
