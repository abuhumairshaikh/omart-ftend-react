import React from "react";
import PasswordUpdateFinalStep from "./PasswordUpdateFinalStep";
import MultiStepForm from "./MuliStepForm";

const PasswordUpdatePage = () => {
  const handleFinalSubmit = (formData) => {
    console.log("Updating password:", formData);
    // Implement your password update logic here
    // You might want to call an API endpoint
  };

  return (
    <div>
      <MultiStepForm
        finalStepComponent={PasswordUpdateFinalStep}
        finalStepProps={{ title: "Forgot Password", type: "forgot" }}
        onFinalSubmit={handleFinalSubmit}
      />
    </div>
  );
};

export default PasswordUpdatePage;
