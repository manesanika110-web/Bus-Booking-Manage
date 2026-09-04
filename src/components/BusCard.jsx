import "../css/BusCard.css";
import {
  FaStar,
  FaArrowRight,
  FaWifi,
  FaChargingStation,
  FaSnowflake,
  FaBottleWater,
  FaShieldHalved,
  FaTicketSimple,
} from "react-icons/fa6";

function BusCard({ bus, onViewSeats, searchDate }) {
  const isHighRating = (bus.rating || 4.7) >= 4.7;

  return (
    <div className="bus-card-pro">
      <div className="bus-card-main">
        {/* Operator & Rating */}
        <div className="bus-operator-section">
          <div className="op-title-row">
            <h3 className="bus-name">{bus.name}</h3>
            {isHighRating && (
              <span className="top-rated-tag">
                <FaShieldHalved /> Top Rated
              </span>
            )}
          </div>
          <span className="bus-category-pill">{bus.type}</span>
          <div className="rating-badge">
            <FaStar /> {bus.rating || 4.8}
            <span className="rating-count">({Math.floor(100 + (bus.id * 17) % 400)}+ reviews)</span>
          </div>
        </div>

        {/* Route & Timings */}
        <div className="bus-timing-route-section">
          <div className="time-block dep">
            <span className="time-value">{bus.departure}</span>
            <span className="city-name">{bus.from}</span>
          </div>

          <div className="duration-track">
            <span className="duration-text">{bus.duration}</span>
            <div className="track-bar">
              <span className="track-dot start"></span>
              <span className="track-line"></span>
              <FaArrowRight className="track-arrow" />
              <span className="track-dot end"></span>
            </div>
            <span className="direct-label">Direct Express</span>
          </div>

          <div className="time-block arr">
            <span className="time-value">{bus.arrival}</span>
            <span className="city-name">{bus.to}</span>
          </div>
        </div>

        {/* Amenities Preview */}
        <div className="bus-amenities-quick">
          <span className="amenity-mini" title="Free High-Speed WiFi">
            <FaWifi /> WiFi
          </span>
          <span className="amenity-mini" title="Individual Charging Ports">
            <FaChargingStation /> Charging
          </span>
          <span className="amenity-mini" title="Air Conditioned">
            <FaSnowflake /> AC
          </span>
          <span className="amenity-mini" title="Complimentary Water">
            <FaBottleWater /> Water
          </span>
        </div>

        {/* Price & Action Button */}
        <div className="bus-fare-action-section">
          <div className="fare-box">
            <small className="fare-label">Starting at</small>
            <div className="fare-amount-row">
              <span className="fare-mrp">₹{Math.round(bus.price * 1.25)}</span>
              <h2 className="fare-price">₹{bus.price}</h2>
            </div>
            <span className={`seats-left-pill ${bus.seats <= 16 ? "urgent" : ""}`}>
              <FaTicketSimple /> {bus.seats} Seats Left
            </span>
          </div>

          <button
            type="button"
            className="view-seats-action-btn"
            onClick={() => onViewSeats(bus)}
          >
            View Seats
          </button>
        </div>
      </div>
    </div>
  );
}

export default BusCard;
