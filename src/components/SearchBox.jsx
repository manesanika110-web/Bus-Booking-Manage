import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaExchangeAlt } from "react-icons/fa";
import "./../css/SearchBox.css";

function SearchBox() {
  const navigate = useNavigate();

  const cities = ["Sangli", "Kolhapur", "Satara", "Pune", "Mumbai", "Solapur"];

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const swapCities = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    if (!from || !to || !date) {
      setError("Please fill all fields.");
      return;
    }

    if (from === to) {
      setError("Leaving From and Going To cannot be the same.");
      return;
    }

    setError("");

    navigate("/search", {
      state: {
        from,
        to,
        date,
      },
    });
  };
  return (
    <>
      <div className="search-box">
        <div className="input-box">
          <label>Leaving From</label>

          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            <option value="">Select City</option>

            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>

        <button className="swap-btn" onClick={swapCities}>
          <FaExchangeAlt />
        </button>

        <div className="input-box">
          <label>Going To</label>

          <select value={to} onChange={(e) => setTo(e.target.value)}>
            <option value="">Destination</option>

            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="input-box">
          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button className="search-btn" onClick={handleSearch}>
          Search Bus
        </button>
      </div>

      {error && <p className="search-error">{error}</p>}
    </>
  );
}

export default SearchBox;
