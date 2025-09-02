import React from "react";
import MultiStepForm from "./MuliStepForm";
import RegisterUserFinalStep from "./RegisterUserFinalStep";

const RegisterPage = () => {
  const handleFinalSubmit = (formData) => {
    console.log("password:", formData);
  };

  return (
    <div>
      <MultiStepForm
        finalStepComponent={RegisterUserFinalStep}
        finalStepProps={{ title: "Register", type: "register" }}
        onFinalSubmit={handleFinalSubmit}
      />
    </div>
  );
};

export default RegisterPage;
