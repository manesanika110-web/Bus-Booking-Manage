import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { successAlert, errorAlert } from "../utils/alert";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaSignOutAlt,
  FaEdit,
  FaLock,
} from "react-icons/fa";

import "../css/MyProfile.css";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [mobile, setMobile] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setMobile(data.mobile || "");
          setProfilePhoto(data.profilePhoto || "");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      successAlert("Logout Successful!");

      navigate("/", { replace: true });
    } catch (error) {
      errorAlert(error.message);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {profilePhoto ? (
          <img src={profilePhoto} alt="Profile" className="profile-image" />
        ) : (
          <FaUserCircle className="profile-icon" />
        )}

        <h2>{user?.displayName || "User"}</h2>

        <p>
          <FaEnvelope />
          {user?.email}
        </p>

        <p>
          <FaPhone />
          {mobile || "Not Added"}
        </p>

        <button onClick={() => navigate("/profile/edit")}>
          <FaEdit />
          Edit Profile
        </button>

        <button onClick={() => navigate("/profile/change-password")}>
          <FaLock />
          Change Password
        </button>

        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
