import { useEffect, useState } from "react";
import { Alert, Button, Container, Table } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useParams } from "react-router-dom";
import LogoLoader from "../../components/LogoLoader";
import Message from "../../components/Message";
import { INR_CHAR } from "../../constants";
import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "../../slices/orderApiSlice";

const OrderDetailScreen = () => {
  const { id } = useParams();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const { data: order, isLoading, error } = useGetOrderByIdQuery(id);
  const [statusUpdateError, setStatusUpdateError] = useState("");

  useEffect(() => {
    if (error) {
      setStatusUpdateError(error?.data?.message || error.error);
    }
  }, [error]);

  const handleOutOfDelivery = async () => {
    try {
      await updateOrderStatus({ id, status: "out_of_delivery" }).unwrap();
      window.location.reload(); // Refresh the page to get the updated status
    } catch (error) {
      setStatusUpdateError(error?.data?.message || error.error);
    }
  };

  return (
    <Container>
      <h1 className="my-4">Order Details</h1>
      {isLoading ? (
        <LogoLoader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : order ? (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <tbody>
              <tr>
                <th>ID</th>
                <td>{order._id}</td>
              </tr>
              <tr>
                <th>User</th>
                <td>{order.user.name}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{order.createdAt.substring(0, 10)}</td>
              </tr>
              <tr>
                <th>Paid</th>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes color="red" />
                  )}
                </td>
              </tr>
              <tr>
                <th>Delivered</th>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes color="red" />
                  )}
                </td>
              </tr>
              <tr>
                <th>Total Price</th>
                <td>{`${INR_CHAR} ${order.totalPrice}`}</td>
              </tr>
              {/* Add more details as needed */}
            </tbody>
          </Table>
          {statusUpdateError && (
            <Alert variant="danger">{statusUpdateError}</Alert>
          )}
          <Button variant="warning" onClick={handleOutOfDelivery}>
            Mark as Out of Delivery
          </Button>
        </>
      ) : (
        <Message variant="info">Order not found</Message>
      )}
    </Container>
  );
};

export default OrderDetailScreen;
