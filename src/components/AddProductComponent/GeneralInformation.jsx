// GeneralInformation.js
import { Form } from "react-bootstrap";

const GeneralInformation = ({ name, setName }) => {
  return (
    <div className="general-information mb-4">
      <Form.Group className="mb-4">
        <Form.Label>Product Name</Form.Label>
        <Form.Control
          type="text"
          id="name-product"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>
    </div>
  );
};

export default GeneralInformation;
