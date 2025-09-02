/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Badge, Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import LogoLoader from "../../components/LogoLoader";
import Message from "../../components/Message";
import { BASE_URL } from "../../constants";
import {
  useDeleteProductImageMutation,
  useGetProductByIdQuery,
  useGetProductImageMutation,
  useUpdateProductCoverImageMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";
import { handleApiRequest } from "../../utils/helper";

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");

  const [coverImageName, setCoverImageName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [unitofQuantity, setUnitofQuantity] = useState("");
  const [unitofMeasure, setUnitofMeasure] = useState("");
  const [getImageData, { data: imageData }] = useGetProductImageMutation();
  const productImages = imageData && imageData?.data?.productImages;

  const navigate = useNavigate();
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductByIdQuery(productId);
  useEffect(() => {
    const getData = async () => {
      await getImageData({ productId });
    };
    getData();
  }, [getImageData, productId]);

  useEffect(() => {
    const coverImageProduct = productImages?.filter(
      (val) => val?.coverImage === 1
    );
    if (coverImageProduct?.length > 0) {
      setCoverImageName(coverImageProduct?.[0]?.imageName);
    }
  }, [productImages]);

  const productData = product?.data?.productDetails;
  const { userInformation } = useSelector((state) => state?.auth);

  const [updateProduct, { isLoading: loadingProjectUpdate }] =
    useUpdateProductMutation();

  const [deleteProductImage] = useDeleteProductImageMutation();
  const [updateCoverImg] = useUpdateProductCoverImageMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();
  const seller_id = userInformation?.sellerID;

  useEffect(() => {
    if (productData) {
      setPrice(productData?.price);
      setBrand(productData?.brand);
      setName(productData?.productName);
      setDescription(productData?.details);
      setCategory(productData?.category);
      setCountInStock(productData?.stock_quantity);
      setUnitofMeasure(productData?.unitofMeasure);
      setUnitofQuantity(productData?.unitofQuantity);
      setImage(productData.image);
    }
  }, [productData]);

  const {
    establishment_name = "",
    estimated_replacement_time = "",
    imageName = "",
    added_on = "",
    updated_on = "",
    ...restData
  } = productData || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        ...restData,
        product_id: productId,
        entity_id: seller_id,
        productName: name,
        price,
        currency_mode: "INR",
        category,
        details: description,
        stock_quantity: countInStock,
        brand,
        unitofMeasure,
        unitofQuantity,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success("Product updated");
      refetch();
      navigate("/shop/products");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  const handleUploadImage = async (e) => {
    const formData = new FormData();
    formData.append("ProductID", productId);
    formData.append("MultipleFiles", e.target.files[0]);
    formData.append("coverImageName", e.target.files?.[0]?.name);
    try {
      const res = await await handleApiRequest(() =>
        uploadImage(formData).unwrap()
      );
      if (res?.message === "Files uploaded successfully!") {
        await getImageData({ productId });
        toast.success(res?.message);
        // navigate("/shop/products");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  const handleDeleteImage = async (val) => {
    try {
      const res = await handleApiRequest(() =>
        deleteProductImage({
          imageIds: [val?.pdImageID],
        }).unwrap()
      );
      if (res.message === "Image removed") {
        await getImageData({ productId });
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Unable to delete Image");
    }
  };

  const handleCoverImage = async (val) => {
    try {
      if (val?.pdImageID) {
        const res = await handleApiRequest(() =>
          updateCoverImg({ pdImageID: val?.pdImageID }).unwrap()
        );
        if (res.succeeded === true) {
          setCoverImageName(val?.imageName);
        }
      }
      return;
    } catch (error) {
      console.log("error", error);
      toast.error(error);
    }
  };

  return (
    <>
      <Link to="/shop/products" className="btn btn-light my-3">
        Go Back
      </Link>
      <h1>Edit Product</h1>
      <FormContainer>
        {isLoading ? (
          <LogoLoader />
        ) : error ? (
          <Message variant={"danger"}>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="unitofMeasure">
              <Form.Label>Unit of Measure</Form.Label>
              <Form.Control
                placeholder="Enter Unit of Measure"
                value={unitofMeasure}
                onChange={(e) => setUnitofMeasure(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* <Form.Group controlId="unitofQuantity">
              <Form.Label>Unit of Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Unit of Qunatity"
                value={unitofQuantity}
                onChange={(e) => setUnitofQuantity(e.target.value)}
              ></Form.Control>
            </Form.Group> */}
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>

              <Form.Control
                label="Choose File"
                onChange={handleUploadImage}
                type="file"
              ></Form.Control>
              {loadingUpload && <LogoLoader />}
              {/* <p className="mt-2">
                Note: Green tick is cover image or thumbnail image
              </p> */}
              {imageData?.data?.productImages?.length > 0 &&
                imageData?.data?.productImages?.map((val, index) => (
                  <div
                    key={index}
                    className="position-relative d-inline-block mt-3 mx-3"
                  >
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 start-0 translate-middle rounded cursor-pointer"
                      style={{ zIndex: 1 }}
                      onClick={() => handleDeleteImage(val)}
                    >
                      <MdDeleteForever />
                    </Badge>
                    <Badge
                      bg={`${
                        coverImageName === val?.imageName
                          ? "success"
                          : "secondary"
                      }`}
                      className="position-absolute top-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: `${
                          coverImageName === val?.imageName ? "28px" : "26px"
                        }`,
                        height: `${
                          coverImageName === val?.imageName ? "28px" : "26px"
                        }`,
                        transform: "translate(45%, -45%)",
                        zIndex: 1,
                        opacity: coverImageName === val?.imageName ? 1 : 0.4, // 👈 faded effect
                        cursor: "pointer",
                      }}
                    >
                      <FaCheckCircle size={32} />
                    </Badge>
                    {/* )} */}
                    <img
                      src={`${BASE_URL}/${val?.imageURL}`}
                      alt="product"
                      className="img-thumbnail"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        padding: "5px",
                        borderRadius: "10px",
                      }}
                      onError={(e) =>
                        (e.target.src =
                          "https://plus.unsplash.com/premium_photo-1679517155620-8048e22078b1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                      }
                      onClick={() => {
                        handleCoverImage(val);
                      }}
                    />
                  </div>
                ))}
            </Form.Group>
            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button
              type="submit"
              variant="light"
              className="border-black"
              style={{ marginTop: "1rem" }}
              disabled={loadingProjectUpdate}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
