import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaDownload, FaPrint } from "react-icons/fa6";
import PrintableETicket from "../components/PrintableETicket";
import "../css/ETicket.css";

const text = (value, fallback = "") => {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value !== "object") return String(value);
  return String(
    value.name || value.location || value.contact || value.time || fallback,
  );
};

const normalizeBooking = (raw = {}) => {
  const bookingId = text(raw.bookingId || raw.id, "BUS000000");
  const bus = raw.bus || {};
  const passenger =
    typeof raw.passenger === "string"
      ? { name: raw.passenger }
      : raw.passenger || {};
  const fromCity = text(bus.from || raw.fromCity, "Sangli");
  const toCity = text(bus.to || raw.toCity, "Pune");

  return {
    bookingId,
    pnr: text(raw.pnr, `PBK${bookingId.slice(-6)}`),
    travelDate: text(raw.travelDate || bus.date || raw.date, "2026-09-05"),
    busName: text(bus.name || raw.busName, "TripVista Express"),
    busType: text(bus.type || raw.busType, "AC Sleeper"),
    passengerName: text(passenger.name || raw.passengerName, "Passenger"),
    mobile: text(passenger.mobile || raw.mobile, "9876543210"),
    email: text(passenger.email || raw.email, "passenger@example.com"),
    seats: Array.isArray(raw.selectedSeats)
      ? raw.selectedSeats.join(", ")
      : text(raw.seats || raw.selectedSeats, "L11"),
    amount: text(raw.totalAmount || raw.amount, "0"),
    paymentStatus: text(raw.paymentStatus, "100% Verified Paid"),
    boardingPoint: text(raw.boardingPoint, `${fromCity} Stand`),
    droppingPoint: text(raw.droppingPoint, `${toCity} Stand`),
    departure: text(bus.departure || raw.departure, "06:30 PM"),
    arrival: text(bus.arrival || raw.arrival, "11:30 PM"),
    duration: text(bus.duration || raw.duration, "5h 00m"),
    fromCity,
    toCity,
  };
};

const ETicket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const booking = normalizeBooking(location.state?.booking);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const image = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const width = pageWidth - margin * 2;
      const height = Math.min(
        (canvas.height * width) / canvas.width,
        pageHeight - margin * 2,
      );
      const x = (pageWidth - width) / 2;
      const y = (pageHeight - height) / 2;
      pdf.addImage(image, "PNG", x, y, width, height, undefined, "FAST");
      pdf.save(`TripVista-Ticket-${booking.pnr}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (!location.state?.autoDownload) return undefined;
    const timer = window.setTimeout(handleDownloadPDF, 700);
    return () => window.clearTimeout(timer);
  }, [location.state?.autoDownload]);

  return (
    <div className="eticket-page-layout">
      <div className="eticket-top-action-bar no-print">
        <button
          type="button"
          className="eticket-back-btn"
          onClick={() => navigate("/my-bookings")}
        >
          <FaArrowLeft /> Back to My Bookings
        </button>
        <div className="eticket-action-buttons">
          <button
            type="button"
            className="eticket-print-btn"
            onClick={() => window.print()}
          >
            <FaPrint /> Print Ticket
          </button>
          <button
            type="button"
            className="eticket-download-btn-black"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            <FaDownload />{" "}
            {isDownloading ? "Generating PDF..." : "Download Ticket (PDF)"}
          </button>
        </div>
      </div>
      <div ref={ticketRef} className="eticket-print-target">
        <PrintableETicket booking={booking} />
      </div>
    </div>
  );
};

export default ETicket;
