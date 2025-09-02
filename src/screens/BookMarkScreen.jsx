import React from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  useDeleteBookmarkMutation,
  useGetBookMarksByIdQuery,
} from "../slices/bookmarksApiSlice";
import { BASE_URL } from "../constants";

const BookMarkScreen = () => {
  const { userInformation } = useSelector((state) => state?.auth);
  const user_id = userInformation?.NameIdentifier;

  const {
    data: bookmarks,
    isLoading,
    refetch,
  } = useGetBookMarksByIdQuery(user_id, { skip: !user_id });

  const [deleteBookmark] = useDeleteBookmarkMutation();

  const handleDelete = async (bookmarkID) => {
    try {
      await deleteBookmark(bookmarkID).unwrap();
      // Refetch bookmarks to update the screen
      toast.success("Removed from Favourite");
      refetch();
    } catch (error) {
      console.error("Failed to delete: ", error);
    }
  };

  if (isLoading)
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container fluid>
      <Row>
        {!bookmarks?.bookmarks.length > 0 ? (
          <div className="d-flex justify-content-center align-items-center vh-100">
            <p>No Favourites</p>
          </div>
        ) : (
          bookmarks?.bookmarks?.map((bookmark) => (
            <Col
              xs={12}
              md={4}
              lg={4}
              className="mb-1"
              key={bookmark.bookMarkID}
            >
              <Card className="border rounded">
                <Card.Body>
                  <Link
                    to={`/product/${bookmark?.product_id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <Row>
                      <Col className="d-flex justify-content-center align-items-center">
                        <img
                          alt="Bookmark"
                          style={{ width: "100%", height: "auto" }}
                          src={`${BASE_URL}/api/Files/download/${bookmark?.imageName}`}
                          onError={(e) =>
                            (e.target.src =
                              "https://plus.unsplash.com/premium_photo-1679517155620-8048e22078b1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                          }
                        />
                      </Col>
                      <Col>
                        <h4>{bookmark.productName || "No Name"}</h4>
                        <p>
                          {bookmark.establishment_name ||
                            "No Establishment Name"}
                        </p>
                      </Col>
                    </Row>
                  </Link>
                </Card.Body>
                <div className="d-flex justify-content-end pb-2 px-2">
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(bookmark.bookMarkID)}
                  >
                    <FaTrashAlt />
                  </Button>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default BookMarkScreen;
