import { useState } from "react";
import "../css/BusDetailsSidebar.css";
import { useNavigate } from "react-router-dom";

import {
  FaWifi,
  FaChargingStation,
  FaSnowflake,
  FaBottleWater,
  FaStar,
  FaBus,
  FaCheck,
} from "react-icons/fa6";

const AMENITY_LIST = [
  { id: "wifi", name: "Free WiFi", icon: FaWifi },
  { id: "charging", name: "Charging", icon: FaChargingStation },
  { id: "water", name: "Water Bottle", icon: FaBottleWater },
  { id: "ac", name: "AC", icon: FaSnowflake },
];

function BusDetailsSidebar({ selectedBus, onClose }) {
  const navigate = useNavigate();
  const [selectedAmenities, setSelectedAmenities] = useState(["ac"]);

  if (!selectedBus) return null;

  const toggleAmenity = (id) => {
    if (selectedAmenities.includes(id)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== id));
    } else {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  const toggleAll = () => {
    if (selectedAmenities.length === AMENITY_LIST.length) {
      setSelectedAmenities([]);
    } else {
      setSelectedAmenities(AMENITY_LIST.map((item) => item.id));
    }
  };

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <div className="bus-sidebar" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          ✖
        </button>

        <h2>
          <FaBus /> {selectedBus.name}
        </h2>

        <div className="rating">
          <FaStar /> 4.7 Rating
        </div>

        <h3>{selectedBus.type}</h3>

        <div className="route">
          {selectedBus.from}
          <span> → </span>
          {selectedBus.to}
        </div>

        <div className="time">
          {selectedBus.departure}
          <span> → </span>
          {selectedBus.arrival}
        </div>

        <hr />

        <div className="amenities-header">
          <h3>Amenities</h3>
          <button
            type="button"
            className="select-all-btn"
            onClick={toggleAll}
          >
            {selectedAmenities.length === AMENITY_LIST.length
              ? "Deselect All"
              : "Select All"}
          </button>
        </div>

        <div className="amenities">
          {AMENITY_LIST.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedAmenities.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={`amenity-btn ${isSelected ? "active" : ""}`}
                onClick={() => toggleAmenity(item.id)}
              >
                <Icon className="amenity-icon" />
                <span>{item.name}</span>
                {isSelected && <FaCheck className="check-icon" />}
              </button>
            );
          })}
        </div>

        <hr />

        <div className="details">
          <p>
            Available Seats
            <span>{selectedBus.seats}</span>
          </p>

          <p>
            Ticket Price
            <span> ₹{selectedBus.price}</span>
          </p>
        </div>

        <button
          className="continue-btn"
          onClick={() =>
            navigate("/seat-selection", {
              state: { bus: selectedBus },
            })
          }
        >
          Continue Booking
        </button>
      </div>
    </div>
  );
}

export default BusDetailsSidebar;
