import MultiStepForm from "./MuliStepForm";
import RegisterSellerFinalStep from "./RegisterSellerFinalStep";
const RegisterSellerScreen = () => {
  const handleFinalSubmit = (formData) => {
    // Implement your password update logic here
    // You might want to call an API endpoint
  };

  return (
    <div>
      <MultiStepForm
        finalStepComponent={RegisterSellerFinalStep}
        finalStepProps={{ title: "Update Seller", type: "seller" }}
        onFinalSubmit={handleFinalSubmit}
      />
    </div>
  );
};

export default RegisterSellerScreen;
