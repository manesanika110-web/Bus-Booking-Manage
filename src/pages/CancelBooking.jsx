import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBus, FaArrowRight, FaExclamationTriangle } from "react-icons/fa"; // आयकॉन्स जोडले
import "../css/CancelBooking.css";

const CancelBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state?.booking || {
    pnr: "PBK123456",
    route: "Sangli ➔ Pune",
    date: "06 July 2026",
    time: "08:00 AM",
    seats: "6",
    amount: "₹ 550",
  };
  console.log("Booking Data:", bookingData);

  // रूट मधून 'From' आणि 'To' वेगळे करण्यासाठी लॉजिक
  const stations = bookingData.route
    ? bookingData.route.split("➔")
    : ["Sangli", "Pune"];
  const fromStation = stations[0]?.trim();
  const toStation = stations[1]?.trim();

  const handleCancelAction = () => {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    const updatedBookings = bookings.map((item) => {
      if (item.bookingId === bookingData.bookingId) {
        return {
          ...item,
          status: "cancelled",
        };
      }
      return item;
    });

    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    alert(
      `Your ticket (PNR: ${bookingData.pnr}) has been cancelled successfully!`,
    );

    navigate("/my-bookings", { replace: true });
  };

  return (
    <div className="cancel-step-card">
      <div className="cancel-header-banner">
        <h3>CANCEL BOOKING</h3>
      </div>

      <div className="cancel-body-content">
        <h4 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FaExclamationTriangle /> Cancel Booking
        </h4>

        <p className="alert-warning-text">
          Are you sure you want to cancel this booking?
        </p>

        <div className="summary-box">
          <p>
            <strong>PNR No:</strong>{" "}
            <span style={{ color: "#1A3B8B" }}>{bookingData.pnr}</span>
          </p>

          {/* प्रवासाचा मार्ग बॉक्स डिझाईनमध्ये (From -> To) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: "10px 0",
              background: "#fff",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <div style={{ flex: 1 }}>
              <span
                style={{ fontSize: "11px", color: "#888", display: "block" }}
              >
                FROM
              </span>
              <strong style={{ fontSize: "15px", color: "#333" }}>
                {fromStation}
              </strong>
            </div>
            <div style={{ color: "#1A3B8B" }}>
              <FaArrowRight />
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <span
                style={{ fontSize: "11px", color: "#888", display: "block" }}
              >
                TO
              </span>
              <strong style={{ fontSize: "15px", color: "#333" }}>
                {toStation}
              </strong>
            </div>
          </div>

          <p style={{ fontSize: "13px", color: "#666" }}>
            <strong>Date & Time:</strong> {bookingData.date || "06 July 2026"} |{" "}
            {bookingData.time || "08:00 AM"}
          </p>
          <p style={{ fontSize: "13px", color: "#666" }}>
            <strong>Seats:</strong> {bookingData.seats}
          </p>

          <hr
            style={{
              border: "none",
              borderTop: "1px dashed #ddd",
              margin: "12px 0",
            }}
          />

          <p>
            <strong>Refund Amount: </strong>
            <span className="refund-text">{bookingData.amount}</span>
          </p>
          <small style={{ color: "#888", display: "block", marginTop: "-4px" }}>
            (After cancellation charges)
          </small>
        </div>

        <div className="action-buttons-group">
          <button
            className="btn-back-outline"
            onClick={() => navigate("/my-bookings")}
          >
            No, Go Back
          </button>
          <button className="btn-confirm-red" onClick={handleCancelAction}>
            Yes, Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBooking;
