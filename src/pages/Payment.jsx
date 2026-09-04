import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Payment.css";
import {
  FaBus,
  FaArrowLeft,
  FaCheck,
  FaShieldHalved,
  FaCreditCard,
  FaBuildingColumns,
  FaWallet,
  FaQrcode,
  FaCircleCheck,
  FaTag,
  FaLock,
  FaCalendarDay,
  FaLocationDot,
  FaClock,
} from "react-icons/fa6";

function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const bus = state?.bus;
  const selectedSeats = state?.selectedSeats || [];
  const passenger = state?.passenger;
  const searchDate = state?.date || bus?.date || new Date().toISOString().split("T")[0];
  const boardingPoint = state?.boardingPoint || `${bus?.from || "Origin"} Stand`;
  const droppingPoint = state?.droppingPoint || `${bus?.to || "Destination"} Stand`;

  const baseFare = state?.baseFare || selectedSeats.length * (bus?.price || 500);
  const gstAmount = state?.gstAmount || Math.round(baseFare * 0.05);
  const initialTotal = state?.totalAmount || baseFare + gstAmount;

  const [paymentMethod, setPaymentMethod] = useState("upi"); // 'upi', 'card', 'netbanking', 'wallet'
  const [upiMethod, setUpiMethod] = useState("qr"); // 'qr' or 'id'
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState(passenger?.name || "");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Net banking
  const [selectedBank, setSelectedBank] = useState("sbi");

  // Wallets
  const [selectedWallet, setSelectedWallet] = useState("phonepe");

  // Promo Code
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  // Form error & Processing state
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);

  // QR Timer
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    // Format into 4-digit chunks
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setExpiry(val);
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "BUSVISTA50" || code === "SAVE50" || code === "FIRSTBUS") {
      setDiscount(50);
      setCouponApplied(true);
      setCouponMessage("Coupon applied successfully! You saved ₹50.");
      setError("");
    } else {
      setDiscount(0);
      setCouponApplied(false);
      setCouponMessage("");
      setError("Invalid Coupon Code. Try 'BUSVISTA50'.");
    }
  };

  const finalPayable = Math.max(0, initialTotal - discount);

  const getCardType = () => {
    const clean = cardNumber.replace(/\s/g, "");
    if (clean.startsWith("4")) return "VISA";
    if (clean.startsWith("5")) return "MasterCard";
    if (clean.startsWith("6") || clean.startsWith("8")) return "RuPay";
    return "CARD";
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (paymentMethod === "upi") {
      if (upiMethod === "id") {
        if (!upiId.includes("@") || upiId.length < 5) {
          setError("Please enter a valid UPI ID (e.g. yourname@oksbi / 9876543210@paytm).");
          return;
        }
      }
    } else if (paymentMethod === "card") {
      const rawCard = cardNumber.replace(/\s/g, "");
      if (rawCard.length !== 16) {
        setError("Card number must be 16 digits.");
        return;
      }
      if (!cardHolder.trim()) {
        setError("Please enter the name on the card.");
        return;
      }
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryRegex.test(expiry)) {
        setError("Please enter a valid expiry date in MM/YY format.");
        return;
      }
      if (cvv.length !== 3 || isNaN(cvv)) {
        setError("CVV must be 3 digits.");
        return;
      }
    }

    // Start simulated processing
    setIsProcessing(true);
    setProcessingStep(1);

    setTimeout(() => {
      setProcessingStep(2);
    }, 1000);

    setTimeout(() => {
      setProcessingStep(3);
    }, 2000);

    setTimeout(() => {
      navigate("/booking-success", {
        state: {
          bus,
          date: searchDate,
          selectedSeats,
          boardingPoint,
          droppingPoint,
          passenger,
          baseFare,
          gstAmount,
          discount,
          totalAmount: finalPayable,
          paymentMethod: paymentMethod.toUpperCase(),
        },
      });
    }, 2800);
  };

  if (!bus || !passenger) {
    return (
      <div className="payment-empty-container">
        <div className="empty-card">
          <FaBus className="empty-icon" />
          <h2>No Booking Session Found</h2>
          <p>Please initiate your ticket booking from the search page.</p>
          <button className="back-home-btn" onClick={() => navigate("/")}>
            Search Buses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page-container">
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
        <div className="step-item completed">
          <div className="step-num">
            <FaCheck />
          </div>
          <span>Passenger Details</span>
        </div>
        <div className="step-line active"></div>
        <div className="step-item current">
          <div className="step-num">4</div>
          <span>Payment</span>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN PAYMENT & SUMMARY GRID */}
      <div className="payment-main-grid">
        {/* LEFT COLUMN: PAYMENT OPTIONS */}
        <div className="payment-methods-card">
          <div className="payment-card-header">
            <h2>Select Payment Method</h2>
            <div className="ssl-badge">
              <FaLock /> 256-Bit SSL Encrypted
            </div>
          </div>

          {error && <div className="payment-error-banner">{error}</div>}

          {/* Payment Method Selector Tabs */}
          <div className="payment-nav-tabs">
            <button
              type="button"
              className={`pay-tab ${paymentMethod === "upi" ? "active" : ""}`}
              onClick={() => {
                setPaymentMethod("upi");
                setError("");
              }}
            >
              <FaQrcode className="tab-icon" />
              <span>UPI & QR</span>
            </button>

            <button
              type="button"
              className={`pay-tab ${paymentMethod === "card" ? "active" : ""}`}
              onClick={() => {
                setPaymentMethod("card");
                setError("");
              }}
            >
              <FaCreditCard className="tab-icon" />
              <span>Credit / Debit Card</span>
            </button>

            <button
              type="button"
              className={`pay-tab ${paymentMethod === "netbanking" ? "active" : ""}`}
              onClick={() => {
                setPaymentMethod("netbanking");
                setError("");
              }}
            >
              <FaBuildingColumns className="tab-icon" />
              <span>Net Banking</span>
            </button>

            <button
              type="button"
              className={`pay-tab ${paymentMethod === "wallet" ? "active" : ""}`}
              onClick={() => {
                setPaymentMethod("wallet");
                setError("");
              }}
            >
              <FaWallet className="tab-icon" />
              <span>Wallets</span>
            </button>
          </div>

          {/* TAB 1: UPI & QR */}
          {paymentMethod === "upi" && (
            <div className="payment-tab-content">
              <div className="upi-sub-switch">
                <button
                  type="button"
                  className={`sub-pill ${upiMethod === "qr" ? "active" : ""}`}
                  onClick={() => setUpiMethod("qr")}
                >
                  Scan QR Code
                </button>
                <button
                  type="button"
                  className={`sub-pill ${upiMethod === "id" ? "active" : ""}`}
                  onClick={() => setUpiMethod("id")}
                >
                  Enter UPI ID
                </button>
              </div>

              {upiMethod === "qr" ? (
                <div className="qr-pay-box">
                  <p className="qr-instruction">
                    Scan with any UPI app (GPay, PhonePe, Paytm, BHIM, CRED)
                  </p>
                  <div className="qr-image-wrapper">
                    {/* High-res generated dynamic SVG QR preview */}
                    <svg
                      viewBox="0 0 200 200"
                      className="qr-code-svg"
                      aria-label="Payment QR Code"
                    >
                      <rect width="200" height="200" fill="#ffffff" />
                      {/* Top Left Marker */}
                      <rect x="20" y="20" width="50" height="50" fill="#0f172a" />
                      <rect x="30" y="30" width="30" height="30" fill="#ffffff" />
                      <rect x="38" y="38" width="14" height="14" fill="#0f172a" />

                      {/* Top Right Marker */}
                      <rect x="130" y="20" width="50" height="50" fill="#0f172a" />
                      <rect x="140" y="30" width="30" height="30" fill="#ffffff" />
                      <rect x="148" y="38" width="14" height="14" fill="#0f172a" />

                      {/* Bottom Left Marker */}
                      <rect x="20" y="130" width="50" height="50" fill="#0f172a" />
                      <rect x="30" y="140" width="30" height="30" fill="#ffffff" />
                      <rect x="38" y="148" width="14" height="14" fill="#0f172a" />

                      {/* Simulated QR Data Matrix Blocks */}
                      <rect x="80" y="25" width="12" height="12" fill="#0f172a" />
                      <rect x="100" y="25" width="16" height="12" fill="#0f172a" />
                      <rect x="80" y="45" width="20" height="10" fill="#0f172a" />
                      <rect x="105" y="45" width="14" height="25" fill="#0f172a" />
                      <rect x="80" y="80" width="40" height="40" fill="#2563eb" rx="6" />
                      <rect x="25" y="85" width="15" height="15" fill="#0f172a" />
                      <rect x="50" y="95" width="18" height="12" fill="#0f172a" />
                      <rect x="135" y="85" width="18" height="18" fill="#0f172a" />
                      <rect x="160" y="100" width="15" height="15" fill="#0f172a" />
                      <rect x="85" y="135" width="20" height="15" fill="#0f172a" />
                      <rect x="110" y="140" width="15" height="25" fill="#0f172a" />
                      <rect x="135" y="135" width="40" height="15" fill="#0f172a" />
                      <rect x="145" y="160" width="30" height="15" fill="#0f172a" />
                    </svg>
                    <div className="qr-badge-amount">
                      ₹{finalPayable}
                    </div>
                  </div>

                  <div className="qr-timer-pill">
                    <FaClock /> QR Code expires in <strong>{formatTime(timeLeft)}</strong>
                  </div>

                  <div className="upi-app-logos">
                    <span className="app-tag gpay">Google Pay</span>
                    <span className="app-tag phonepe">PhonePe</span>
                    <span className="app-tag paytm">Paytm</span>
                    <span className="app-tag cred">CRED</span>
                    <span className="app-tag bhim">BHIM</span>
                  </div>
                </div>
              ) : (
                <div className="upi-id-form">
                  <div className="popular-upi-apps">
                    <button
                      type="button"
                      className={`app-btn ${selectedUpiApp === "gpay" ? "active" : ""}`}
                      onClick={() => setSelectedUpiApp("gpay")}
                    >
                      Google Pay
                    </button>
                    <button
                      type="button"
                      className={`app-btn ${selectedUpiApp === "phonepe" ? "active" : ""}`}
                      onClick={() => setSelectedUpiApp("phonepe")}
                    >
                      PhonePe
                    </button>
                    <button
                      type="button"
                      className={`app-btn ${selectedUpiApp === "paytm" ? "active" : ""}`}
                      onClick={() => setSelectedUpiApp("paytm")}
                    >
                      Paytm
                    </button>
                  </div>

                  <div className="upi-input-group">
                    <label>Enter UPI ID / VPA</label>
                    <input
                      type="text"
                      placeholder="e.g. mobile@okhdfcbank or user@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <small className="help-text">
                      A payment request will be sent to your UPI App.
                    </small>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREDIT / DEBIT CARD */}
          {paymentMethod === "card" && (
            <div className="payment-tab-content">
              {/* Interactive Virtual Card Preview */}
              <div className="virtual-card-preview">
                <div className="card-top">
                  <span className="card-chip"></span>
                  <span className="card-brand">{getCardType()}</span>
                </div>
                <div className="card-number-display">
                  {cardNumber || "•••• •••• •••• ••••"}
                </div>
                <div className="card-bottom">
                  <div>
                    <small>CARD HOLDER</small>
                    <p>{cardHolder.toUpperCase() || "YOUR NAME"}</p>
                  </div>
                  <div>
                    <small>EXPIRES</small>
                    <p>{expiry || "MM/YY"}</p>
                  </div>
                </div>
              </div>

              {/* Card Inputs */}
              <div className="card-form-grid">
                <div className="card-input-field full">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength="19"
                  />
                </div>

                <div className="card-input-field full">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Name on card"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                </div>

                <div className="card-input-field half">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    maxLength="5"
                  />
                </div>

                <div className="card-input-field half">
                  <label>CVV / CVC</label>
                  <input
                    type="password"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    maxLength="3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NET BANKING */}
          {paymentMethod === "netbanking" && (
            <div className="payment-tab-content">
              <p className="tab-subtext">Select your preferred Net Banking provider:</p>
              <div className="bank-grid">
                {[
                  { id: "sbi", name: "State Bank of India" },
                  { id: "hdfc", name: "HDFC Bank" },
                  { id: "icici", name: "ICICI Bank" },
                  { id: "axis", name: "Axis Bank" },
                  { id: "kotak", name: "Kotak Mahindra" },
                  { id: "bob", name: "Bank of Baroda" },
                ].map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    className={`bank-card-btn ${selectedBank === bank.id ? "active" : ""}`}
                    onClick={() => setSelectedBank(bank.id)}
                  >
                    <FaBuildingColumns className="bank-icon" />
                    <span>{bank.name}</span>
                    {selectedBank === bank.id && <FaCheck className="bank-check" />}
                  </button>
                ))}
              </div>

              <div className="all-banks-dropdown">
                <label>Or select other banks</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                >
                  <option value="pnb">Punjab National Bank</option>
                  <option value="canara">Canara Bank</option>
                  <option value="union">Union Bank of India</option>
                  <option value="idbi">IDBI Bank</option>
                  <option value="indusind">IndusInd Bank</option>
                  <option value="yes">YES Bank</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 4: WALLETS */}
          {paymentMethod === "wallet" && (
            <div className="payment-tab-content">
              <p className="tab-subtext">Choose your digital wallet for 1-click checkout:</p>
              <div className="wallets-grid">
                {[
                  { id: "phonepe", name: "PhonePe Wallet" },
                  { id: "amazon", name: "Amazon Pay" },
                  { id: "paytm", name: "Paytm Wallet" },
                  { id: "mobikwik", name: "MobiKwik" },
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    className={`wallet-select-card ${selectedWallet === w.id ? "active" : ""}`}
                    onClick={() => setSelectedWallet(w.id)}
                  >
                    <FaWallet className="wallet-icon" />
                    <strong>{w.name}</strong>
                    {selectedWallet === w.id && <FaCheck className="wallet-check" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PAY NOW BUTTON */}
          <div className="pay-action-container">
            <button
              type="button"
              className="main-pay-btn"
              onClick={handlePaymentSubmit}
            >
              Pay ₹{finalPayable} Securely
            </button>
            <div className="security-notice">
              <FaLock /> By clicking Pay, you agree to BusVista terms and privacy policies.
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING & PRICE SUMMARY */}
        <div className="payment-summary-sidebar">
          {/* Coupon Code Box */}
          <div className="coupon-card">
            <div className="coupon-header">
              <FaTag className="tag-icon" />
              <h4>Have a Promo Code?</h4>
            </div>
            <div className="coupon-input-flex">
              <input
                type="text"
                placeholder="Enter 'BUSVISTA50'"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
              />
              {couponApplied ? (
                <button
                  type="button"
                  className="remove-coupon-btn"
                  onClick={() => {
                    setCouponApplied(false);
                    setDiscount(0);
                    setCouponCode("");
                    setCouponMessage("");
                  }}
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  className="apply-coupon-btn"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
              )}
            </div>
            {couponMessage && (
              <p className="coupon-success-msg">
                <FaCircleCheck /> {couponMessage}
              </p>
            )}
          </div>

          {/* Trip Summary Card */}
          <div className="trip-details-card">
            <h3>Fare Summary</h3>

            <div className="trip-info-mini">
              <div className="mini-row">
                <strong>{bus.name}</strong>
                <span className="bus-type-pill">{bus.type}</span>
              </div>
              <p className="route-text">
                {bus.from} <FaArrowLeft style={{ transform: "rotate(180deg)" }} /> {bus.to}
              </p>
              <div className="trip-time-box">
                <span><FaCalendarDay /> {searchDate}</span>
                <span><FaClock /> {bus.departure}</span>
              </div>
            </div>

            <hr className="summary-hr" />

            <div className="passenger-summary-row">
              <span>Passenger:</span>
              <strong>{passenger.name}</strong>
            </div>

            <div className="passenger-summary-row">
              <span>Selected Seats:</span>
              <span className="seats-tag-list">{selectedSeats.join(", ")}</span>
            </div>

            <div className="passenger-summary-row">
              <span>Boarding:</span>
              <small>{boardingPoint}</small>
            </div>

            <hr className="summary-hr" />

            {/* Price Calculations */}
            <div className="price-breakdown-list">
              <div className="price-line">
                <span>Base Fare ({selectedSeats.length} Seats)</span>
                <span>₹{baseFare}</span>
              </div>
              <div className="price-line">
                <span>Taxes & GST (5%)</span>
                <span>₹{gstAmount}</span>
              </div>
              {discount > 0 && (
                <div className="price-line discount-line">
                  <span>Promo Discount</span>
                  <span className="discount-value">- ₹{discount}</span>
                </div>
              )}
              <hr className="summary-hr" />
              <div className="price-line total-line">
                <strong>Grand Total</strong>
                <strong className="grand-price">₹{finalPayable}</strong>
              </div>
            </div>

            <div className="safe-ssl-box">
              <FaShieldHalved className="green-shield" />
              <span>Safe & Verified Payments Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SIMULATED PROCESSING MODAL */}
      {isProcessing && (
        <div className="payment-processing-overlay">
          <div className="processing-modal">
            <div className="processing-spinner"></div>
            <h3>Processing Payment Securely</h3>
            <p className="processing-subtext">Please do not refresh or close the page.</p>

            <div className="processing-steps-list">
              <div className={`step-row ${processingStep >= 1 ? "done" : ""}`}>
                <span className="step-circle">{processingStep > 1 ? "✔" : "1"}</span>
                <span>Connecting to Payment Gateway</span>
              </div>
              <div className={`step-row ${processingStep >= 2 ? "done" : ""}`}>
                <span className="step-circle">{processingStep > 2 ? "✔" : "2"}</span>
                <span>Authorizing Transaction with Bank</span>
              </div>
              <div className={`step-row ${processingStep >= 3 ? "done" : ""}`}>
                <span className="step-circle">✔</span>
                <span>Confirming Seat Reservation</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
