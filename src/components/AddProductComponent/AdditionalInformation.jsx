// AdditionalInformation.js
import { Form } from "react-bootstrap";

const AdditionalInformation = ({
  category,
  setCategory,
  isSubscribable,
  setIsSubscribable,
  isReturnable,
  setIsReturnable,
  description,
  setDescription,
}) => {
  // const [deliverylist, setDeliveryList] = useState(["12", "3", "8"]);
  // function updateList(params) {
  //   setDeliveryList((prev) => [...prev, params]);
  // }

  return (
    <div className="category">
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          id="description-product"
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      {/* <Form.Group className="d-flex"> */}
      {/* <Form.Check
          type="checkbox"
          id="is-subscribable"
          label="Subscribable"
          checked={isSubscribable}
          onChange={(e) => setIsSubscribable(e.target.checked)}
          className="me-3"
        /> */}
      {/* <Form.Check
          type="checkbox"
          id="is-returnable"
          label="Returnable"
          checked={isReturnable}
          onChange={(e) => setIsReturnable(e.target.checked)}
        /> */}
      {/* {isSubscribable ? (
          <>
            <h1>delivery time</h1>
            <input type="datetime-local" name="" id="" />
            <Button type="button" onClick={() => updateList()}>
              Add
            </Button>
            {deliverylist?.map((data) => (
              <ul>
                <li>{data}</li>
              </ul>
            ))}
          </>
        ) : (
          <></>
        )} */}
      {/* </Form.Group> */}
    </div>
  );
};

export default AdditionalInformation;
