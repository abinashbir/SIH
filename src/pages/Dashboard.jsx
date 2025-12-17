import React, { useState, useEffect, useRef } from "react"; 
import SummaryCards from "../components/SummaryCards";
import Alerts from "../components/Alerts";
import Footer from "../components/Footer";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart as ReBarChart,
  Bar,
} from "recharts";

import L from "leaflet";
import "leaflet/dist/images/marker-icon-2x.png";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import "./Dashboard.css";

// Assuming your Supabase client is correctly exported from this file
import { supabase } from "../lib/supabaseClient"; 

// =================================================================
// === Leaflet Icon Path Issue Fix ===
// =================================================================
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});


const Dashboard = ({ sidebarOpen }) => {
  // Filters
  const [formFilters, setFormFilters] = useState({
    metalType: "pH",
    year: "",
    state: "",
    district: "",
    block: "",
    location: "",
  });
  const [filters, setFilters] = useState(formFilters);

  // Dropdown options
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [locations, setLocations] = useState([]);
  const [years, setYears] = useState([]);

  // Hard-coded Data for Pollution Trends (Yearly Line Chart)
  const yearlyTrendData = [
    { year: 2019, Pb: 1.5, Cd: 0.8, As: 0.5, Hg: 0.2 },
    { year: 2020, Pb: 2.1, Cd: 1.2, As: 0.7, Hg: 0.3 },
    { year: 2021, Pb: 2.5, Cd: 1.5, As: 0.9, Hg: 0.4 },
    { year: 2022, Pb: 3.2, Cd: 1.8, As: 1.1, Hg: 0.5 },
    { year: 2023, Pb: 3.5, Cd: 2.0, As: 1.3, Hg: 0.6 },
  ];

  // Chart data state is now initialized with the hard-coded data
  const [chartData, setChartData] = useState(yearlyTrendData); 

  // Dummy Monthly Trend Data (from your original code)
  const monthlyTrendData = [
    { month: "Jan", Pb: 20, Cd: 12, As: 10, Hg: 5 },
    { month: "Feb", Pb: 22, Cd: 15, As: 11, Hg: 7 },
    { month: "Mar", Pb: 25, Cd: 16, As: 13, Hg: 8 },
    { month: "Apr", Pb: 28, Cd: 18, As: 15, Hg: 9 },
    { month: "May", Pb: 30, Cd: 20, As: 18, Hg: 12 },
    { month: "Jun", Pb: 32, Cd: 22, As: 20, Hg: 13 },
    { month: "Jul", Pb: 35, Cd: 24, As: 22, Hg: 14 },
    { month: "Aug", Pb: 34, Cd: 23, As: 21, Hg: 13 },
    { month: "Sep", Pb: 31, Cd: 21, As: 19, Hg: 12 },
    { month: "Oct", Pb: 29, Cd: 20, As: 17, Hg: 11 },
    { month: "Nov", Pb: 27, Cd: 18, As: 15, Hg: 9 },
    { month: "Dec", Pb: 25, Cd: 17, As: 14, Hg: 8 },
  ];
  
  // Map Initialization and Marker Management
  const mapRef = useRef(null); 
  const markersRef = useRef([]);

// 1. Fetch Years (FIXED: Added Set for deduplication)
useEffect(() => {
  const fetchYears = async () => {
    const { data, error } = await supabase.from("raw_data").select("year").distinct();
    console.log("Years:", data, error);

    if (!error && data) {
      const key = data.length > 0 ? Object.keys(data[0]).find(k => k.toLowerCase() === 'year') || Object.keys(data[0])[0] : "year"; 
      
      // ✅ FIX for repeated entries
      const uniqueYears = [...new Set(data.map(d => d[key]))];
      setYears(uniqueYears);
    }
  };
  fetchYears();
}, []);

// 2. Fetch States (FIXED: Removed redundant reset, added Set for deduplication)
useEffect(() => {
  const fetchStates = async () => {
    // Note: The state reset (state: "", district: "", block: "", location: "") 
    // is correctly handled in the filter change handlers (Year/Param).

    let query = supabase.from("raw_data").select("state").distinct();
    if (formFilters.year) query = query.eq("year", formFilters.year);

    const { data, error } = await query;
    console.log("States:", data, error);

    if (!error && data) {
      const key = data.length > 0 ? Object.keys(data[0]).find(k => k.toLowerCase() === 'state') || Object.keys(data[0])[0] : "state";
      
      // ✅ FIX for repeated entries
      const uniqueStates = [...new Set(data.map(d => d[key]))];
      setStates(uniqueStates);
    } else setStates([]);
  };
  fetchStates();
}, [formFilters.year]);

// 3. Fetch Districts (FIXED: Added Set for deduplication)
useEffect(() => {
  if (!formFilters.state) return setDistricts([]);
  const fetchDistricts = async () => {
    let query = supabase.from("raw_data").select("district").eq("state", formFilters.state);
    if (formFilters.year) query = query.eq("year", formFilters.year);

    const { data, error } = await query.distinct();
    console.log("Districts:", data, error);

    if (!error && data) {
      const key = data.length > 0 ? Object.keys(data[0]).find(k => k.toLowerCase() === 'district') || Object.keys(data[0])[0] : "district";
      
      // ✅ FIX for repeated entries
      const uniqueDistricts = [...new Set(data.map(d => d[key]))];
      setDistricts(uniqueDistricts);
    } else setDistricts([]);
  };
  fetchDistricts();
}, [formFilters.state, formFilters.year]);

// 4. Fetch Blocks (FIXED: Added Set for deduplication)
useEffect(() => {
  if (!formFilters.district) return setBlocks([]);
  const fetchBlocks = async () => {
    let query = supabase
      .from("raw_data")
      .select("block")
      .eq("state", formFilters.state)
      .eq("district", formFilters.district);

    if (formFilters.year) query = query.eq("year", formFilters.year);

    const { data, error } = await query.distinct();
    console.log("Blocks:", data, error);

    if (!error && data) {
      const key = data.length > 0 ? Object.keys(data[0]).find(k => k.toLowerCase() === 'block') || Object.keys(data[0])[0] : "block";
      
      // ✅ FIX for repeated entries
      const uniqueBlocks = [...new Set(data.map(d => d[key]))];
      setBlocks(uniqueBlocks);
    } else setBlocks([]);
  };
  fetchBlocks();
}, [formFilters.district, formFilters.year]);

// 5. Fetch Locations (FIXED: Added Set for deduplication)
useEffect(() => {
  if (!formFilters.block) return setLocations([]);
  const fetchLocations = async () => {
    let query = supabase
      .from("raw_data")
      .select("location")
      .eq("state", formFilters.state)
      .eq("district", formFilters.district)
      .eq("block", formFilters.block);

    if (formFilters.year) query = query.eq("year", formFilters.year);

    const { data, error } = await query.distinct();
    console.log("Locations:", data, error);

    if (!error && data) {
      const key = data.length > 0 ? Object.keys(data[0]).find(k => k.toLowerCase() === 'location') || Object.keys(data[0])[0] : "location";
      
      // ✅ FIX for repeated entries
      const uniqueLocations = [...new Set(data.map(d => d[key]))];
      setLocations(uniqueLocations);
    } else setLocations([]);
  };
  fetchLocations();
}, [formFilters.block, formFilters.year]);

  // === MAP INITIALIZATION EFFECT (Runs only ONCE) ===
  useEffect(() => {
    // This effect ensures the map object is created only once.
    if (!mapRef.current) {
        const map = L.map("map").setView([20.5937, 78.9629], 5);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
        mapRef.current = map; 

        // Add Legend
        const legend = L.control({ position: "bottomright" });
        legend.onAdd = function () {
            const div = L.DomUtil.create("div", "info legend");
            div.innerHTML = `
                <h4>Water Quality</h4>
                <i style="background:red"></i> Poor Quality <br>
                <i style="background:yellow"></i> Moderate Quality <br>
                <i style="background:blue"></i> Good Quality
            `;
            return div;
        };
        legend.addTo(map);
    }

    // Cleanup: Remove map instance when component unmounts
    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    };
  }, []); // Run only on mount/unmount


  // === FILTER & DATA FETCH EFFECT (Updates markers) ===
  useEffect(() => {
    if (!mapRef.current) return; // Wait for the map to be initialized

    const map = mapRef.current;

    // Clear existing markers from the map before plotting new ones
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Fetch filtered data from Supabase (Only for Map Plotting)
    const fetchFilteredData = async () => {
      let query = supabase.from("raw_data").select("*"); 

      if (filters.year) query = query.eq("year", filters.year);
      if (filters.state) query = query.eq("state", filters.state);
      if (filters.district) query = query.eq("district", filters.district);
      if (filters.block) query = query.eq("block", filters.block);
      if (filters.location) query = query.eq("location", filters.location);

      const { data, error } = await query;

      if (!error && data) {
        
        // Hard-coded chart data assignment (as per previous request)
        setChartData(yearlyTrendData); 
        
        // MAP PLOTTING LOGIC
        const newMarkers = [];
        data.forEach(point => {
          let color = "#3388ff"; 
          
          if (filters.metalType === "HMPI") {
            if (point.HMPI >= 3) color = "red";
            else if (point.HMPI >= 1) color = "yellow";
            else color = "blue";
          }
          else if (filters.metalType === "pH") {
            if (point.ph < 6.5 || point.ph > 8.5) color = "red"; 
            else color = "blue"; 
          }
          else if (filters.metalType === "TDS") color = point.tds > 1500 ? "red" : "blue";
          else if (filters.metalType === "EC") color = point.ec > 500 ? "red" : "blue";

          // Popup content generation logic (as per previous request)
          const parametersToShow = [
            'STATE','DISTRICT','BLOCK','LOCATION','LATITUDE','LONGITUDE','pH', 'EC', 'CO3', 'HCO3', 'CL', 'SO4', 'NO3', 'PO4', 
            'TH', 'CA', 'MG', 'NA', 'K', 'F', 'SIO2', 'TDS'
          ];

          let popupContent = `
            <div style="font-family: sans-serif; font-size: 14px; color: #333;">
                <h4 style="margin: 0 0 10px; font-weight: bold; color: #1f4068;">${point.location} (${point.year || 'N/A'})</h4>
                <table style="width: 100%; border-collapse: collapse;">
          `;

          parametersToShow.forEach(key => {
              const dbKey = key.toLowerCase();
              const value = point[dbKey] !== undefined && point[dbKey] !== null 
                            ? (typeof point[dbKey] === 'number' ? point[dbKey].toFixed(2) : point[dbKey])
                            : 'N/A';
              
              const highlightStyle = filters.metalType.toLowerCase() === dbKey.toLowerCase() 
                                     ? 'style="background-color: #e6f7ff; font-weight: bold;"' 
                                     : '';

              popupContent += `
                  <tr ${highlightStyle}>
                      <td style="padding: 4px 8px; border-bottom: 1px solid #eee;">${key}</td>
                      <td style="padding: 4px 8px; border-bottom: 1px solid #eee; text-align: right;">${value}</td>
                  </tr>
              `;
          });
          
          popupContent += `
              </table>
            </div>
          `;

          const marker = L.circleMarker([point.latitude, point.longitude], {
            radius: 6,
            fillColor: color,
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8,
          }).addTo(map)
            .bindPopup(popupContent, { maxWidth: 300 }); 
          
          newMarkers.push(marker);
        });
        
        // Update the ref with the new set of markers
        markersRef.current = newMarkers;

        // OPTIONAL: Adjust map bounds to fit new markers
        if (newMarkers.length > 0) {
            const group = new L.FeatureGroup(newMarkers);
            map.fitBounds(group.getBounds().pad(0.5));
        }
      } else {
         // If no data, ensure we clear the chart data if it was tied to the filter.
         // Since chartData is hardcoded, we leave it, but this is where you'd clear it normally.
      }
    };

    fetchFilteredData();

  }, [filters]); // Dependency array: Re-run when filters change


  return (
    <div className={`dashboard-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      <header className="dashboard-header">
        <h1 className="dashboard-title">Heavy Metal Pollution Indices (HMPI) Dashboard</h1>
        <p className="dashboard-subtitle">Track, Analyze, and Predict Water Quality in Your Region</p>
      </header>

      <SummaryCards totalSamples={1230} highRiskAreas={15} safePercent={72} lastUpdated="2 hrs ago" />

      {/* Filters + Map */}
      <div className="filters-map-container">
        <div className="filters-container card">
          <h2 className="card-title">🔍 Filters</h2>

          {/* PARAMETER FILTER */}
          <div className="filter-item">
            <label>Parameter</label>
            <select
              value={formFilters.metalType}
              onChange={e =>
                setFormFilters({
                  ...formFilters,
                  metalType: e.target.value,
                  state: "", district: "", block: "", location: "",
                })
              }
            >
              <option value="HMPI">HMPI</option>
              <option value="pH">pH</option>
              <option value="TDS">TDS</option>
              <option value="EC">EC</option>
            </select>
          </div>

          {/* YEAR FILTER (Dynamic Dropdown) */}
          <div className="filter-item">
            <label>Year</label>
            <select
              value={formFilters.year}
              onChange={e =>
                setFormFilters({
                  ...formFilters,
                  year: e.target.value,
                  state: "", district: "", block: "", location: "",
                })
              }
            >
              <option value="">All</option>
              {/* This map will now use the array of unique years */}
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* STATE FILTER (Dynamic Dropdown) */}
          <div className="filter-item">
            <label>State</label>
            <select
              key={`state-select-${states.length}`} 
              value={formFilters.state}
              onChange={e =>
                setFormFilters({ ...formFilters, state: e.target.value, district: "", block: "", location: "" })
              }
            >
              <option value="">Select State</option>
              {/* This map will now use the array of unique states */}
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* DISTRICT FILTER (Dynamic Dropdown) */}
          <div className="filter-item">
            <label>District</label>
            <select
              value={formFilters.district}
              onChange={e => setFormFilters({ ...formFilters, district: e.target.value, block: "", location: "" })}
              disabled={!districts.length}
            >
              <option value="">Select District</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* BLOCK FILTER (Dynamic Dropdown) */}
          <div className="filter-item">
            <label>Block</label>
            <select
              value={formFilters.block}
              onChange={e => setFormFilters({ ...formFilters, block: e.target.value, location: "" })}
              disabled={!blocks.length}
            >
              <option value="">Select Block</option>
              {blocks.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* LOCATION FILTER (Dynamic Dropdown) */}
          <div className="filter-item">
            <label>Location</label>
            <select
              value={formFilters.location}
              onChange={e => setFormFilters({ ...formFilters, location: e.target.value })}
              disabled={!locations.length}
            >
              <option value="">Select Location</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <button className="submit-btn" onClick={() => setFilters(formFilters)}>Apply Filters</button>
        </div>

        <div className="card map-card large-map">
          <h2 className="card-title">🗺️ Geographic Spread</h2>
          {/* Ensure the ID is 'map' as referenced in L.map("map") */}
          <div id="map" style={{ height: "600px", width: "100%", borderRadius: "10px" }}></div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        <div className="dashboard-row">
          {/* Pollution Trends (Yearly Line Chart - uses hard-coded data) */}
          <div className="card trend-card">
            <h2 className="card-title">📊 Pollution Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.2)" strokeDashArray="3 3" />
                <XAxis dataKey="year" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip contentStyle={{ backgroundColor: "#0d1b33", borderRadius: "8px", border: "none", color: "#fff" }} />
                <Legend />
                <Line type="monotone" dataKey="Pb" stroke="#8884d8" />
                <Line type="monotone" dataKey="Cd" stroke="#82ca9d" />
                <Line type="monotone" dataKey="As" stroke="#ffc658" />
                <Line type="monotone" dataKey="Hg" fill="#ff7f7f" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pollution Monthly Trend (Bar Chart - uses hardcoded data) */}
          <div className="card bar-card">
            <h2 className="card-title">📅 Pollution Monthly Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <ReBarChart data={monthlyTrendData}>
                <CartesianGrid stroke="rgba(255,255,255,0.2)" strokeDashArray="3 3" />
                <XAxis dataKey="month" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip contentStyle={{ backgroundColor: "#0d1b33", borderRadius: "8px", border: "none", color: "#fff" }} />
                <Legend />
                <Bar dataKey="Pb" fill="#8884d8" />
                <Bar dataKey="Cd" fill="#82ca9d" />
                <Bar dataKey="As" fill="#ffc658" />
                <Bar dataKey="Hg" fill="#ff7f7f" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts */}
          <div className="card alert-card">
            <h2 className="card-title">🚨 Recent Alerts</h2>
            <Alerts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;