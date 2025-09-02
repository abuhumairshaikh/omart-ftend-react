import { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import { NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../slices/authSlice";
import { clearCartItems, resetCart } from "../slices/cartSlice";

const UserMenu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { userInformation } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logoutHandler = () => {
    try {
      dispatch(clearCartItems()); // ✅ Reset cart first
      dispatch(resetCart()); // ✅ Reset cart first
      dispatch(logout());

      toast.success("Logged Out Successfully");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.log("error", error);
      toast.error(error?.data?.message || error?.error);
    }
  };

  return (
    <div
      ref={dropdownRef}
      aria-label="user-menu"
      className="d-flex align-items-center"
      style={{ marginLeft: "15px" }}
    >
      <Avatar
        name={userInformation?.Name ?? userInformation?.Surname}
        size="40"
        textSizeRatio={2}
        round={"20px"}
        onClick={toggleDropdown}
        style={{ cursor: "pointer" }}
      />
      <NavDropdown title="" id="username" show={showDropdown} align="end">
        <LinkContainer to="/profile">
          <NavDropdown.Item>Profile</NavDropdown.Item>
        </LinkContainer>
        {userInformation?.Role === "Seller" && (
          <>
            <LinkContainer to="/shop/products">
              <NavDropdown.Item>Products</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/shop/orders">
              <NavDropdown.Item>Orders</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="shop">
              <NavDropdown.Item>My Shop</NavDropdown.Item>
            </LinkContainer>
          </>
        )}

        <LinkContainer to="/shop/users">
          <NavDropdown.Item>Users</NavDropdown.Item>
        </LinkContainer>
        {userInformation?.Role !== "Seller" && (
          <LinkContainer to="/shop/sellers">
            <NavDropdown.Item>Become to Seller</NavDropdown.Item>
          </LinkContainer>
        )}
        <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
      </NavDropdown>
    </div>
  );
};

export default UserMenu;
