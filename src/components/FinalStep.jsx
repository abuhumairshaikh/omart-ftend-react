import React from "react";

const FinalStep = ({
  finalStepComponent: FinalStepComponent,
  formData,
  updateFormData,
  onSubmit,
  onBack,
  resetLoading,
  userRegisterLoading,
  updateToSellerLoading,
}) => {
  return (
    <FinalStepComponent
      formData={formData}
      updateFormData={updateFormData}
      onSubmit={onSubmit}
      onBack={onBack}
      resetLoading={resetLoading}
      userRegisterLoading={userRegisterLoading}
      updateToSellerLoading={updateToSellerLoading}
    />
  );
};

export default FinalStep;
