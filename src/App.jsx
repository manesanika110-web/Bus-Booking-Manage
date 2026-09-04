import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import SeatSelection from "./pages/SeatSelection";
import PassengerDetails from "./pages/PassengerDetails";
import Payment from "./pages/Payment";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";
import ETicket from "./pages/ETicket";
import CancelBooking from "./pages/CancelBooking";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import LoginRegister from "./pages/LoginRegister";
import ProtectedRoute from "./components/ProtectedRoute";
import MyProfile from "./pages/MyProfile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route
        path="/seat-selection"
        element={
          <ProtectedRoute>
            <SeatSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/passenger-details"
        element={
          <ProtectedRoute>
            <PassengerDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking-success"
        element={
          <ProtectedRoute>
            <BookingSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/e-ticket"
        element={
          <ProtectedRoute>
            <ETicket />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cancel-booking"
        element={
          <ProtectedRoute>
            <CancelBooking />
          </ProtectedRoute>
        }
      />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/login-register" element={<LoginRegister />} />
      <Route path="/profile" element={<MyProfile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/profile/change-password" element={<ChangePassword />} />
    </Routes>
  );
}

export default App;
