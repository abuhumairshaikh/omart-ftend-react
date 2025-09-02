/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Row,
  Accordion,
  Badge,
  CloseButton,
} from "react-bootstrap";
import Message from "../components/Message";
import PaginateComponent from "../components/Paginate";
import ProductGrid from "../components/ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { resetCategory } from "../slices/productSlice";

const ProductListPage = ({ products, keyword }) => {
  const [sortOrder, setSortOrder] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products || []);
  // const [brands] = useState(["apple", "xiaomi"]);
  const { keyword: urlKeyword } = useParams();
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedRating, setSelectedRating] = useState("");
  const [maxProductPrice, setMaxProductPrice] = useState(10000); // Initialize as 10000
  const product = useSelector((state) => state?.product);
  const categoryData = product?.product || urlKeyword;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate the maximum price from the products and set it
    const maxPrice = Math.max(
      ...products.map((product) => product.price),
      10000
    );
    setMaxProductPrice(maxPrice);
    setPriceRange({ min: 0, max: maxPrice }); // Set the price range to max price
  }, [products]);

  useEffect(() => {
    filterProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrands, priceRange, selectedRating, sortOrder]);

  const filterProducts = () => {
    let filtered = products;

    if (selectedBrands?.length) {
      filtered = filtered?.filter((product) =>
        selectedBrands?.includes(product?.brand)
      );
    }

    filtered = filtered?.filter(
      (product) =>
        product?.price >= priceRange?.min && product?.price <= priceRange?.max
    );

    if (selectedRating) {
      filtered = filtered?.filter(
        (product) => product?.rating >= Number(selectedRating)
      );
    }

    if (sortOrder === "priceLowToHigh") {
      filtered = filtered?.sort((a, b) => a?.price - b?.price);
    } else if (sortOrder === "priceHighToLow") {
      filtered = filtered?.sort((a, b) => b?.price - a?.price);
    }

    setFilteredProducts(filtered);
  };

  const handleSortChange = (e) => setSortOrder(e.target.value);
  const handlePriceRangeChange = (e) =>
    setPriceRange({ ...priceRange, max: Number(e.target.value) });
  const handleBrandChange = (e, brand) => {
    const updatedBrands = e.target.checked
      ? [...selectedBrands, brand]
      : selectedBrands.filter((b) => b !== brand);
    setSelectedBrands(updatedBrands);
  };
  const handleRatingChange = (e) => setSelectedRating(e.target.value);
  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedRating("");
    setPriceRange({ min: 0, max: maxProductPrice });
  };

  const clearBrandFilter = () => setSelectedBrands([]);
  const clearPriceFilter = () =>
    setPriceRange({ min: 0, max: maxProductPrice });

  const handleClearCategory = () => {
    if (product?.product) {
      dispatch(resetCategory());
      navigate("/");
    } else {
      navigate("/");
    }
  };
  return (
    <Row>
      {/* Filter Sidebar for larger screens */}
      {/* <Col
        md={3}
        className="d-none d-md-block bg-light p-3 border-end"
        style={{
          borderRadius: "10px",
          backgroundColor: "#f8f9fa",
          padding: "20px",
        }}
      >
        <h5>Filters</h5>

        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Price</Accordion.Header>
            <Accordion.Body>
              <Form.Label>{`Price: ${priceRange.min} - ${priceRange.max}`}</Form.Label>
              <Form.Range
                min={0}
                max={maxProductPrice}
                value={priceRange.max}
                onChange={handlePriceRangeChange}
              />
              <Button
                variant="outline-danger"
                size="sm"
                className="mt-2"
                onClick={clearPriceFilter}
              >
                Clear Price Filter
              </Button>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Brand</Accordion.Header>
            <Accordion.Body>
              {brands.map((brand) => (
                <Form.Check
                  key={brand}
                  type="checkbox"
                  label={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={(e) => handleBrandChange(e, brand)}
                />
              ))}
              <Button
                variant="outline-danger"
                size="sm"
                className="mt-2"
                onClick={clearBrandFilter}
              >
                Clear Brand Filter
              </Button>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Customer Ratings</Accordion.Header>
            <Accordion.Body>
              <Form.Check
                type="radio"
                label="3★ & above"
                value="3"
                checked={selectedRating === "3"}
                onChange={handleRatingChange}
              />
              <Form.Check
                type="radio"
                label="4★ & above"
                value="4"
                checked={selectedRating === "4"}
                onChange={handleRatingChange}
              />
              <Button
                variant="outline-danger"
                size="sm"
                className="mt-2"
                onClick={() => setSelectedRating("")}
              >
                Clear Ratings
              </Button>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Button variant="success" className="mt-3 w-100" onClick={clearFilters}>
          Clear Filters
        </Button>
      </Col> */}

      {/* Filter Accordion for smaller screens */}
      {/* <Col xs={12} className="d-md-none mb-3">
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Filters</Accordion.Header>
            <Accordion.Body>
              {Price Filter }
              <FilterSection title="Price">
                <Form.Label>{`Price: ${priceRange.min} - ${priceRange.max}`}</Form.Label>
                <Form.Range
                  min={0}
                  max={maxProductPrice}
                  value={priceRange.max}
                  onChange={handlePriceRangeChange}
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="mt-2"
                  onClick={clearPriceFilter}
                >
                  Clear Price Filter
                </Button>
              </FilterSection>

             
              <FilterSection title="Brand">
                {brands.map((brand) => (
                  <Form.Check
                    key={brand}
                    type="checkbox"
                    label={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={(e) => handleBrandChange(e, brand)}
                  />
                ))}
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="mt-2"
                  onClick={clearBrandFilter}
                >
                  Clear Brand Filter
                </Button>
              </FilterSection>

            
              <FilterSection title="Customer Ratings">
                <Form.Check
                  type="radio"
                  label="3★ & above"
                  value="3"
                  checked={selectedRating === "3"}
                  onChange={handleRatingChange}
                />
                <Form.Check
                  type="radio"
                  label="4★ & above"
                  value="4"
                  checked={selectedRating === "4"}
                  onChange={handleRatingChange}
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="mt-2"
                  onClick={() => setSelectedRating("")}
                >
                  Clear Ratings
                </Button>
              </FilterSection>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Button variant="success" className="mt-2 w-100" onClick={clearFilters}>
          Clear Filters
        </Button>
      </Col> */}

      {/* Product List and Sorting */}
      {categoryData && (
        <Col className="my-2">
          <Badge
            bg="dark"
            pill
            className="p-2 d-flex align-items-center justify-content-between w-25"
          >
            {categoryData}
            <CloseButton variant="white" onClick={handleClearCategory} />
          </Badge>
        </Col>
      )}
      <Col xs={12} md={9}>
        <Row className="justify-content-end mt-2 mb-3">
          <Col className="border-black">
            <Form.Select
              aria-label="Sort Products"
              onChange={handleSortChange}
              style={{
                borderRadius: "5px",
                padding: "10px",
              }}
            >
              <option value="">Sort by</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mt-2">
          {filteredProducts?.length > 0 ? (
            <ProductGrid product={filteredProducts} />
          ) : (
            <Message variant="info">No products found</Message>
          )}
        </Row>

        <PaginateComponent />
      </Col>
    </Row>
  );
};

// Helper Component for Consistent Filter Section Design
const FilterSection = ({ title, children }) => (
  <div className="border-bottom pb-3 mb-3">
    <h6 className="font-weight-bold">{title}</h6>
    {children}
  </div>
);

export default ProductListPage;
