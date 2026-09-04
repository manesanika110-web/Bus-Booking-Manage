import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./../css/Navbar.css";
import { FaBusAlt, FaUserCircle } from "react-icons/fa";

import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { successAlert, errorAlert } from "../utils/alert";

function Navbar() {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();

        setUser(auth.currentUser);

        // Firestore मधून Profile Data
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setProfilePhoto(data.profilePhoto || "");
        }
      } else {
        setUser(null);
        setProfilePhoto("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      successAlert("Logout Successful!");

      navigate("/");
    } catch (error) {
      errorAlert(error.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <FaBusAlt className="logo-icon" />
          <h2>TripVista</h2>
        </Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/my-bookings">My Bookings</Link>
        </li>

        <li>
          <Link to="/about-us">About</Link>
        </li>

        <li>
          <Link to="/contact-us">Contact</Link>
        </li>
      </ul>

      {user ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            onClick={() => navigate("/profile")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "10px",
              background: "#f5f5f5",
            }}
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="navbar-profile-image"
              />
            ) : (
              <FaUserCircle className="navbar-user-icon" />
            )}

            <span>{user.displayName || user.email}</span>
          </div>

          <button className="login-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login-register">
          <button className="login-btn">Login / Register</button>
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
