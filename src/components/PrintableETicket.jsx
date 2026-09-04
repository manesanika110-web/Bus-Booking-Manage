import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  FaBus,
  FaCalendarDay,
  FaClock,
  FaEnvelope,
  FaLocationDot,
  FaPhone,
  FaShieldHalved,
  FaTicketSimple,
  FaUser,
} from "react-icons/fa6";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PrintableETicket = ({ booking }) => {
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    const qrValue = JSON.stringify({
      pnr: booking.pnr,
      bookingId: booking.bookingId,
      passenger: booking.passengerName,
      seat: booking.seats,
      route: `${booking.fromCity}-${booking.toCity}`,
      date: booking.travelDate,
    });

    QRCode.toDataURL(qrValue, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 180,
      color: { dark: "#111827", light: "#ffffff" },
    }).then(setQrCode);
  }, [booking]);

  return (
    <article className="printable-eticket" aria-label="BusVista eTicket">
      <header className="ticket-header">
        <div className="ticket-badge">
          <strong>eTICKET</strong>
          <FaBus />
        </div>
        <div className="ticket-reference">
          <span>
            PNR: <strong>{booking.pnr}</strong>
          </span>
          <span>
            Booking ID: <strong>{booking.bookingId}</strong>
          </span>
        </div>
        <div className="busvista-lockup">
          <div className="busvista-mark">
            <FaBus />
          </div>
          <div>
            <strong>
              Bus<span>Vista</span>
            </strong>
            <small>India&apos;s Premium Smart Bus Booking Network</small>
          </div>
        </div>
      </header>

      <section className="ticket-main-grid">
        <div className="ticket-trip-meta">
          <div className="ticket-meta-block">
            <small>TRAVEL DATE</small>
            <strong>
              <FaCalendarDay /> {formatDate(booking.travelDate)}
            </strong>
          </div>
          <div className="ticket-meta-block">
            <small>BUS NAME</small>
            <strong>
              <FaBus /> {booking.busName}
            </strong>
            <span>{booking.busType}</span>
          </div>
        </div>

        <div className="ticket-route">
          <div className="route-city">
            <strong>{booking.fromCity}</strong>
            <span>{booking.boardingPoint}</span>
          </div>
          <div className="route-line">
            <span />
            <FaBus />
            <span />
            <b>{booking.duration}</b>
            <em>Direct Express Route</em>
          </div>
          <div className="route-city destination">
            <strong>{booking.toCity}</strong>
            <span>{booking.droppingPoint}</span>
          </div>
        </div>

        <div className="ticket-times">
          <div>
            <small>DEPARTURE</small>
            <strong>
              <FaClock /> {booking.departure}
            </strong>
          </div>
          <div>
            <small>ARRIVAL</small>
            <strong>
              <FaClock /> {booking.arrival}
            </strong>
          </div>
        </div>
      </section>

      <section className="ticket-details-grid">
        <div>
          <small>SEAT NUMBER(S)</small>
          <strong className="seat-chip">
            <FaTicketSimple /> {booking.seats}
          </strong>
        </div>
        <div>
          <small>PASSENGER</small>
          <strong>
            <FaUser /> {booking.passengerName}
          </strong>
        </div>
        <div>
          <small>MOBILE</small>
          <strong>
            <FaPhone /> +91 {booking.mobile}
          </strong>
        </div>
        <div>
          <small>EMAIL</small>
          <strong>
            <FaEnvelope /> {booking.email}
          </strong>
        </div>
        <div>
          <small>FARE</small>
          <strong className="fare-value">₹{booking.amount}</strong>
          <span>(Paid - GST Inc.)</span>
        </div>
        <div>
          <small>PAYMENT STATUS</small>
          <strong className="paid-chip">
            <FaShieldHalved /> {booking.paymentStatus}
          </strong>
        </div>
        <div>
          <small>BOARDING POINT</small>
          <strong>
            <FaLocationDot /> {booking.boardingPoint}
          </strong>
        </div>
        <div>
          <small>BUS TYPE</small>
          <strong>
            <FaTicketSimple /> {booking.busType}
          </strong>
        </div>
      </section>

      <aside className="ticket-qr-panel">
        {qrCode && <img src={qrCode} alt="Ticket QR code" />}
        <strong>PBK-{booking.bookingId}</strong>
      </aside>

      <footer className="ticket-footer">
        <span>♡ &nbsp; Thank you for choosing BusVista!</span>
        <i />
        <span>
          <FaShieldHalved /> &nbsp; Have a safe and comfortable journey!
        </span>
      </footer>
    </article>
  );
};

export default PrintableETicket;
