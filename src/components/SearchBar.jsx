import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { FaMapMarkerAlt } from "react-icons/fa";

const SearchBar = () => {
  const [location, setLocation] = useState("Palava");
  const [showDropdown, setShowDropdown] = useState(false);
  const mumbaiAreas = [
    "Navi Mumbai",
    "Kurla",
    "Andheri",
    "Bandra",
    "Dadar",
    "Palava",
  ];

  // eslint-disable-next-line no-unused-vars
  const MAP_ENV = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

  const getCurrentLocation = () => {};

  useEffect(() => {
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setShowDropdown(false);
  };

  return (
    <div className="search-bar d-flex">
      {/* Clickable icon for location */}
      <FaMapMarkerAlt
        color="#FC8019"
        onClick={getCurrentLocation}
        role="button"
        style={{ fontSize: "24px", cursor: "pointer" }}
      />

      {/* Location display and dropdown toggle */}
      <span
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ marginLeft: "8px", cursor: "pointer" }}
      >
        {location} ▼
      </span>

      {/* Dropdown Menu */}
      {showDropdown && (
        <Dropdown className="mt-2" show={showDropdown} drop="down">
          <Dropdown.Menu>
            {mumbaiAreas.map((area, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => handleLocationSelect(area)}
              >
                {area}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};

export default SearchBar;
