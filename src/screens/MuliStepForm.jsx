import React, { useState } from "react";
import { Col, Container, ProgressBar, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { EmailStep } from "../components/EmailStep";
import FinalStep from "../components/FinalStep";
import { MobileStep } from "../components/MobileStep";
import { OtpStep } from "../components/OtpStep";
import {
  logout,
  setCredentials,
  setUserEmail,
  setUserPhone,
} from "../slices/authSlice";
import {
  useRegisterSellerMutation,
  useSentSellerRegistationEmailMutation,
  useVerifySellerOtpMutation,
} from "../slices/sellerApiSlice";
import {
  useForgotPasswordMailMutation,
  useLoginMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useSentRegistationEmailMutation,
  useSentUserRegsitrationPhoneMutation,
  useVerifyUserMobileOtpMutation,
} from "../slices/usersApiSlice";
import { handleApiRequest, parseJwt } from "../utils/helper";
import { clearCartItems, resetCart } from "../slices/cartSlice";
// Final Form Step Component

// Main MultiStepForm Component
const MultiStepForm = ({ finalStepComponent, finalStepProps }) => {
  const { type } = finalStepProps;
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const userPhone = useSelector((state) => state?.auth?.number);
  const userEmail = useSelector((state) => state?.auth?.email);
  const { userInformation } = useSelector((state) => state?.auth);
  const [phoneNumber, setPhoneNumber] = useState(userPhone ?? "");
  const urlPath = useLocation();
  const [verifyMobileOtp, { isLoading: verifyMobileLoading }] =
    useVerifyUserMobileOtpMutation();

  const [verifySellerOtp, { isLoading: verifyOtpSellerLoading }] =
    useVerifySellerOtpMutation();
  const [sendRegistrationEmail, { isLoading: registerLoading }] =
    useSentRegistationEmailMutation();
  const [sendMobileOtp, { isLoading: mobileOtpLoading }] =
    useSentUserRegsitrationPhoneMutation();
  const [login] = useLoginMutation();

  // eslint-disable-next-line no-unused-vars
  const [sendSellerRegistrationEmail, { isLoading: registerSellerLoading }] =
    useSentSellerRegistationEmailMutation();
  const [forgotPasswordMail, { isLoading }] = useForgotPasswordMailMutation();
  const [resetPassword, { isLoading: resetLoading }] =
    useResetPasswordMutation();
  const [register, { isLoading: userRegisterLoading }] = useRegisterMutation();
  const userInfo = useSelector((state) => state?.auth?.userInformation);
  const [registerSeller, { isLoading: registerAsSellerLoading }] =
    useRegisterSellerMutation();

  const logoutHandler = () => {
    try {
      dispatch(clearCartItems()); // ✅ Reset cart first
      dispatch(resetCart()); // ✅ Reset cart first
      dispatch(logout()); // ✅ Then clear user info
    } catch (error) {
      console.log("error", error);
      toast.error(error?.data?.message || error?.error);
    }
  };

  const handleResendOtp = async () => {
    try {
      let response;
      if (type === "forgot") {
        // 2 = Forgot password
        response = await handleApiRequest(() =>
          sendMobileOtp({ number: +phoneNumber, otpType: 2 }).unwrap()
        );
      } else if (type === "register") {
        // 1 = user registration
        response = await handleApiRequest(() =>
          sendMobileOtp({ number: +phoneNumber, otpType: 1 }).unwrap()
        );
      } else if (type === "seller") {
        response = await handleApiRequest(() =>
          sendSellerRegistrationEmail({ email })
        );
      }
      // console.log("response", response);
      if (response?.succeeded === true) {
        toast.success("OTP Resent Successfully");
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (type === "forgot") {
        response = await handleApiRequest(() => forgotPasswordMail({ email }));
        if (response?.data?.succeeded === true) {
          setStep(2);
          toast.success("Otp Sent");
        }
      } else if (type === "register") {
        response = await handleApiRequest(() =>
          sendRegistrationEmail({ email })
        );
        if (response?.data?.succeeded === true) {
          setStep(2);
          toast.success("Otp Sent");
        }
      } else if (type === "seller") {
        response = await handleApiRequest(() =>
          sendSellerRegistrationEmail({
            userId: userInformation?.NameIdentifier,
            email,
          })
        );
        if (response?.data?.succeeded === true) {
          setStep(2);
          toast.success("Otp Sent");
        }
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handlePhoneNumberSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (type === "register") {
        // 1 = user registration
        response = await handleApiRequest(() =>
          sendMobileOtp({ number: +phoneNumber, otpType: 1 }).unwrap()
        );
        if (response?.succeeded === true) {
          toast.success("Otp Sent");
          dispatch(setUserPhone(phoneNumber));
          setStep(2);
        }
      } else if (type === "forgot") {
        // 2 = Forgot password
        response = await handleApiRequest(() =>
          sendMobileOtp({ number: +phoneNumber, otpType: 2 }).unwrap()
        );
        if (response && response?.succeeded === true) {
          toast.success("Otp Sent");
          dispatch(setUserPhone(phoneNumber));
          setStep(2);
        }
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      try {
        let res;
        if (type === "seller") {
          res = await handleApiRequest(() => verifySellerOtp({ email, otp }));
          if (res && res?.data?.succeeded === true) {
            toast.success("Otp Verified");
            dispatch(setUserEmail(email));
            setStep(3);
          }
        } else if (type === "forgot") {
          // 2 = Forgot OTP verification
          res = await handleApiRequest(() =>
            verifyMobileOtp({ number: +phoneNumber, otp, otpType: 2 }).unwrap()
          );
          if (res && res?.succeeded === true) {
            toast.success("Otp Verified");
            setStep(3);
          } else {
            toast.error(res?.messages[0] ?? "Invalid Otp");
          }
        } else {
          // Registration OTP verification
          // 1 = user registration
          res = await handleApiRequest(() =>
            verifyMobileOtp({ number: +phoneNumber, otp, otpType: 1 }).unwrap()
          );
          if (res && res?.succeeded === true) {
            toast.success("Otp Verified");
            // dispatch(setUserEmail(email));
            setStep(3);
          }
        }
      } catch (error) {
        console.log("error", error);
        toast.error(error?.message);
      }
    } else {
      toast.error("Please complete the OTP");
    }
  };

  const handleFinalSubmit = async (data) => {
    // console.log("Submitting form data", data);
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      if (type === "forgot") {
        if (data?.password === data?.confirmPassword) {
          const res = await resetPassword({
            mobileNumber: +userPhone,
            newPassword: data?.password,
          }).unwrap();
          toast.success(res?.data?.message ?? "Password Reset Successfully");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          if (data?.password !== data?.confirmPassword) {
            toast.error("Passwords do not match.");
          } else {
            toast.error("Please fix the errors in the password field.");
          }
        }
      } else if (type === "register") {
        if (data?.password === data?.confirmPassword) {
          const { confirmPassword, email, ...dataToSend } = data;
          const registerPayload = {
            contactPhoneNumber: userPhone,
            ContactEmail: data?.email,
            ...dataToSend,
          };
          const res = await register(registerPayload).unwrap();
          if (res?.succeeded === true) {
            toast.success(res && res?.messages?.[0]);
            const loginRes = await login({
              email: "",
              password: data?.password,
              mobileNumber: userPhone,
            }).unwrap();
            const decodedToken = parseJwt(loginRes?.token);
            localStorage.setItem("token", JSON.stringify(loginRes));
            dispatch(setCredentials({ ...decodedToken }));
            setTimeout(() => {
              toast.success("Logged In successfully");
              navigate("/");
            }, 2000);
          }
        } else {
          if (data?.password !== data?.confirmPassword) {
            toast.error("Passwords do not match.");
          } else {
            toast.error("Please fix the errors in the password field.");
          }
        }
      } else if (type === "seller") {
        if (userInfo?.NameIdentifier) {
          const { deliveryRadius, ...rest } = data;
          const sellerPayload = {
            user_id: userInfo?.NameIdentifier,
            companyEmail: userEmail,
            contactPhoneNumber: userInfo?.MobilePhone,
            deliveryRadius: data?.deliveryRadiusMeters,
            ...rest,
          };
          const { deliveryRadiusMeters, ...restSellerPaylaod } = sellerPayload;
          const res = await registerSeller(restSellerPaylaod).unwrap();
          toast.success(res && res?.messages[0]);
          setTimeout(() => {
            navigate("/login");
            logoutHandler();
          }, 3000);
        }
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error?.data?.messages[0] || error?.error);
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const updateFormData = (newData) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            {urlPath.pathname === "/register" ||
            urlPath.pathname === "/forgot-password" ? (
              <MobileStep
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                onSubmit={handlePhoneNumberSubmit}
                isLoading={mobileOtpLoading}
              />
            ) : (
              <EmailStep
                email={email}
                setEmail={setEmail}
                onSubmit={handleEmailSubmit}
                isLoading={isLoading}
                registerLoading={registerLoading}
                registerSellerLoading={registerSellerLoading}
              />
            )}
          </>
        );
      case 2:
        return (
          <OtpStep
            otp={otp}
            setOtp={setOtp}
            onSubmit={handleOtpSubmit}
            onBack={handleBack}
            verifyLoading={verifyMobileLoading}
            verifyForgotOtpLoading={verifyMobileLoading}
            verifyOtpSellerLoading={verifyOtpSellerLoading}
            onResendOtp={handleResendOtp}
          />
        );
      case 3:
        return (
          <FinalStep
            finalStepComponent={finalStepComponent}
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleFinalSubmit}
            onBack={handleBack}
            resetLoading={resetLoading}
            userRegisterLoading={userRegisterLoading}
            updateToSellerLoading={registerAsSellerLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2 className="text-center mb-4">{finalStepProps?.title}</h2>
          <ProgressBar
            now={(step / 3) * 100}
            label={`${step} of 3`}
            className="mb-4"
          />
          {renderStep()}
        </Col>
      </Row>
    </Container>
  );
};

export default MultiStepForm;
