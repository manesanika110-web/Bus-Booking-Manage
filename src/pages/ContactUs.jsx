import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiMail, FiMapPin, FiPhone, FiSend } from "react-icons/fi";
import "../css/ContactUs.css";

const ContactUs = ({ onAction }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Submitted Data:", formData);
    alert("Message Sent successfully!");

    setFormData({ name: "", email: "", message: "" });

    if (onAction) onAction("login");
  };

  return (
    <div className="contact-page-shell">
      <section className="contact-section">
        <div className="contact-header-row">
          <button
            type="button"
            className="back-home-btn"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>

        <div className="contact-hero">
          <p className="contact-eyebrow">Need assistance?</p>
          <h1>Contact Us</h1>
          <p className="contact-subtitle">
            Whether it’s a trip query, booking support, or travel assistance,
            our team is here to help 24/7.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-card contact-info-card">
            <h2>Reach Our Support Team</h2>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <span className="contact-icon">
                  <FiMapPin />
                </span>
                <div>
                  <strong>Address</strong>
                  <p>123, Travel Street, Near Traffic Hub, India</p>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="contact-icon">
                  <FiPhone />
                </span>
                <div>
                  <strong>Phone</strong>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="contact-icon">
                  <FiMail />
                </span>
                <div>
                  <strong>Email</strong>
                  <p>support@busbook.com</p>
                </div>
              </div>

              <div className="contact-info-item">
                <span className="contact-icon">
                  <FiClock />
                </span>
                <div>
                  <strong>Support Hours</strong>
                  <p>24/7 Customer Support</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-card contact-form-card">
            <h2>Send Us a Message</h2>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="name">Your Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Your Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <FiSend />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
