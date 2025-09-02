import React, { useEffect, useRef, useState } from "react";
import { Badge, Button, Carousel } from "react-bootstrap";
import { FaCheckCircle, FaTrash } from "react-icons/fa";

const ImageCarousel = ({
  images,
  setImages,
  uploadedFiles,
  setUploadedFiles,
  coverImageName,
  setCoverImageName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageInput = useRef(null);
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const defaultCoverImage = uploadedFiles?.[0]?.name ?? "";
      setCoverImageName(defaultCoverImage);
    }
  }, [setCoverImageName, uploadedFiles]);

  const handleImageAdd = (event) => {
    const files = event.target.files;

    if (!files.length) return;

    // Check if adding these files exceeds the limit
    if (images.length + files.length > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }

    // Convert FileList to array
    const newFiles = Array.from(files);

    // Ensure all files are images
    for (const file of newFiles) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload only image files.");
        return;
      }
    }

    // Update images and uploaded files state
    const newImageUrls = newFiles.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...newImageUrls]);

    // Use functional update to ensure we're adding to the latest state
    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles]; // Convert FileList to array
      return updatedFiles;
    });

    setCurrentIndex(images.length);
    event.target.value = ""; // Reset input
  };

  const handleAddImageClick = () => {
    imageInput.current.click();
  };

  const handleImageRemove = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );

    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );

    // Optionally update currentIndex if needed
    setCurrentIndex((prevIndex) =>
      prevIndex >= indexToRemove && prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };
  const handleCoverImage = (val) => {
    setCoverImageName(val?.name);
  };

  return (
    <div className="image-carousel">
      <div className="large-image-container">
        {images.length > 0 ? (
          <Carousel activeIndex={currentIndex} onSelect={setCurrentIndex}>
            {images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  src={image}
                  alt={`Slide ${index}`}
                  className="d-block w-100"
                  style={{ maxHeight: "300px", objectFit: "contain" }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <div className="placeholder-container">
            <Button
              onClick={handleAddImageClick}
              className="add-image-button border-black"
              variant="light"
            >
              Add Image
            </Button>
          </div>
        )}
      </div>
      {images?.length > 0 && (
        <Button onClick={handleAddImageClick} className="add-image-button">
          Add Image
        </Button>
      )}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {uploadedFiles?.map((file, index) => (
          <div
            key={index}
            className="position-relative d-inline-block mt-3 mx-3"
          >
            {/* Show green badge if this is the cover image */}
            {/* {coverImageName === file?.name && ( */}
            <Badge
              // bg="success"
              bg={`${coverImageName === file?.name ? "success" : "secondary"}`}
              className="position-absolute top-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: `${coverImageName === file?.name ? "28px" : "26px"}`,
                height: `${coverImageName === file?.name ? "28px" : "26px"}`,
                transform: "translate(45%, -45%)",
                zIndex: 1,
                opacity: coverImageName === file?.name ? 1 : 0.4, // 👈 faded effect
                cursor: "pointer",
              }}
            >
              <FaCheckCircle size={20} />
            </Badge>
            {/* )} */}

            {/* Image Thumbnail */}
            <img
              src={URL.createObjectURL(file)}
              alt={`Uploaded ${file?.name}`}
              className="img-thumbnail m-2"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                handleCoverImage(file);
              }}
            />

            {/* Remove Button Below Image */}
            <div className="text-center mt-1">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleImageRemove(index)}
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageAdd}
        style={{ display: "none" }}
        ref={imageInput}
      />
    </div>
  );
};

export default ImageCarousel;
