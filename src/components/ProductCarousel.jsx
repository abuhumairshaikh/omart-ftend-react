import React, { useEffect, useState } from "react";
import { Button, Carousel } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { BASE_URL } from "../constants";
import { useCreateBookmarkMutation } from "../slices/bookmarksApiSlice";
import { handleApiRequest } from "../utils/helper";

const ProductCarousel = ({ imageUrls, productId }) => {
  const { userInformation } = useSelector((state) => state?.auth);
  const user_id = userInformation?.NameIdentifier;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [validImages, setValidImages] = useState([]);

  const [createBookmark] = useCreateBookmarkMutation();

  useEffect(() => {
    const checkImages = async () => {
      const imageValidationPromises = imageUrls.map(async (url) => {
        const baseUrl = `${BASE_URL}/${url.imageURL}`;
        try {
          const response = await fetch(baseUrl);
          if (response.ok) {
            return url;
          }
        } catch (error) {
          console.error("Error loading image:", error);
        }
        return null;
      });

      const results = await Promise.all(imageValidationPromises);
      const valid = results.filter((result) => result !== null); // Filter out invalid images
      setValidImages(valid);
    };

    if (imageUrls.length > 0) {
      checkImages();
    }
  }, [imageUrls]);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  async function addBookmark() {
    const body = {
      userID: user_id,
      type: "",
      id: productId,
    };

    try {
      const response = await handleApiRequest(createBookmark(body).unwrap);
      if (response) {
        toast.success("Added to Favourites");
      }
    } catch (error) {
      toast.error(error);
    }
  }

  // async function deleteBookmark() {}

  const toggleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false);
    } else {
      if (!userInformation) {
        toast.error("Please login to add to favorites");
        return;
      }
      addBookmark();
      setIsFavorite(true);
    }
  };

  if (validImages.length === 0) {
    return <img
    className="d-block w-100"
    src={"https://plus.unsplash.com/premium_photo-1679517155620-8048e22078b1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
    alt={"https://plus.unsplash.com/premium_photo-1679517155620-8048e22078b1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
  />
  }

  return (
    <div className="carousel-container ">
      <Carousel
        data-bs-theme="dark"
        activeIndex={activeIndex}
        onSelect={handleSelect}
        interval={3000}
        pause="hover"
      >
        {validImages.map((url, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={`${BASE_URL}/${url.imageURL}`}
              alt={`Slide ${index + 1}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      <Button
        variant="outline-secondary"
        className="fav-btn"
        onClick={toggleFavorite}
      >
        {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
      </Button>
    </div>
  );
};

export default ProductCarousel;
