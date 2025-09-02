import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { Badge, Navbar } from "react-bootstrap";
import {
  AiOutlineBook,
  AiOutlineHome,
  AiOutlineShop,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetCartByUserIdQuery } from "../slices/cartApiSlice";
import { useGetOrderBySellerIdMutation } from "../slices/orderApiSlice";

const BottomNavbar = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInformation } = useSelector((state) => state.auth);
  const user_id = userInformation && userInformation?.NameIdentifier;
  const sellerId = userInformation && userInformation?.sellerID;
  const { data } = useGetCartByUserIdQuery(user_id, {
    skip: !user_id, // Skip the query if user_id is falsy
  });
  const navigate = useNavigate();
  const cartData = data && data?.data?.carts;
  const updatedCart =
    cartData &&
    Object?.values(
      cartData?.reduce((acc, item) => {
        if (!acc[item?.product_id]) {
          acc[item?.product_id] = { ...item };
        } else {
          acc[item?.product_id].quantity += item?.quantity;
        }
        return acc;
      }, {})
    );

  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const getLinkStyle = (path) => {
    return {
      color: activeLink === path ? "red" : "black", // Example colors - Bootstrap primary and secondary
    };
  };
  const token = localStorage.getItem("token");

  const [getOrder] = useGetOrderBySellerIdMutation();
  useEffect(() => {
    if (!sellerId) return;
    const getData = async () => {
      await getOrder({
        entity_id: sellerId,
      });
    };
    getData();
  }, [getOrder, sellerId]);

  useEffect(() => {
    if (!sellerId || !token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://qabck.suuq.in/refreshHub?sellerId=${sellerId}`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log("SignalR connected"))
      .catch((err) => console.error("SignalR connection error:", err));

    connection.on("ReceiveOrderNotification", async (payload) => {
      console.log("Order notification received", payload);
      alert("New order received! Orders refreshed.");
      // Optional: Show notification
      // Refetch the orders
      // window.location.reload();
      if (location.pathname !== "/shop") {
        navigate("/shop");
        await getOrder({ entity_id: sellerId });
      }
      // Refetch latest orders

      // Optional: Show notification
    });

    return () => {
      connection.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerId, getOrder, token, navigate]);

  return (
    <Navbar
      fixed="bottom"
      className="justify-content-around navbar-glassmorph d-lg-none"
      style={{ borderTop: "1px solid grey", position: "fixed", bottom: 0 }}
    >
      <Link
        to="/"
        className="nav-link d-flex flex-column align-items-center"
        style={getLinkStyle("/")}
      >
        <AiOutlineHome size={24} />
        <span className="small">Home</span>
      </Link>

      <Link
        to="/profile"
        className="nav-link d-flex flex-column align-items-center"
        style={getLinkStyle("/profile")}
      >
        <AiOutlineUser size={24} />
        <span className="small">You</span>
      </Link>

      <Link
        to="/cart"
        className="nav-link d-flex flex-column align-items-center nav-link-cart"
        style={getLinkStyle("/cart")}
      >
        <AiOutlineShoppingCart size={24} />
        <span className="small">Cart</span>
        {(updatedCart?.length > 0 || cartItems?.length > 0) && (
          <Badge
            pill
            bg="success"
            className="nav-icon-pill"
            style={{ top: "-10px", left: "25px" }}
          >
            {(updatedCart?.length ?? 0) > 0
              ? updatedCart.length
              : cartItems?.length ?? 0}
          </Badge>
        )}
      </Link>

      <Link
        to="/bookmarks"
        className="nav-link d-flex flex-column align-items-center"
        style={getLinkStyle("/bookmarks")}
      >
        <AiOutlineBook size={24} />
        <span className="small">Favourites</span>
      </Link>

      {userInformation?.Role === "Seller" && (
        <Link
          to="/shop"
          className="nav-link d-flex flex-column align-items-center"
          style={getLinkStyle("/shop")}
        >
          <AiOutlineShop size={24} />
          <span className="small">My Shop</span>
        </Link>
      )}
    </Navbar>
  );
};

export default BottomNavbar;
