/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import LogoLoader from "../components/LogoLoader";
import { setCredentials } from "../slices/authSlice";
import { useLoginMutation } from "../slices/usersApiSlice";
import { parseJwt } from "../utils/helper";
const LoginScreen = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { search } = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [login, { isLoading }] = useLoginMutation();

  const { userInformation } = useSelector((state) => state?.auth);
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  useEffect(() => {
    if (userInformation) {
      navigate(from, { replace: true });
    }
  }, [navigate, from, userInformation]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({
        email: formData?.email?.includes("@") ? formData?.email : "",
        password: formData?.password,
        mobileNumber: !formData?.email?.includes("@") ? formData?.email : "",
      }).unwrap();

      const decodedToken = parseJwt(res?.token);
      localStorage.setItem("token", JSON.stringify(res));
      dispatch(setCredentials({ ...decodedToken }));
      toast.success("Logged In successfully");
      navigate(from, { replace: true });
    } catch (error) {
      // console.log("catch", error);
      toast.error(
        error?.data?.message || error?.error || "Invalid Credentials"
      );
    }
  };
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    const phoneNumberPattern = /^[0-9]*$/;

    if (phoneNumberPattern.test(value) && value.length <= 10) {
      setFormData((prevData) => ({
        ...prevData,
        phoneNumber: value,
      }));
    } else if (value.length > 10) {
      setError("Phone number cannot exceed 10 digits");
    } else {
      setError("Only numbers are allowed");
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Contact Number (+91)</Form.Label>
          <Form.Control
          //  type={formData?.email?.includes("@") ? "email" : "text"}
            placeholder="Enter Phone"
           // value={formData?.email}
            onChange={handleInputChange}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2 justify-content-end" controlId="password">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={formData?.password}
              onChange={handleInputChange}
            />
            <Button variant="outline-secondary" onClick={handleTogglePassword}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputGroup>
          {/* {formData?.password?.length > 0 && error.length > 0 && (
            <Form.Text className="text-danger">
              <ul>
                {error?.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </Form.Text>
          )} */}
        </Form.Group>

        <Button
          disabled={isLoading}
          type="submit"
          variant="light"
          className="mt-2 border-black "
        >
          Sign In
        </Button>

        {isLoading && <LogoLoader />}
      </Form>

      {/* <Row className="py-3">
        <Col>
          {" "}
          <Link to={from ? `/register?redirect=${from}` : "/register"} className="btn btn-light">
            Register
          </Link>{" "}
          <br />
          <Link to={"/forgot-password"}>Forgot Password</Link>
        </Col>
      </Row> */}


      <Row className="py-3">
        <Col className="d-flex align-items-center gap-2">
         <Link to="/forgot-password" className="btn  btn-sm btn-secondary">
            Forgot Password
          </Link>
          <Link
            to={from ? `/register?redirect=${from}` : "/register"}
            className="btn btn-sm btn-secondary"
          >
            Register
          </Link>
         
        </Col>
      </Row>

    </FormContainer>
  );
};

export default LoginScreen;
