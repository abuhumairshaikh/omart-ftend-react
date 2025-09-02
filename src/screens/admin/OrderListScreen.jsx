import { Alert, Button, Container, Table } from "react-bootstrap";
import { FaEye, FaTimes } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import LogoLoader from "../../components/LogoLoader";
import Message from "../../components/Message";
import { useGetOrdersQuery } from "../../slices/orderApiSlice";

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  console.log("orders", orders);

  return (
    <Container>
      <h1 className="my-4">Orders</h1>
      {isLoading ? (
        <LogoLoader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {orders.length === 0 ? (
            <Alert variant="info">No orders found</Alert>
          ) : (
            <Table striped hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order?._id}</td>
                    <td>{order?.user?.name}</td>
                    <td>{order?.createdAt.substring(0, 10)}</td>
                    <td>
                      {order?.isPaid ? (
                        order?.paidAt?.substring(0, 10)
                      ) : (
                        <FaTimes color="red" />
                      )}
                    </td>
                    <td>
                      {order?.isDelivered ? (
                        order?.deliveredAt?.substring(0, 10)
                      ) : (
                        <FaTimes color="red" />
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant="light" title="View Details">
                          <FaEye />
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </Container>
  );
};

export default OrderListScreen;
