import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import {
  FaBus,
  FaMagnifyingGlass,
  FaCalendarDay,
  FaClock,
  FaLocationDot,
  FaTicketSimple,
  FaUser,
  FaPhone,
  FaDownload,
  FaBan,
  FaArrowRight,
  FaCircleCheck,
  FaRotateLeft,
  FaEye,
  FaFilter,
} from "react-icons/fa6";
import "../css/MyBookings.css";

const toDisplayText = (value, fallback = "") => {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value !== "object") return String(value);

  const nestedValue =
    value.name || value.location || value.contact || value.time;
  return typeof nestedValue === "object"
    ? fallback
    : String(nestedValue || fallback);
};

const MyBookings = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const loadBookings = () => {
      const fallbackKeyBookings = JSON.parse(
        localStorage.getItem("busvista_bookings") || "[]",
      );
      const savedBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]",
      );

      const merged = [...fallbackKeyBookings, ...savedBookings].filter(Boolean);
      const uniqueBookings = merged.filter(
        (booking, index, arr) =>
          index ===
          arr.findIndex((item) => item.bookingId === booking.bookingId),
      );

      setBookings(uniqueBookings);
    };

    loadBookings();
    window.addEventListener("focus", loadBookings);
    window.addEventListener("storage", loadBookings);
    return () => {
      window.removeEventListener("focus", loadBookings);
      window.removeEventListener("storage", loadBookings);
    };
  }, []);

  // Format and normalize bookings
  const formattedBookings = bookings.map((item) => {
    const bookingId = toDisplayText(
      item.bookingId || item.id,
      "BUS" + Math.floor(100000 + Math.random() * 900000),
    );
    const pnr = toDisplayText(item.pnr, "PBK" + bookingId.slice(-6));
    const passengerName =
      typeof item.passenger === "string"
        ? item.passenger
        : toDisplayText(item.passenger?.name || item.passenger, "Passenger");
    const mobile = toDisplayText(item.passenger?.mobile, "9876543210");
    const email = toDisplayText(item.passenger?.email, "passenger@example.com");
    const busName = toDisplayText(
      item.bus?.name || item.name,
      "BusVista Express",
    );
    const busType = toDisplayText(item.bus?.type, "AC Sleeper");
    const fromCity = toDisplayText(item.bus?.from, "Sangli");
    const toCity = toDisplayText(item.bus?.to, "Pune");
    const departure = toDisplayText(
      item.bus?.departure || item.time,
      "08:00 AM",
    );
    const arrival = toDisplayText(item.bus?.arrival, "01:30 PM");
    const duration = toDisplayText(item.bus?.duration, "5h 30m");
    const travelDate = toDisplayText(
      item.travelDate || item.bus?.date || item.bookingDate,
      "2026-08-20",
    );
    const seats = Array.isArray(item.selectedSeats)
      ? item.selectedSeats.join(", ")
      : toDisplayText(item.selectedSeats, "L1");
    const totalAmount = toDisplayText(item.totalAmount, "550");
    const status = toDisplayText(item.status, "upcoming");
    const boardingPoint = toDisplayText(
      item.boardingPoint || item.location,
      `${fromCity} Stand`,
    );
    const droppingPoint = toDisplayText(item.droppingPoint, `${toCity} Stand`);

    return {
      id: bookingId,
      pnr,
      passengerName,
      mobile,
      email,
      busName,
      busType,
      fromCity,
      toCity,
      departure,
      arrival,
      duration,
      travelDate,
      seats,
      amount: totalAmount,
      status,
      boardingPoint,
      droppingPoint,
      bookingDate: item.bookingDate,
      originalBooking: item,
    };
  });

  // Calculate tab counts
  const upcomingCount = formattedBookings.filter(
    (b) => b.status === "upcoming",
  ).length;
  const completedCount = formattedBookings.filter(
    (b) => b.status === "completed",
  ).length;
  const cancelledCount = formattedBookings.filter(
    (b) => b.status === "cancelled",
  ).length;

  // Filter by Tab and Search
  const filteredBookings = formattedBookings.filter((booking) => {
    const matchesTab = booking.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      booking.id.toLowerCase().includes(q) ||
      booking.pnr.toLowerCase().includes(q) ||
      booking.passengerName.toLowerCase().includes(q) ||
      booking.busName.toLowerCase().includes(q) ||
      booking.fromCity.toLowerCase().includes(q) ||
      booking.toCity.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  // 🖨️ Professional PDF Ticket Download Handler
  const handleDownloadTicketPDF = (booking) => {
    navigate("/e-ticket", {
      state: {
        booking: booking.originalBooking,
        autoDownload: true,
      },
    });
  };

  return (
    <div className="my-bookings-page-wrapper">
      <div className="my-bookings-container-pro">
        <div className="my-bookings-top-actions">
          <button
            type="button"
            className="back-home-btn"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>

        {/* 1. TOP HEADER & STATS */}
        <div className="bookings-hero-banner">
          <div className="hero-content-left">
            <div className="header-badge">
              <FaBus /> My Journey Bookings
            </div>
            <h1>My Bookings & Reservations</h1>
            <p>
              Track your upcoming bus trips, download e-tickets, and manage
              reservations.
            </p>
          </div>

          <div className="hero-stats-badges">
            <div className="stat-pill" onClick={() => setActiveTab("upcoming")}>
              <span className="stat-num upcoming">{upcomingCount}</span>
              <span className="stat-label">Upcoming</span>
            </div>
            <div
              className="stat-pill"
              onClick={() => setActiveTab("completed")}
            >
              <span className="stat-num completed">{completedCount}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div
              className="stat-pill"
              onClick={() => setActiveTab("cancelled")}
            >
              <span className="stat-num cancelled">{cancelledCount}</span>
              <span className="stat-label">Cancelled</span>
            </div>
          </div>
        </div>

        {/* 2. SEARCH & TABS BAR */}
        <div className="bookings-control-panel">
          {/* Tabs */}
          <div className="booking-tabs-nav">
            <button
              type="button"
              className={`booking-tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Trips
              <span className="tab-count-pill">{upcomingCount}</span>
            </button>

            <button
              type="button"
              className={`booking-tab-btn ${activeTab === "completed" ? "active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed Journeys
              <span className="tab-count-pill">{completedCount}</span>
            </button>

            <button
              type="button"
              className={`booking-tab-btn ${activeTab === "cancelled" ? "active" : ""}`}
              onClick={() => setActiveTab("cancelled")}
            >
              Cancelled Tickets
              <span className="tab-count-pill">{cancelledCount}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="booking-search-input-box">
            <FaMagnifyingGlass className="search-box-icon" />
            <input
              type="text"
              placeholder="Search by PNR, Booking ID, Passenger, City, or Bus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 3. BOOKINGS LIST */}
        <div className="bookings-list-content">
          {filteredBookings.length === 0 ? (
            <div className="no-bookings-placeholder-card">
              <FaTicketSimple className="no-bookings-icon" />
              <h3>No {activeTab} Bookings Found</h3>
              <p>
                {searchQuery
                  ? `No bookings match your search term "${searchQuery}".`
                  : `You don't have any ${activeTab} bus reservations at the moment.`}
              </p>
              <button
                type="button"
                className="book-new-trip-btn"
                onClick={() => navigate("/search")}
              >
                <FaBus /> Search & Book a Bus
              </button>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="pro-booking-card">
                {/* Card Top Strip */}
                <div className="card-top-strip">
                  <div className="operator-left">
                    <h3>{booking.busName}</h3>
                    <span className="bus-category-tag">{booking.busType}</span>
                  </div>

                  <div className="status-right">
                    <span className={`status-pill ${booking.status}`}>
                      {booking.status === "upcoming" && <FaCircleCheck />}
                      {booking.status === "completed" && "🏁"}
                      {booking.status === "cancelled" && <FaBan />}
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Main Booking Details */}
                <div className="booking-card-main-grid">
                  {/* Route & Timings */}
                  <div className="route-timings-block">
                    <div className="route-city-time">
                      <span className="time-text">{booking.departure}</span>
                      <strong className="city-text">{booking.fromCity}</strong>
                      <small
                        className="stop-text"
                        title={booking.boardingPoint}
                      >
                        <FaLocationDot /> {booking.boardingPoint}
                      </small>
                    </div>

                    <div className="route-duration-middle">
                      <span className="duration-tag">{booking.duration}</span>
                      <div className="arrow-line">
                        <span className="line-dot left"></span>
                        <FaArrowRight className="route-arrow-icon" />
                        <span className="line-dot right"></span>
                      </div>
                      <span className="travel-date-tag">
                        <FaCalendarDay /> {booking.travelDate}
                      </span>
                    </div>

                    <div className="route-city-time arr">
                      <span className="time-text">{booking.arrival}</span>
                      <strong className="city-text">{booking.toCity}</strong>
                      <small
                        className="stop-text"
                        title={booking.droppingPoint}
                      >
                        <FaLocationDot /> {booking.droppingPoint}
                      </small>
                    </div>
                  </div>

                  {/* Passenger & Ticket Meta */}
                  <div className="passenger-meta-block">
                    <div className="meta-item">
                      <small>PRIMARY PASSENGER</small>
                      <p>
                        <FaUser className="item-icon" /> {booking.passengerName}
                      </p>
                    </div>

                    <div className="meta-item">
                      <small>CONTACT MOBILE</small>
                      <p>
                        <FaPhone className="item-icon" /> +91 {booking.mobile}
                      </p>
                    </div>

                    <div className="meta-item">
                      <small>RESERVED SEATS</small>
                      <div className="seats-pill-list">
                        <span className="seat-badge">
                          <FaTicketSimple /> Seat {booking.seats}
                        </span>
                      </div>
                    </div>

                    <div className="meta-item">
                      <small>TOTAL FARE</small>
                      <p className="fare-highlight">₹{booking.amount}</p>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Strip with Action Buttons */}
                <div className="card-bottom-actions-strip">
                  <div className="pnr-booking-ref">
                    <span>
                      PNR: <strong>{booking.pnr}</strong>
                    </span>
                    <span className="sep">•</span>
                    <span>
                      ID: <strong>{booking.id}</strong>
                    </span>
                  </div>

                  <div className="actions-button-group">
                    {/* 1. View eTicket Button */}
                    <button
                      type="button"
                      className="btn-action-outline view-eticket-btn"
                      onClick={() =>
                        navigate("/e-ticket", {
                          state: {
                            booking: booking.originalBooking,
                          },
                        })
                      }
                      title="View Digital Boarding Pass"
                    >
                      <FaEye /> eTicket
                    </button>

                    {/* 2. Download Ticket Button (Black Color Button with FaDownload) */}
                    <button
                      type="button"
                      className="btn-action-solid black-download-ticket-btn"
                      onClick={() => handleDownloadTicketPDF(booking)}
                      title="Download Official PDF Ticket"
                    >
                      <FaDownload /> Download Ticket
                    </button>

                    {/* 3. Cancel Button (Only for Upcoming) */}
                    {booking.status === "upcoming" && (
                      <button
                        type="button"
                        className="btn-action-outline cancel-booking-btn"
                        onClick={() =>
                          navigate("/cancel-booking", {
                            state: {
                              booking: booking.originalBooking,
                            },
                          })
                        }
                        title="Cancel this reservation"
                      >
                        <FaBan /> Cancel
                      </button>
                    )}

                    {/* 4. Book Again (For Completed / Cancelled) */}
                    {booking.status !== "upcoming" && (
                      <button
                        type="button"
                        className="btn-action-outline book-again-btn"
                        onClick={() =>
                          navigate("/search", {
                            state: {
                              from: booking.fromCity,
                              to: booking.toCity,
                              date: new Date().toISOString().split("T")[0],
                            },
                          })
                        }
                      >
                        <FaRotateLeft /> Book Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
