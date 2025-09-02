import React from "react";
import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router for navigation

const LocationSelection = () => {
  const navigate = useNavigate();

  // List of predefined Mumbai areas
  const mumbaiAreas = ["Navi Mumbai", "Kurla", "Andheri", "Bandra", "Dadar"];

  // Function to handle location selection
  const handleLocationSelect = (selectedLocation) => {
    // Redirect back to the main page with the selected location
    navigate("/", { state: { selectedLocation } });
  };

  return (
    <div className="location-selection-page">
      <h3>Select a Location</h3>
      <ListGroup>
        {mumbaiAreas.map((area, index) => (
          <ListGroup.Item
            key={index}
            action
            onClick={() => handleLocationSelect(area)}
          >
            {area}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default LocationSelection;
