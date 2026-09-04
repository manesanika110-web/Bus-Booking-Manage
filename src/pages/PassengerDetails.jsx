import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/PassengerDetails.css";
import {
  FaBus,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaShieldHalved,
  FaLocationDot,
  FaCalendarDay,
  FaClock,
  FaTicketSimple,
  FaCircleInfo,
} from "react-icons/fa6";

function PassengerDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const bus = state?.bus;
  const selectedSeats = state?.selectedSeats || [];
  const searchDate = state?.date || bus?.date || new Date().toISOString().split("T")[0];
  const boardingPoint = state?.boardingPoint || `${bus?.from || "Origin"} Stand`;
  const droppingPoint = state?.droppingPoint || `${bus?.to || "Destination"} Stand`;
  const baseFare = state?.baseFare || selectedSeats.length * (bus?.price || 500);
  const gstAmount = state?.gstAmount || Math.round(baseFare * 0.05);
  const totalAmount = state?.totalAmount || baseFare + gstAmount;

  // Contact Details
  const [contactName, setContactName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  // Per-seat passenger list
  const [passengers, setPassengers] = useState(
    selectedSeats.length > 0
      ? selectedSeats.map((seatNo, idx) => ({
          seatNo,
          name: "",
          age: "",
          gender: "Male",
          isPrimary: idx === 0,
        }))
      : [
          {
            seatNo: "1",
            name: "",
            age: "",
            gender: "Male",
            isPrimary: true,
          },
        ]
  );

  const [validationError, setValidationError] = useState("");

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);

    // If first passenger name changes, sync with contactName if contactName is empty or matching
    if (index === 0 && field === "name" && (!contactName || contactName === updated[0].name)) {
      setContactName(value);
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setMobile(value);
    }
  };

  const isEmailValid = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    // Validate Contact Mobile
    if (mobile.length !== 10) {
      setValidationError("Please enter a valid 10-digit mobile number for ticket SMS updates.");
      return;
    }

    // Validate Contact Email
    if (!isEmailValid(email)) {
      setValidationError("Please enter a valid email address for E-Ticket confirmation.");
      return;
    }

    // Validate each passenger
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name.trim()) {
        setValidationError(`Please enter full name for Passenger in Seat ${p.seatNo}.`);
        return;
      }
      if (!p.age || isNaN(p.age) || Number(p.age) < 1 || Number(p.age) > 120) {
        setValidationError(`Please enter a valid age for Passenger in Seat ${p.seatNo}.`);
        return;
      }
    }

    const primaryName = passengers[0]?.name || contactName;

    navigate("/payment", {
      state: {
        bus,
        date: searchDate,
        selectedSeats,
        boardingPoint,
        droppingPoint,
        baseFare,
        gstAmount,
        totalAmount,
        passenger: {
          name: primaryName,
          mobile,
          email,
          age: passengers[0]?.age || "",
          gender: passengers[0]?.gender || "Male",
          allPassengers: passengers,
        },
      },
    });
  };

  if (!bus) {
    return (
      <div className="passenger-empty-view">
        <div className="empty-card">
          <FaBus className="empty-icon" />
          <h2>No Passenger Data Available</h2>
          <p>Please select a bus and seats first to enter passenger details.</p>
          <button className="back-home-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="passenger-page-container">
      {/* 1. STEPPER PROGRESS BAR */}
      <div className="booking-stepper">
        <div className="step-item completed">
          <div className="step-num">
            <FaCheck />
          </div>
          <span>Select Bus</span>
        </div>
        <div className="step-line active"></div>
        <div className="step-item completed">
          <div className="step-num">
            <FaCheck />
          </div>
          <span>Select Seats</span>
        </div>
        <div className="step-line active"></div>
        <div className="step-item current">
          <div className="step-num">3</div>
          <span>Passenger Details</span>
        </div>
        <div className="step-line"></div>
        <div className="step-item">
          <div className="step-num">4</div>
          <span>Payment</span>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN FORM & SUMMARY GRID */}
      <div className="passenger-main-grid">
        {/* LEFT COLUMN: PASSENGER FORM */}
        <div className="passenger-form-wrapper">
          <div className="form-header-bar">
            <h2>Passenger Information</h2>
            <p>Enter traveler details as per Government issued ID proof.</p>
          </div>

          {validationError && (
            <div className="passenger-alert-banner">
              <FaCircleInfo /> {validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* PRIMARY CONTACT INFO */}
            <div className="form-card-section">
              <div className="section-title">
                <FaPhone className="sec-icon" />
                <h3>Contact Details (For E-Ticket & SMS)</h3>
              </div>

              <div className="form-two-col">
                <div className="custom-input-group">
                  <label>Mobile Number <span className="req">*</span></label>
                  <div className="input-prefix-box">
                    <span className="country-code">+91</span>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={mobile}
                      onChange={handleMobileChange}
                      maxLength="10"
                      required
                    />
                  </div>
                  {mobile.length > 0 && mobile.length < 10 && (
                    <small className="field-hint error">Must be 10 digits</small>
                  )}
                </div>

                <div className="custom-input-group">
                  <label>Email Address <span className="req">*</span></label>
                  <div className="input-with-icon">
                    <FaEnvelope className="field-icon" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {email.length > 0 && !isEmailValid(email) && (
                    <small className="field-hint error">Enter a valid email</small>
                  )}
                </div>
              </div>
            </div>

            {/* PER-SEAT PASSENGER CARDS */}
            <div className="form-card-section">
              <div className="section-title">
                <FaUser className="sec-icon" />
                <h3>Passenger Details ({passengers.length} Traveler{passengers.length > 1 ? "s" : ""})</h3>
              </div>

              <div className="passengers-list">
                {passengers.map((p, idx) => (
                  <div key={p.seatNo} className="single-passenger-card">
                    <div className="passenger-card-top">
                      <span className="passenger-badge">
                        Passenger {idx + 1} {p.isPrimary && "(Primary Traveler)"}
                      </span>
                      <span className="seat-assigned-pill">
                        <FaTicketSimple /> Seat {p.seatNo}
                      </span>
                    </div>

                    <div className="passenger-inputs-row">
                      <div className="custom-input-group flex-2">
                        <label>Full Name <span className="req">*</span></label>
                        <input
                          type="text"
                          placeholder="Full Name as per ID"
                          value={p.name}
                          onChange={(e) => handlePassengerChange(idx, "name", e.target.value)}
                          required
                        />
                      </div>

                      <div className="custom-input-group flex-1">
                        <label>Age <span className="req">*</span></label>
                        <input
                          type="number"
                          placeholder="Age"
                          min="1"
                          max="110"
                          value={p.age}
                          onChange={(e) => handlePassengerChange(idx, "age", e.target.value)}
                          required
                        />
                      </div>

                      <div className="custom-input-group flex-1">
                        <label>Gender <span className="req">*</span></label>
                        <select
                          value={p.gender}
                          onChange={(e) => handlePassengerChange(idx, "gender", e.target.value)}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FORM ACTION BUTTONS */}
            <div className="form-actions-row">
              <button
                type="button"
                className="passenger-back-btn"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft /> Back to Seat Selection
              </button>

              <button type="submit" className="passenger-submit-btn">
                Proceed to Payment <FaArrowRight />
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: STICKY TRIP SUMMARY */}
        <div className="passenger-summary-sidebar">
          <div className="summary-box">
            <div className="summary-head">
              <h3>Trip Summary</h3>
              <span className="operator-badge">{bus.name}</span>
            </div>

            {/* Route & Timings */}
            <div className="summary-route-timeline">
              <div className="timeline-node">
                <div className="node-dot start"></div>
                <div className="node-info">
                  <strong>{bus.from}</strong>
                  <span>{bus.departure}</span>
                  <small title={boardingPoint}>
                    <FaLocationDot /> {boardingPoint}
                  </small>
                </div>
              </div>

              <div className="timeline-duration">
                <span className="duration-line"></span>
                <span className="duration-pill">{bus.duration}</span>
              </div>

              <div className="timeline-node">
                <div className="node-dot end"></div>
                <div className="node-info">
                  <strong>{bus.to}</strong>
                  <span>{bus.arrival}</span>
                  <small title={droppingPoint}>
                    <FaLocationDot /> {droppingPoint}
                  </small>
                </div>
              </div>
            </div>

            <hr className="summary-divider" />

            {/* Journey Meta */}
            <div className="meta-details-list">
              <div className="meta-row">
                <span>Travel Date</span>
                <strong><FaCalendarDay /> {searchDate}</strong>
              </div>
              <div className="meta-row">
                <span>Bus Type</span>
                <span>{bus.type}</span>
              </div>
              <div className="meta-row">
                <span>Selected Seats</span>
                <div className="seats-chips-inline">
                  {selectedSeats.map((s) => (
                    <span key={s} className="mini-seat-chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <hr className="summary-divider" />

            {/* Fare Breakdown */}
            <div className="summary-pricing-table">
              <div className="price-row">
                <span>Base Fare ({selectedSeats.length} Seats)</span>
                <span>₹{baseFare}</span>
              </div>
              <div className="price-row">
                <span>GST & Service Charge</span>
                <span>₹{gstAmount}</span>
              </div>
              <div className="price-row total">
                <strong>Total Amount</strong>
                <strong className="grand-total">₹{totalAmount}</strong>
              </div>
            </div>

            {/* Trust Assurance */}
            <div className="secure-badge-box">
              <FaShieldHalved className="shield-icon" />
              <div>
                <strong>Safe & Secure Booking</strong>
                <small>256-bit Encrypted SSL Checkout</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PassengerDetails;
