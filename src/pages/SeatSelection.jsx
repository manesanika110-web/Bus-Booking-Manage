import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/SeatSelection.css";
import {
  FaBus,
  FaStar,
  FaArrowRight,
  FaCheck,
  FaLocationDot,
  FaCalendarDay,
  FaClock,
  FaShieldHalved,
  FaCircleInfo,
  FaXmark,
  FaArrowLeft,
  FaLayerGroup,
} from "react-icons/fa6";

const CITY_BOARDING_POINTS = {
  Sangli: ["Vishrambag Chowk (07:00 PM)", "ST Bus Stand (07:30 PM)", "Market Yard (08:00 PM)"],
  Kolhapur: ["Kawala Naka (08:00 PM)", "CBS Bus Stand (08:30 PM)", "Dabholkar Corner (09:00 PM)"],
  Satara: ["Bombay Restaurant Chowk (09:30 PM)", "Satara Highway Stand (10:00 PM)", "Powai Naka (10:15 PM)"],
  Pune: ["Swargate Stand (06:00 PM)", "Wakad Bridge (06:45 PM)", "Hinjawadi Flyover (07:15 PM)", "Katraj (07:45 PM)"],
  Mumbai: ["Borivali East (08:00 PM)", "Dadar TT Circle (09:00 PM)", "Sion Circle (09:30 PM)", "Vashi Toll Plaza (10:15 PM)"],
  Solapur: ["Old Pune Naka (07:00 PM)", "Central ST Stand (07:45 PM)", "Saat Rasta (08:15 PM)"],
};

const CITY_DROPPING_POINTS = {
  Sangli: ["Vishrambag Chowk", "ST Bus Stand", "Sangli Bypass"],
  Kolhapur: ["Kawala Naka Bypass", "CBS Stand", "Shiroli Phata"],
  Satara: ["Bombay Restaurant Flyover", "Satara ST Stand", "Powai Naka"],
  Pune: ["Katraj Bypass", "Swargate Main Stand", "Wakad Highway", "Shivaji Nagar"],
  Mumbai: ["Vashi Plaza", "Maitri Park Chembur", "Sion Circle", "Dadar West", "Borivali East"],
  Solapur: ["Old Pune Naka", "Solapur Central Stand", "Hotgi Road"],
};

function SeatSelection() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const bus = state?.bus;
  const searchDate = state?.date || bus?.date || new Date().toISOString().split("T")[0];

  const [activeDeck, setActiveDeck] = useState("lower"); // 'lower' or 'upper'
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all"); // 'all', 'window', 'sleeper', 'seater'
  const [boardingPoint, setBoardingPoint] = useState("");
  const [droppingPoint, setDroppingPoint] = useState("");
  const [seatLimitWarning, setSeatLimitWarning] = useState("");

  const isSleeper = bus?.type?.toLowerCase().includes("sleeper");

  // Predefined booked seats & female reserved seats for realistic dynamic look
  const bookedSeatNumbers = useMemo(() => [3, 7, 8, 14, 19, 23, 29, 34], []);
  const femaleReservedNumbers = useMemo(() => [2, 5, 11, 17, 25], []);

  // Generate seat map
  const lowerDeckSeats = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const seatNo = i + 1;
      const row = Math.floor(i / 4) + 1;
      const col = (i % 4) + 1; // 1, 2 = Left; 3, 4 = Right
      const isWindow = col === 1 || col === 4;
      const isBooked = bookedSeatNumbers.includes(seatNo);
      const isFemale = femaleReservedNumbers.includes(seatNo);
      const type = isSleeper && row > 3 ? "sleeper" : "seater";
      const price = bus?.price || 500;

      return {
        id: `L${seatNo}`,
        seatNo: `L${seatNo}`,
        deck: "lower",
        row,
        col,
        isWindow,
        isBooked,
        isFemale,
        type,
        price,
      };
    });
  }, [bus?.price, isSleeper, bookedSeatNumbers, femaleReservedNumbers]);

  const upperDeckSeats = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const seatNo = i + 21;
      const row = Math.floor(i / 4) + 1;
      const col = (i % 4) + 1;
      const isWindow = col === 1 || col === 4;
      const isBooked = bookedSeatNumbers.includes(seatNo);
      const isFemale = femaleReservedNumbers.includes(seatNo);
      const price = (bus?.price || 500) + 100; // Upper berth premium

      return {
        id: `U${seatNo}`,
        seatNo: `U${seatNo}`,
        deck: "upper",
        row,
        col,
        isWindow,
        isBooked,
        isFemale,
        type: "sleeper",
        price,
      };
    });
  }, [bus?.price, bookedSeatNumbers, femaleReservedNumbers]);

  const currentDeckSeats = activeDeck === "lower" ? lowerDeckSeats : upperDeckSeats;

  const defaultBoardingOptions = useMemo(() => {
    return CITY_BOARDING_POINTS[bus?.from] || [
      `${bus?.from || "Origin"} Main Stand (08:00 PM)`,
      `${bus?.from || "Origin"} Highway Toll (08:30 PM)`,
    ];
  }, [bus?.from]);

  const defaultDroppingOptions = useMemo(() => {
    return CITY_DROPPING_POINTS[bus?.to] || [
      `${bus?.to || "Destination"} Central Stand`,
      `${bus?.to || "Destination"} Bypass Flyover`,
    ];
  }, [bus?.to]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    setSeatLimitWarning("");

    const isAlreadySelected = selectedSeats.some((s) => s.seatNo === seat.seatNo);

    if (isAlreadySelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatNo !== seat.seatNo));
    } else {
      if (selectedSeats.length >= 6) {
        setSeatLimitWarning("Maximum 6 seats can be booked in a single reservation.");
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const removeSeat = (seatNo) => {
    setSelectedSeats(selectedSeats.filter((s) => s.seatNo !== seatNo));
  };

  const totalFare = useMemo(() => {
    return selectedSeats.reduce((acc, curr) => acc + curr.price, 0);
  }, [selectedSeats]);

  const gstAmount = Math.round(totalFare * 0.05);
  const finalPayable = totalFare + gstAmount;

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;

    const chosenBoarding = boardingPoint || defaultBoardingOptions[0];
    const chosenDropping = droppingPoint || defaultDroppingOptions[0];

    navigate("/passenger-details", {
      state: {
        bus,
        date: searchDate,
        selectedSeats: selectedSeats.map((s) => s.seatNo),
        seatDetails: selectedSeats,
        boardingPoint: chosenBoarding,
        droppingPoint: chosenDropping,
        baseFare: totalFare,
        gstAmount,
        totalAmount: finalPayable,
      },
    });
  };

  if (!bus) {
    return (
      <div className="seat-empty-container">
        <div className="empty-card">
          <FaBus className="empty-bus-icon" />
          <h2>No Bus Selected</h2>
          <p>Please select a bus from the available search list to proceed with seat selection.</p>
          <button className="empty-back-btn" onClick={() => navigate("/")}>
            Search Buses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="seat-page-wrapper">
      {/* 1. TOP BUS INFO HEADER */}
      <div className="seat-header-banner">
        <div className="banner-left">
          <button className="header-back-btn" onClick={() => navigate(-1)} title="Go Back">
            <FaArrowLeft />
          </button>
          <div>
            <div className="bus-title-row">
              <h2>{bus.name}</h2>
              <span className="bus-type-tag">{bus.type}</span>
              <span className="bus-rating-badge">
                <FaStar /> {bus.rating || 4.8}
              </span>
            </div>
            <div className="bus-route-subtitle">
              <span>{bus.from}</span>
              <FaArrowRight className="route-arrow" />
              <span>{bus.to}</span>
              <span className="bullet-sep">•</span>
              <span className="date-badge">
                <FaCalendarDay /> {searchDate}
              </span>
              <span className="bullet-sep">•</span>
              <span className="time-badge">
                <FaClock /> {bus.departure} → {bus.arrival} ({bus.duration})
              </span>
            </div>
          </div>
        </div>

        <div className="banner-right">
          <div className="price-tag-box">
            <small>Starting from</small>
            <h3>₹{bus.price}</h3>
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT */}
      <div className="seat-content-grid">
        {/* LEFT COLUMN: BUS INTERIOR & SEATS */}
        <div className="bus-cabin-card">
          <div className="cabin-top-bar">
            {/* Deck Switcher */}
            <div className="deck-switcher">
              <button
                type="button"
                className={`deck-tab-btn ${activeDeck === "lower" ? "active" : ""}`}
                onClick={() => setActiveDeck("lower")}
              >
                <FaLayerGroup /> Lower Deck ({lowerDeckSeats.filter((s) => !s.isBooked).length} Free)
              </button>
              <button
                type="button"
                className={`deck-tab-btn ${activeDeck === "upper" ? "active" : ""}`}
                onClick={() => setActiveDeck("upper")}
              >
                <FaLayerGroup /> Upper Deck ({upperDeckSeats.filter((s) => !s.isBooked).length} Free)
              </button>
            </div>

            {/* Quick Filters */}
            <div className="filter-pills">
              <button
                type="button"
                className={`filter-pill ${selectedFilter === "all" ? "active" : ""}`}
                onClick={() => setSelectedFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={`filter-pill ${selectedFilter === "window" ? "active" : ""}`}
                onClick={() => setSelectedFilter("window")}
              >
                Window
              </button>
              <button
                type="button"
                className={`filter-pill ${selectedFilter === "sleeper" ? "active" : ""}`}
                onClick={() => setSelectedFilter("sleeper")}
              >
                Sleeper
              </button>
            </div>
          </div>

          {/* Seat Legend */}
          <div className="interactive-legend">
            <div className="legend-chip">
              <span className="legend-indicator available"></span>
              <span>Available</span>
            </div>
            <div className="legend-chip">
              <span className="legend-indicator selected"></span>
              <span>Selected</span>
            </div>
            <div className="legend-chip">
              <span className="legend-indicator booked"></span>
              <span>Booked</span>
            </div>
            <div className="legend-chip">
              <span className="legend-indicator female"></span>
              <span>Women</span>
            </div>
          </div>

          {seatLimitWarning && (
            <div className="seat-limit-alert">
              <FaCircleInfo /> {seatLimitWarning}
            </div>
          )}

          {/* Realistic Bus Frame */}
          <div className="bus-chassis">
            {/* Front of Bus with Driver Cabin */}
            <div className="driver-cabin-header">
              <span className="deck-label-pill">
                {activeDeck === "lower" ? "LOWER DECK" : "UPPER DECK"}
              </span>
              <div className="steering-container" title="Driver Side">
                <svg
                  className="steering-wheel-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                  <line x1="12" y1="2" x2="12" y2="9"></line>
                  <line x1="12" y1="15" x2="12" y2="22"></line>
                  <line x1="2" y1="12" x2="9" y2="12"></line>
                  <line x1="15" y1="12" x2="22" y2="12"></line>
                </svg>
                <small>Driver</small>
              </div>
            </div>

            {/* Interactive Seat Rows with Walking Aisle */}
            <div className="bus-deck-grid">
              {/* Group seats into rows of 4 (2 Left, Aisle, 2 Right) */}
              {Array.from(
                { length: Math.ceil(currentDeckSeats.length / 4) },
                (_, rowIndex) => {
                  const rowSeats = currentDeckSeats.slice(rowIndex * 4, rowIndex * 4 + 4);
                  const leftSeats = rowSeats.slice(0, 2);
                  const rightSeats = rowSeats.slice(2, 4);

                  return (
                    <div key={rowIndex} className="seat-row-layout">
                      {/* Left Column (Window + Aisle) */}
                      <div className="seat-pair left-side">
                        {leftSeats.map((seat) => renderSeatButton(seat))}
                      </div>

                      {/* Walking Gangway / Aisle */}
                      <div className="cabin-aisle">
                        <span className="aisle-line"></span>
                      </div>

                      {/* Right Column (Aisle + Window) */}
                      <div className="seat-pair right-side">
                        {rightSeats.map((seat) => renderSeatButton(seat))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <div className="bus-rear-bumper">
              <span>REAR CABIN</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING SUMMARY & BOARDING POINTS */}
        <div className="seat-summary-sidebar">
          {/* Selected Seats Card */}
          <div className="summary-card">
            <div className="card-header-flex">
              <h3>Selected Seats</h3>
              <span className="seats-count-badge">
                {selectedSeats.length} / 6 Max
              </span>
            </div>

            {selectedSeats.length === 0 ? (
              <div className="no-seats-selected-prompt">
                <FaCircleInfo className="info-icon" />
                <p>Click on any available green seat from the bus map to select your seats.</p>
              </div>
            ) : (
              <div className="selected-chips-container">
                {selectedSeats.map((seat) => (
                  <div key={seat.seatNo} className="selected-seat-chip">
                    <div className="chip-info">
                      <strong>Seat {seat.seatNo}</strong>
                      <small>
                        {seat.deck === "lower" ? "Lower" : "Upper"} • ₹{seat.price}
                      </small>
                    </div>
                    <button
                      type="button"
                      className="chip-remove-btn"
                      onClick={() => removeSeat(seat.seatNo)}
                      title="Remove seat"
                    >
                      <FaXmark />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Boarding & Dropping Point Pickers */}
            <div className="points-selector-section">
              <div className="point-select-group">
                <label>
                  <FaLocationDot className="point-icon green" /> Boarding Point
                </label>
                <select
                  value={boardingPoint}
                  onChange={(e) => setBoardingPoint(e.target.value)}
                >
                  {defaultBoardingOptions.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="point-select-group">
                <label>
                  <FaLocationDot className="point-icon red" /> Dropping Point
                </label>
                <select
                  value={droppingPoint}
                  onChange={(e) => setDroppingPoint(e.target.value)}
                >
                  {defaultDroppingOptions.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="fare-breakdown-section">
              <div className="fare-row">
                <span>Base Fare ({selectedSeats.length} Seats)</span>
                <span>₹{totalFare}</span>
              </div>
              <div className="fare-row">
                <span>GST & Toll Taxes (5%)</span>
                <span>₹{gstAmount}</span>
              </div>
              <hr className="fare-divider" />
              <div className="fare-row total">
                <strong>Total Amount</strong>
                <strong className="total-price-text">₹{finalPayable}</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sidebar-action-buttons">
              <button
                type="button"
                className="proceed-booking-btn"
                onClick={handleContinue}
                disabled={selectedSeats.length === 0}
              >
                Continue to Passenger Details <FaArrowRight />
              </button>
              <button
                type="button"
                className="cancel-select-btn"
                onClick={() => navigate(-1)}
              >
                ← Back to Search Results
              </button>
            </div>

            {/* Safe Booking Guarantee */}
            <div className="trust-badge">
              <FaShieldHalved />
              <span>100% Safe & Instant Online Ticket Confirmation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function renderSeatButton(seat) {
    const isSelected = selectedSeats.some((s) => s.seatNo === seat.seatNo);
    const isDimmed =
      (selectedFilter === "window" && !seat.isWindow) ||
      (selectedFilter === "sleeper" && seat.type !== "sleeper");

    let statusClass = "available";
    if (seat.isBooked) statusClass = "booked";
    else if (isSelected) statusClass = "selected";
    else if (seat.isFemale) statusClass = "female-reserved";

    return (
      <button
        key={seat.seatNo}
        type="button"
        className={`interactive-seat ${statusClass} ${seat.type} ${
          isDimmed ? "dimmed" : ""
        }`}
        disabled={seat.isBooked}
        onClick={() => handleSeatClick(seat)}
        title={`Seat ${seat.seatNo} | ${seat.type.toUpperCase()} | ₹${seat.price}${
          seat.isWindow ? " | Window" : ""
        }${seat.isBooked ? " | (Booked)" : ""}`}
      >
        <span className="seat-num">{seat.seatNo}</span>
        {isSelected && <FaCheck className="seat-check-mark" />}
        {seat.isWindow && <span className="window-dot" title="Window Seat"></span>}
        <span className="seat-fare-tag">₹{seat.price}</span>
      </button>
    );
  }
}

export default SeatSelection;
