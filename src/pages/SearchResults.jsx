import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import "../css/SearchResults.css";
import busData from "../data/busData";
import BusCard from "../components/BusCard";
import BusDetailsSidebar from "../components/BusDetailsSidebar";
import {
  FaBus,
  FaRightLeft,
  FaFilter,
  FaArrowDownShortWide,
  FaCircleInfo,
  FaCalendarDay,
  FaArrowRight,
  FaRotateLeft,
  FaLayerGroup,
} from "react-icons/fa6";

const CITIES = ["Sangli", "Kolhapur", "Satara", "Pune", "Mumbai", "Solapur"];

function SearchResults() {
  const location = useLocation();
  const initialSearch = location.state;

  // Search Bar State
  const [from, setFrom] = useState(initialSearch?.from || "");
  const [to, setTo] = useState(initialSearch?.to || "");
  const [date, setDate] = useState(
    initialSearch?.date || new Date().toISOString().split("T")[0]
  );
  const [isAllBusesView, setIsAllBusesView] = useState(!initialSearch?.from && !initialSearch?.to);
  const [searchError, setSearchError] = useState("");

  // Filtering & Sorting State
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("price_asc"); // 'price_asc', 'price_desc', 'departure_asc', 'rating_desc', 'duration_asc'

  // Selected bus for sidebar
  const [selectedBus, setSelectedBus] = useState(null);

  // Swap From & To cities
  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  // Perform search
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!from || !to) {
      setSearchError("Please select both Leaving From and Going To cities.");
      return;
    }
    if (from === to) {
      setSearchError("Leaving From and Going To cannot be the same city.");
      return;
    }

    setSearchError("");
    setIsAllBusesView(false);
  };

  // Handle "All View Buses" click
  const handleViewAllBuses = () => {
    setIsAllBusesView(true);
    setSearchError("");
  };

  // Filtered & Sorted Bus List
  const displayBuses = useMemo(() => {
    let list = busData;

    // 1. Route filter (unless 'All View Buses' is active)
    if (!isAllBusesView && from && to) {
      list = list.filter(
        (b) =>
          b.from.trim().toLowerCase() === from.trim().toLowerCase() &&
          b.to.trim().toLowerCase() === to.trim().toLowerCase()
      );
    }

    // 2. Bus Type filter
    if (selectedTypeFilter !== "all") {
      list = list.filter((b) =>
        b.type.toLowerCase().includes(selectedTypeFilter.toLowerCase())
      );
    }

    // 3. Sorting
    return [...list].sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating_desc") return (b.rating || 4.7) - (a.rating || 4.7);
      if (sortBy === "departure_asc") {
        return a.departure.localeCompare(b.departure);
      }
      return 0;
    });
  }, [isAllBusesView, from, to, selectedTypeFilter, sortBy]);

  const handleSelectBus = (bus) => {
    setSelectedBus({
      ...bus,
      date: date || new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="search-results-page">
      <div className="search-results-container">
        {/* 1. TOP DYNAMIC SEARCH BAR (Same as Img 2) */}
        <div className="top-search-bar-card">
          <form onSubmit={handleSearchSubmit} className="search-bar-form">
            <div className="search-input-field">
              <label>Leaving From</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)}>
                <option value="">Select City</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="search-swap-circle-btn"
              onClick={handleSwap}
              title="Swap Departure and Destination"
            >
              <FaRightLeft />
            </button>

            <div className="search-input-field">
              <label>Going To</label>
              <select value={to} onChange={(e) => setTo(e.target.value)}>
                <option value="">Destination</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-input-field date-field">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <button type="submit" className="search-submit-main-btn">
              Search Bus
            </button>
          </form>

          {searchError && <p className="search-bar-error-msg">{searchError}</p>}
        </div>

        {/* 2. RESULTS HEADER WITH "ALL VIEW BUSES" IN TOP RIGHT CORNER */}
        <div className="results-header-banner">
          <div className="header-left">
            <div className="title-row">
              <h1>Available Buses</h1>
              <span className="results-count-badge">
                {displayBuses.length} Buses Available
              </span>
            </div>

            <p className="route-summary-text">
              {isAllBusesView ? (
                <span>
                  Showing <strong>all available buses</strong> across all routes & destinations
                </span>
              ) : from && to ? (
                <span>
                  Showing buses from <strong>{from}</strong> to <strong>{to}</strong>
                  {date && (
                    <span className="date-highlight">
                      {" "}
                      on <FaCalendarDay /> {date}
                    </span>
                  )}
                </span>
              ) : (
                <span>Browse our complete bus fleet and scheduled routes</span>
              )}
            </p>
          </div>

          {/* TOP RIGHT CORNER "ALL VIEW BUSES" BUTTON */}
          <div className="header-right-corner">
            <button
              type="button"
              className={`all-view-buses-corner-btn ${isAllBusesView ? "active" : ""}`}
              onClick={handleViewAllBuses}
              title="Click to view all buses across all cities"
            >
              <FaLayerGroup className="corner-btn-icon" />
              <span>All View Buses</span>
              <span className="all-buses-count-pill">{busData.length}</span>
            </button>
          </div>
        </div>

        {/* 3. FILTER & SORT CONTROL BAR */}
        <div className="controls-filter-bar">
          {/* Quick Bus Type Filter Pills */}
          <div className="type-filter-group">
            <span className="filter-label">
              <FaFilter /> Filter:
            </span>
            {[
              { id: "all", label: "All Buses" },
              { id: "Sleeper", label: "AC Sleeper" },
              { id: "Volvo", label: "Volvo AC" },
              { id: "Seater", label: "Seater" },
              { id: "Non AC", label: "Non-AC" },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                className={`type-filter-pill ${
                  selectedTypeFilter === type.id ? "active" : ""
                }`}
                onClick={() => setSelectedTypeFilter(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="sort-dropdown-group">
            <label>
              <FaArrowDownShortWide /> Sort By:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="price_asc">Price: Lowest First</option>
              <option value="price_desc">Price: Highest First</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="departure_asc">Earliest Departure</option>
            </select>
          </div>
        </div>

        {/* 4. BUS LISTING */}
        <div className="buses-list-wrapper">
          {displayBuses.length > 0 ? (
            displayBuses.map((bus) => (
              <BusCard
                key={bus.id}
                bus={bus}
                searchDate={date}
                onViewSeats={handleSelectBus}
              />
            ))
          ) : (
            <div className="no-buses-card">
              <FaBus className="no-bus-icon" />
              <h3>No Buses Found for this Search</h3>
              <p>
                We couldn't find any scheduled buses matching your specific criteria. Try viewing all buses or adjusting your route.
              </p>
              <div className="no-bus-actions">
                <button
                  type="button"
                  className="reset-search-btn"
                  onClick={handleViewAllBuses}
                >
                  <FaRotateLeft /> View All Available Buses ({busData.length})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. SIDEBAR DETAILS MODAL */}
        <BusDetailsSidebar
          selectedBus={selectedBus}
          onClose={() => setSelectedBus(null)}
        />
      </div>
    </div>
  );
}

export default SearchResults;
