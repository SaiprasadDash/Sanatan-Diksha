'use client';

import React, { useState, useEffect } from "react";
import Apiconnect from '@/services/Apiconnect.js';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { useRef } from "react";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const autocompleteRef = useRef(null);
  const googleLibraries = ["places"];
  /* ── city state ── */
  const [cities, setCities] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState(null); // { id, name }
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [infoz, setInfoz] = useState({
    fname: "",
    email: "",
    phone: "",
    password: "",
    dob: "",
    tob: "",
    address: "",
    zip: "",
    referal: "",
    latitude: "",
    longitude: "",
    bot: "",
  });

  // Fetch cities from api
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCities = async () => {
      try {
        const res = await Apiconnect.postData("admin_citylist");
        if (res.data.status === "1") {
          setAllCities(res.data.data);
          setCities(res.data.data);
        }
      } catch {}
    };
    fetchCities();
  }, []);

  /* ──To close city dropdown ── */
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".city-dropdown")) setShowCityDropdown(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleCitySearch = (search) => {
    setCitySearch(search);
    setCities(
      allCities.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
    setCitySearch("");
    setCities(allCities);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "zip") {
      setInfoz({ ...infoz, [name]: value.replace(/\D/g, "") });
    } else {
      setInfoz({ ...infoz, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (infoz.bot) {
      alert("Get Lost Bot ");
      return;
    }

    setIsLoading(true);

    try {
      let payload = {
        ...infoz,
        city_id: selectedCity?.id || "",
      };

      if (!payload.dob) delete payload.dob;
      if (!payload.tob) delete payload.tob;
      if (!payload.address) delete payload.address;
      if (!payload.zip) delete payload.zip;
      if (!payload.latitude) delete payload.latitude;
      if (!payload.longitude) delete payload.longitude;
      if (!payload.city_id) delete payload.city_id;
// console.log("payload",payload)
      const response = await Apiconnect.postDataNoauth(
        "customer/register",
        payload,
      );
      // console.log(response);

      if (response.data.status === 1) {
        toast.success(response.data.message);

        setInfoz({
          fname: "",
          email: "",
          phone: "",
          password: "",
          dob: "",
          tob: "",
          address: "",
          zip: "",
          referal: "",
          latitude: "",
          longitude: "",
          bot: "",
        });
        setSelectedCity(null);

        localStorage.setItem("email", payload.email);

        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={styles.card}>
        <h1 style={styles.title}>Create Your Account</h1>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full Name *</label>
          <input
            style={styles.input}
            type="text"
            name="fname"
            placeholder="Full Name"
            value={infoz.fname}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Email Address *</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email Address"
            value={infoz.email}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Phone Number *</label>
          <input
            style={styles.input}
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={infoz.phone}
            onChange={handleChange}
            maxLength={10}
            required
          />

          <label style={styles.label}>Password *</label>
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <input
              type={showPassword ? "text" : "password"}
              style={{ ...styles.input, marginBottom: 0, paddingRight: 42 }}
              name="password"
              placeholder="Enter Password"
              value={infoz.password}
              onChange={handleChange}
              required
            />
            <i
              className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#FFD569",
                fontSize: "18px",
              }}
            />
          </div>

          {/* DOB + TOB */}
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Date of Birth</label>
             <div style={styles.datePickerWrapper}>
  <DatePicker
    selected={infoz.dob ? new Date(infoz.dob) : null}
    onChange={(date) =>
      setInfoz({
        ...infoz,
        dob: date ? date.toISOString().split("T")[0] : "",
      })
    }
    dateFormat="yyyy-MM-dd"
    placeholderText="Select Date of Birth"
    showYearDropdown
    scrollableYearDropdown
    yearDropdownItemNumber={200}
    maxDate={new Date()}
    customInput={<input style={styles.datePickerInput} />}
  />
</div>
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Time of Birth</label>
              <input
                style={styles.input}
                type="time"
                name="tob"
                value={infoz.tob}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Address — plain input, separate from city */}
          <label style={styles.label}>Address</label>
          <LoadScript
            googleMapsApiKey="AIzaSyCsWlC4v29952IWXd1SFaIenTaiiV6blN0"
            libraries={googleLibraries}
          >
            <Autocomplete
              onLoad={(autocomplete) => {
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={() => {
                const place = autocompleteRef.current.getPlace();

                console.log(place);

                const lat = place.geometry?.location?.lat();
                const lng = place.geometry?.location?.lng();

                setInfoz((prev) => ({
                  ...prev,
                  address: place.formatted_address || "",
                  latitude: lat || "",
                  longitude: lng || "",
                }));
              }}
            >
              <input
                type="text"
                placeholder="Search by local area, city, location..."
                value={infoz.address}
                onChange={(e) =>
                  setInfoz({
                    ...infoz,
                    address: e.target.value,
                  })
                }
                style={styles.input}
              />
            </Autocomplete>
          </LoadScript>

          {/* City + Zip */}
          <div style={styles.row}>
            {/* <div style={styles.col}>
              <label style={styles.label}>Place Of Birth</label>
              <div className="city-dropdown" style={{ position: "relative" }}>
                <div
                  onClick={() => setShowCityDropdown((p) => !p)}
                  style={{
                    ...styles.input,
                    cursor: "pointer",
                    marginBottom: 15,
                  }}
                >
                  {selectedCity ? (
                    selectedCity.name
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.35)" }}>
                      Select City
                    </span>
                  )}
                </div>
                {showCityDropdown && (
                  <div style={styles.dropdown}>
                    <div
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Search city..."
                        value={citySearch}
                        onChange={(e) => handleCitySearch(e.target.value)}
                        style={styles.searchInput}
                        autoFocus
                      />
                    </div>
                    <div style={{ maxHeight: "160px", overflowY: "auto" }}>
                      {cities.length === 0 ? (
                        <div style={styles.dropdownItem}>No cities found</div>
                      ) : (
                        cities.map((city) => (
                          <div
                            key={city.id}
                            style={{
                              ...styles.dropdownItem,
                              background:
                                selectedCity?.id === city.id
                                  ? "rgba(255,213,105,0.1)"
                                  : "transparent",
                              color:
                                selectedCity?.id === city.id
                                  ? "#ffd569"
                                  : "#fff",
                            }}
                            onClick={() => handleCitySelect(city)}
                          >
                            {city.name}
                            {city.state_name && (
                              <span
                                style={{
                                  color: "rgba(255,255,255,0.35)",
                                  fontSize: 11,
                                  marginLeft: 6,
                                }}
                              >
                                {city.state_name}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div> */}

            {/* <div style={styles.col}>
              <label style={styles.label}>Zip Code</label>
              <input
                style={styles.input}
                type="text"
                name="zip"
                placeholder="Zip Code"
                value={infoz.zip}
                maxLength={6}
                onChange={handleChange}
              />
            </div> */}
          </div>

          {/* <div style={styles.col}>
            <label style={styles.label}>Zip Code</label>
            <input
              style={styles.input}
              type="text"
              name="zip"
              placeholder="Zip Code"
              value={infoz.zip}
              maxLength={6}
              onChange={handleChange}
            />
          </div>

          <label style={styles.label}>Referal Code</label>
          <input
            style={styles.input}
            type="text"
            name="referal"
            placeholder="Referal Code (Optional)"
            value={infoz.referal}
            onChange={handleChange}
          /> */}

          <div style={{ display: "flex", gap: "15px", width: "100%" }}>
            <div style={{ ...styles.col, flex: 1 }}>
              <label style={styles.label}>Zip Code</label>
              <input
                style={styles.input}
                type="text"
                name="zip"
                placeholder="Zip Code"
                value={infoz.zip}
                maxLength={6}
                onChange={handleChange}
              />
            </div>

            <div style={{ ...styles.col, flex: 1 }}>
              <label style={styles.label}>Referal Code</label>
              <input
                style={styles.input}
                type="text"
                name="referal"
                placeholder="Referal Code (Optional)"
                value={infoz.referal}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Bot honeypot */}
          <input
            type="text"
            name="bot"
            value={infoz.bot}
            onChange={handleChange}
            style={{ display: "none" }}
          />

          <button style={styles.button} disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
  },
  row: {
    display: "flex",
    gap: "15px",
  },
  col: {
    flex: 1,
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    borderRadius: "24px",
    padding: "40px",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
    color: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "2rem",
    color: "#ffd569",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    color: "#fff",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "#e08007",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#1a0b2e",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    zIndex: 10,
    marginTop: 2,
  },
  dropdownItem: {
    padding: "10px 14px",
    cursor: "pointer",
    color: "#fff",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: 13,
  },
  searchInput: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "8px 10px",
    color: "#fff",
    outline: "none",
    fontSize: 13,
  },
   datePickerWrapper: {
    width: "100%",
  },

 datePickerInput: {
    width: window.innerWidth > 768 ? "131%" : "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
};

export default Register;
