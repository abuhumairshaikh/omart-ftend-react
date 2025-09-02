/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdditionalInformation from "../../components/AddProductComponent/AdditionalInformation";
import GeneralInformation from "../../components/AddProductComponent/GeneralInformation";
import ImageCarousel from "../../components/AddProductComponent/ImageCarousel";
import Pricing from "../../components/AddProductComponent/Pricing";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";
import { handleApiRequest } from "../../utils/helper";

const AddProductScreen = () => {
  // States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [coverImageName, setCoverImageName] = useState("");

  const [category, setCategory] = useState("");
  const [unitofQuantity, setUnitofQuantity] = useState(0);
  const [unitofMeasure, setUnitofMeasure] = useState("");
  const [isSubscribable, setIsSubscribable] = useState(false);
  const [isReturnable, setIsReturnable] = useState(false);
  const [images, setImages] = useState([]);
  const [productId, setProductId] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [times, setTimes] = useState([]);
  const [subscriptionMode, setSubscriptionMode] = useState("");

  // Redux
  const { userInformation } = useSelector((state) => state?.auth);
  const user_id = userInformation?.NameIdentifier;
  const entityId = userInformation?.sellerID;
  const navigate = useNavigate();

  // API Mutations
  const [createProducts, { isLoading: isProductLoading }] =
    useCreateProductMutation();
  const [uploadImage, { isLoading: isImageLoading }] =
    useUploadProductImageMutation();

  // Helper Methods
  const addTime = (newTime) => {
    if (!times.includes(newTime)) {
      setTimes([...times, newTime]);
    } else {
      toast.error("Time already exists in the list");
    }
  };

  const removeTime = (index) => {
    setTimes((prevTimes) => prevTimes.filter((_, i) => i !== index));
  };

  const handleSaveFullProduct = async () => {
    if (!images.length) {
      toast.error("Please upload at least one image");
      return;
    }
    const formData = new FormData();
    formData.append("ProductID", productId);

    uploadedFiles.forEach((file) => {
      formData.append("MultipleFiles", file);
    });
    formData.append("coverImageName", coverImageName);
    try {
      let response = await handleApiRequest(() =>
        uploadImage(formData).unwrap()
      );
      toast.success("Product images uploaded successfully");
      // Redirect to products page
      navigate("/shop");
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  const handleSkip = async () => {
    navigate("/shop");
  };
  const handleSaveProductDetails = async () => {
    const body = {
      entity_id: entityId,
      category: category,
      details: description,
      price: price,
      brand: brand,
      stock_quantity: stock,
      currency_mode: "INR",
      productName: name,
      unitofMeasure,
      unitofQuantity,
    };

    try {
      let response = await handleApiRequest(() =>
        createProducts(body).unwrap()
      );
      setProductId(response.product_id);
      toast.success("Product details saved successfully");
      // Clear form fields
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
    } catch (error) {
      toast.error("Failed to save product details");
    }
  };

  return (
    <Container className="app-container">
      <div className="align-items-center text-start mb-2 p-3">
        <h1>Add Product</h1>
      </div>
      <Form>
        {productId && (
          <div className="mb-4 justify-center">
            <ImageCarousel
              images={images}
              setImages={setImages}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              coverImageName={coverImageName}
              setCoverImageName={setCoverImageName}
            />
          </div>
        )}
        <Row>
          <Col md={6}>
            {!productId && (
              <div className="mb-4">
                <GeneralInformation name={name} setName={setName} />
              </div>
            )}
          </Col>
          <Col md={6}>
            {!productId && (
              <>
                <div className="mb-4">
                  <Pricing
                    price={price}
                    brand={brand}
                    setBrand={setBrand}
                    currency={currency}
                    unitofQuantity={unitofQuantity}
                    unitofMeasure={unitofMeasure}
                    stock={stock}
                    setPrice={setPrice}
                    setCurrency={setCurrency}
                    setStock={setStock}
                    setUnitofMeasure={setUnitofMeasure}
                    setUnitofQuantity={setUnitofQuantity}
                  />
                </div>
                <div className="mb-4">
                  <AdditionalInformation
                    category={category}
                    isSubscribable={isSubscribable}
                    isReturnable={isReturnable}
                    description={description}
                    setIsSubscribable={setIsSubscribable}
                    setIsReturnable={setIsReturnable}
                    setDescription={setDescription}
                    setCategory={setCategory}
                  />
                </div>
              </>
            )}
          </Col>
        </Row>

        <div className="d-flex flex-column flex-md-row justify-content-end">
          {productId ? (
            <div className="d-flex align-items-center">
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={handleSkip}
              >
                Skip
              </Button>

              <Button
                variant="light"
                className="w-50 border-black"
                onClick={handleSaveFullProduct}
                disabled={isImageLoading}
              >
                {isImageLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Save Product"
                )}
              </Button>
            </div>
          ) : (
            <Button
              variant="light"
              className="w-50 border-black"
              onClick={handleSaveProductDetails}
              disabled={isProductLoading}
            >
              {isProductLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Next"
              )}
            </Button>
          )}
        </div>
      </Form>
    </Container>
  );
};

export default AddProductScreen;
