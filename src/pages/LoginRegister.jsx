import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import "../css/LoginRegister.css";
import { auth, db } from "../firebase";
import { successAlert, errorAlert } from "../utils/alert";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

if (auth.currentUser) {
  console.log(auth.currentUser.displayName);
}

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        successAlert("Login Successful!");
        navigate("/", { replace: true });
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        displayName: name,
        email,
        mobile: "",
        profilePhoto: "",
        createdAt: new Date().toISOString(),
      });

      successAlert("Registration Successful! Your profile is saved.");
      setName("");
      setEmail("");
      setPassword("");
      setIsLogin(true);
      navigate("/login-register", { replace: true });
    } catch (error) {
      errorAlert(error.message);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-visual-panel">
          <div className="brand-badge">TripVista</div>
          <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p>
            {isLogin
              ? "Book your next journey with comfort, safety, and instant support."
              : "Join thousands of happy travelers and manage your bookings with ease."}
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-dot"></span>
              <span>Easy digital bookings</span>
            </div>
            <div className="feature-item">
              <span className="feature-dot"></span>
              <span>Live seat confirmation</span>
            </div>
            <div className="feature-item">
              <span className="feature-dot"></span>
              <span>Secure and trusted rides</span>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-header">
            <h3>{isLogin ? "LOGIN TO TRIPVISTA" : "CREATE ACCOUNT"}</h3>
          </div>

          <form className="auth-body" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-auth-submit">
              {isLogin ? "Login" : "Register"}
            </button>

            <p className="auth-toggle-text">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Register Here" : "Login Here"}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
