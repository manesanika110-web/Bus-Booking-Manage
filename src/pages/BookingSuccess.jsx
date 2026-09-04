import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/BookingSuccess.css";
import {
  FaCheck,
  FaBus,
  FaArrowRight,
  FaDownload,
  FaPrint,
  FaShareNodes,
  FaCircleCheck,
  FaCalendarDay,
  FaClock,
  FaLocationDot,
  FaTicketSimple,
  FaUser,
  FaPhone,
  FaQrcode,
  FaShieldHalved,
  FaCircleInfo,
} from "react-icons/fa6";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function BookingSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const ticketRef = useRef(null);

  const bus = state?.bus;
  const passenger = state?.passenger;
  const selectedSeats = state?.selectedSeats || [];
  const searchDate =
    state?.date || bus?.date || new Date().toISOString().split("T")[0];
  const boardingPoint =
    state?.boardingPoint || `${bus?.from || "Origin"} Main Stand`;
  const droppingPoint =
    state?.droppingPoint || `${bus?.to || "Destination"} Central Stand`;
  const totalAmount = state?.totalAmount || 0;
  const paymentMethod = state?.paymentMethod || "UPI / ONLINE";

  const [isCopied, setIsCopied] = useState(false);

  // Generate permanent IDs for this booking
  const [bookingId] = useState(
    () =>
      state?.bookingId || "BUS" + Math.floor(100000 + Math.random() * 900000),
  );
  const [pnr] = useState(
    () => state?.pnr || "PBK" + Math.floor(100000 + Math.random() * 900000),
  );
  const [bookingDate] = useState(
    () =>
      state?.bookingDate ||
      new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  );

  // Save Booking to LocalStorage and Firestore
  useEffect(() => {
    if (!bus || !passenger) return;

    const saveBooking = async () => {
      const bookingData = {
        bookingId,
        pnr,
        bookingDate,
        travelDate: searchDate,
        passenger,
        bus,
        selectedSeats,
        boardingPoint,
        droppingPoint,
        totalAmount,
        paymentMethod,
        status: "upcoming",
      };

      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem("bookings")) || [];
      const alreadyExists = existing.some(
        (item) => item.bookingId === bookingId,
      );

      if (!alreadyExists) {
        existing.unshift(bookingData);
        localStorage.setItem("bookings", JSON.stringify(existing));
      }

      // Save to Firebase Firestore if logged in
      const user = auth.currentUser;
      if (user) {
        try {
          await setDoc(
            doc(db, "users", user.uid, "bookings", bookingId),
            bookingData,
            { merge: true },
          );
        } catch (err) {
          console.error("Error saving booking to Firestore:", err);
        }
      }
    };

    saveBooking();
  }, [
    bookingId,
    pnr,
    bookingDate,
    searchDate,
    bus,
    passenger,
    selectedSeats,
    boardingPoint,
    droppingPoint,
    totalAmount,
    paymentMethod,
  ]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `TripVista Ticket Confirmed!\nPNR: ${pnr}\nBooking ID: ${bookingId}\nBus: ${bus?.name}\nRoute: ${bus?.from} to ${bus?.to}\nDate: ${searchDate}\nSeats: ${selectedSeats.join(", ")}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  if (!bus || !passenger) {
    return (
      <div className="success-empty-view">
        <div className="empty-card">
          <FaBus className="empty-icon" />
          <h2>No Booking Found</h2>
          <p>
            Please book a bus ticket to view your confirmation and boarding
            pass.
          </p>
          <button className="back-home-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-success-page">
      {/* 1. CELEBRATION HEADER */}
      <div className="success-top-banner">
        <div className="success-pulse-circle">
          <FaCheck className="check-icon" />
        </div>
        <h1>Booking Confirmed!</h1>
        <p className="success-subtitle">
          Your reservation is confirmed. We have sent the E-Ticket and SMS to{" "}
          <strong>+91 {passenger.mobile}</strong> &{" "}
          <strong>{passenger.email}</strong>.
        </p>

        {isCopied && (
          <div className="copied-toast">
            <FaCircleCheck /> Ticket details copied to clipboard!
          </div>
        )}
      </div>

      {/* 2. AIRLINE STYLE E-TICKET CARD */}
      <div className="eticket-printable-card" ref={ticketRef}>
        {/* Ticket Header */}
        <div className="ticket-card-header">
          <div className="ticket-brand">
            <div className="brand-logo-icon">
              <FaBus />
            </div>
            <div>
              <h3>TripVista Express</h3>
              <small>Digital Boarding Pass</small>
            </div>
          </div>

          <div className="ticket-pnr-box">
            <div className="pnr-item">
              <small>PNR NUMBER</small>
              <strong>{pnr}</strong>
            </div>
            <div className="pnr-item">
              <small>BOOKING ID</small>
              <strong>{bookingId}</strong>
            </div>
            <span className="status-confirmed-badge">
              <FaCircleCheck /> Confirmed
            </span>
          </div>
        </div>

        {/* Bus Operator Banner */}
        <div className="operator-banner-strip">
          <div className="op-info">
            <strong>{bus.name}</strong>
            <span className="bus-model-pill">{bus.type}</span>
          </div>
          <div className="booked-on-text">
            <span>Booked On:</span> {bookingDate}
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="ticket-journey-route">
          <div className="route-stop departure">
            <span className="stop-tag">DEPARTURE</span>
            <h2>{bus.departure}</h2>
            <h4>{bus.from}</h4>
            <p className="point-address">
              <FaLocationDot /> {boardingPoint}
            </p>
            <span className="travel-date-badge">
              <FaCalendarDay /> {searchDate}
            </span>
          </div>

          <div className="route-duration-center">
            <span className="dur-badge">{bus.duration}</span>
            <div className="dur-line">
              <span className="line-dot left"></span>
              <FaBus className="travel-bus-icon" />
              <span className="line-dot right"></span>
            </div>
            <span className="direct-badge">Non-Stop Service</span>
          </div>

          <div className="route-stop arrival">
            <span className="stop-tag">ARRIVAL</span>
            <h2>{bus.arrival}</h2>
            <h4>{bus.to}</h4>
            <p className="point-address">
              <FaLocationDot /> {droppingPoint}
            </p>
            <span className="travel-date-badge">
              <FaCalendarDay /> {searchDate}
            </span>
          </div>
        </div>

        {/* Perforated Cut Line */}
        <div className="ticket-cut-line">
          <span className="notch-left"></span>
          <span className="dashed-line"></span>
          <span className="notch-right"></span>
        </div>

        {/* Passenger & Seat Info Grid */}
        <div className="ticket-passenger-grid">
          <div className="grid-item">
            <small>PRIMARY PASSENGER</small>
            <p>
              <FaUser /> {passenger.name}
            </p>
          </div>

          <div className="grid-item">
            <small>CONTACT NUMBER</small>
            <p>
              <FaPhone /> +91 {passenger.mobile}
            </p>
          </div>

          <div className="grid-item">
            <small>SEAT NUMBER(S)</small>
            <div className="seats-badge-list">
              {selectedSeats.map((s) => (
                <span key={s} className="seat-token">
                  <FaTicketSimple /> Seat {s}
                </span>
              ))}
            </div>
          </div>

          <div className="grid-item">
            <small>TOTAL PAID</small>
            <p className="paid-amount-text">₹{totalAmount}</p>
          </div>
        </div>

        {/* QR Code & Verification Section */}
        <div className="ticket-footer-strip">
          <div className="qr-verification-box">
            <div className="qr-box-mini">
              <FaQrcode className="mini-qr-icon" />
            </div>
            <div className="qr-text">
              <strong>Scan QR for Bus Entry</strong>
              <p>
                Show this digital ticket on your phone while boarding the bus.
              </p>
            </div>
          </div>

          <div className="payment-verified-seal">
            <FaShieldHalved className="seal-icon" />
            <div>
              <small>PAYMENT STATUS</small>
              <strong>Paid via {paymentMethod}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ACTION TOOLBAR */}
      <div className="ticket-actions-bar">
        <button
          type="button"
          className="ticket-btn print-btn"
          onClick={handlePrint}
        >
          <FaPrint /> Print Ticket
        </button>

        <button
          type="button"
          className="ticket-btn share-btn"
          onClick={handleShare}
        >
          <FaShareNodes /> Share Ticket
        </button>

        <button
          type="button"
          className="ticket-btn bookings-btn"
          onClick={() =>
            navigate("/my-bookings", {
              state: {
                bus,
                passenger,
                selectedSeats,
                totalAmount,
                bookingId,
                bookingDate,
              },
            })
          }
        >
          <FaTicketSimple /> View All Bookings
        </button>

        <button
          type="button"
          className="ticket-btn home-btn-outline"
          onClick={() => navigate("/")}
        >
          Book Another Trip <FaArrowRight />
        </button>
      </div>

      {/* 4. IMPORTANT BOARDING GUIDELINES */}
      <div className="boarding-guidelines-card">
        <div className="guidelines-header">
          <FaCircleInfo className="info-badge-icon" />
          <h3>Important Travel & Boarding Guidelines</h3>
        </div>
        <ul className="guidelines-list">
          <li>
            Please reach your designated boarding point at least{" "}
            <strong>15-20 minutes</strong> prior to departure time.
          </li>
          <li>
            Passengers must carry a valid{" "}
            <strong>Government photo ID proof</strong> (Aadhaar / PAN / Driving
            License) along with this E-Ticket.
          </li>
          <li>
            Free baggage allowance is up to <strong>15 kg per passenger</strong>
            . Heavy commercial luggage is not permitted.
          </li>
          <li>
            Need help on the way? 24/7 Helpline:{" "}
            <strong>+91 1800-209-8899</strong> (TripVista Support).
          </li>
        </ul>
      </div>
    </div>
  );
}

export default BookingSuccess;
