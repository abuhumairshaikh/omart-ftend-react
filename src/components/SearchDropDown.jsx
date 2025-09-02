import { debounce } from "lodash";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  Dropdown,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyGetProductsByNameQuery } from "../slices/productsApiSlice";
import LogoLoader from "./LogoLoader";

export const SearchDropDown = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [getProducts, { isLoading }] = useLazyGetProductsByNameQuery();
  const [products, setProducts] = useState([]);

  const shippingAddress = useSelector((state) => state?.cart?.shippingAddress);
  useLayoutEffect(() => {
    if (!urlKeyword) return;

    const fetchProducts = async () => {
      try {
        const response = await getProducts({
          search: urlKeyword,
          latitude: shippingAddress?.latitude,
          longitude: shippingAddress?.longitude,
        }).unwrap();

        if (response && response?.data?.products) {
          setProducts(response?.data.products);
        } else {
          setProducts([]); // Fallback in case products are missing
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchProducts();
  }, [
    getProducts,
    shippingAddress?.latitude,
    shippingAddress?.longitude,
    urlKeyword,
  ]);

  const debouncedFetchProducts = useMemo(
    () =>
      debounce(async (searchKeyword) => {
        const { data } = await getProducts({
          search: searchKeyword,
          latitude: shippingAddress?.latitude,
          longitude: shippingAddress?.longitude,
        });
        setProducts(data?.data?.products || []);
      }, 2000),
    [getProducts, shippingAddress?.latitude, shippingAddress?.longitude]
  );

  useEffect(() => {
    return () => debouncedFetchProducts.cancel();
  }, [debouncedFetchProducts]);

  const handleInputChange = (e) => {
    const newKeyword = e.target.value;
    setKeyword(newKeyword);
    setShowDropdown(!!newKeyword);
    debouncedFetchProducts(newKeyword);
  };
  const handleSelectProduct = (productName) => {
    setKeyword(productName);
    setShowDropdown(false);
    if (productName.length === 0) {
      return;
    }
    navigate(`/search/${productName.trim()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSelectProduct(keyword);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) return <LogoLoader />;

  return (
    <Container>
      <div ref={dropdownRef} className="position-relative">
        <InputGroup
          className="search-dropdown-input-group"
          style={{ borderRadius: "8px", overflow: "hidden" }}
        >
          <Form.Control
            type="text"
            value={keyword}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search Products..."
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px 0 0 8px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              transition: "border 0.2s",
            }}
          />
          {isLoading && (
            <InputGroup.Text
              style={{ backgroundColor: "#fff", border: "none" }}
            >
              <Spinner animation="border" size="sm" />
            </InputGroup.Text>
          )}
          <InputGroup.Text
            style={{
              cursor: "pointer",
              backgroundColor: "#0056b3",
              border: "none",
              color: "black",
            }}
            onClick={() => handleSelectProduct(keyword)}
          >
            <FaSearch size={15} color="black" />
          </InputGroup.Text>
        </InputGroup>

        {showDropdown && products?.length > 0 && (
          <Dropdown.Menu
            show
            style={{
              width: "100%",
              maxHeight: "200px",
              overflowY: "auto",
              position: "absolute",
              zIndex: 1000,
            }}
          >
            {products?.length > 0 ? (
              products?.slice(0, 5)?.map((product) => (
                <Dropdown.Item
                  key={product?.product_id}
                  onMouseDown={() => handleSelectProduct(product?.productName)}
                >
                  {product?.productName}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.Item>No Search Results Found</Dropdown.Item>
            )}
          </Dropdown.Menu>
        )}
      </div>
    </Container>
  );
};
