import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import "./assets/styles/index.css";
import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoute";
import ProductsBySeller from "./components/ProductsBySeller.jsx";
import reportWebVitals from "./reportWebVitals";
import AddProductScreen from "./screens/admin/AddProductScreen";
import OrderDetail from "./screens/admin/OrderDetail";
import OrderListScreen from "./screens/admin/OrderListScreen";
import ProductEditScreen from "./screens/admin/ProductEditScreen";
import Shop from "./screens/admin/Shop";
import UserEditScreen from "./screens/admin/UserEditScreen";
import UserListScreen from "./screens/admin/UserListScreen";
import BookMarkScreen from "./screens/BookMarkScreen";
import CartScreen from "./screens/CartScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import OrderScreen from "./screens/OrderScreen";
import PasswordUpdatePage from "./screens/PasswordUpdatePage";
import PaymentScreen from "./screens/PaymentScreent";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import PrivacyPolicy from "./screens/PrivacyPolicy.js";
import ProductDetailPage from "./screens/ProductDetailPage";
import SubscriptionFormPage from "./screens/ProductSubscribe";
import ProfileScreen from "./screens/ProfileScreen";
import RegisterPage from "./screens/RegisterPage";
import RegisterSellerScreen from "./screens/RegisterSellerScreen";
import ResetPassword from "./screens/ResetPassword";
import ShippingScreen from "./screens/ShippingScreen";
import store from "./store";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/search/:keyword" element={<HomeScreen />} />
      <Route path="/page/:pageNumber" element={<HomeScreen />} />
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<HomeScreen />}
      />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/subscribe/:id" element={<SubscriptionFormPage />} />
      <Route path="/seller/:name/:id" element={<ProductsBySeller />} />

      <Route path="/order/:id" element={<OrderDetail />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/bookmarks" element={<BookMarkScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/forgot-password" element={<PasswordUpdatePage />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
      <Route path="" element={<AdminRoute />}>
        <Route path="/shop/orders" element={<OrderListScreen />} />
        <Route path="/shop/products" element={<ProductsBySeller />} />
        {/* <Route path="/shop/products" element={<ProductListScreen />} /> */}
        <Route path="/shop/createproducts" element={<AddProductScreen />} />
        <Route path="/shop/update" element={<ProfileScreen />} />
        <Route path="/shop" element={<Shop />} />
        {/* <Route
          path="/shop/products/:pageNumber"
          element={<ProductListScreen />}
        /> */}
        <Route
          path="/shop/products/:pageNumber"
          element={<ProductsBySeller />}
        />
        <Route path="/shop/order/:id" element={<OrderScreen />} />

        <Route path="/shop/users" element={<UserListScreen />} />
        <Route path="/shop/sellers" element={<RegisterSellerScreen />} />
        <Route path="/shop/editproduct/:id" element={<ProductEditScreen />} />
        <Route path="/shop/user/:id/edit" element={<UserEditScreen />} />
        <Route path="/contact" element={<UserEditScreen />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider
            router={router}
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
              v7_fetcherPersist: true,
              v7_normalizeFormMethod: true,
              v7_partialHydration: true,
              v7_skipActionErrorRevalidation: true,
            }}
          />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
