'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import Apiconnect from '@/services/Apiconnect.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

/* ── ID Proof types with icons ── */
const ID_PROOF_TYPES = [
  { value: "AdharCard",    label: "Aadhar Card",     icon: "badge" },
  { value: "PanCard",           label: "PAN Card",         icon: "credit_card" },
  { value: "DrivingLicense",label: "Driving Licence",  icon: "drive_eta" },
  { value: "Passport",      label: "Passport",          icon: "book" },
  { value: "VoterID",       label: "Voter ID",          icon: "how_to_vote" },
];

/* ── helpers ── */
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

async function getCroppedBlob(imageSrc, pixelCrop) {
  const img = new Image();
  img.src = imageSrc;
  await new Promise((res) => { img.onload = res; });
  const canvas = document.createElement("canvas");
  canvas.width  = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    img,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  );
  return new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.92));
}

const Signup = () => {
  /* ── form state ── */
  const [infoz, setInfoz] = useState({
    fname: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    zip: "",
    referal:"",
    latitude: "",
    longitude: "",
    dt_id: "1",
    bot: "",
    id_proof_typ: "",
  });

  /* ── ui state ── */
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
const [cityError, setCityError] = useState(false);
  /* ── temple state ── */
  const [temples, setTemples]               = useState([]);
  const [selectedTemples, setSelectedTemples] = useState([]);
  const [showTempleDropdown, setShowTempleDropdown] = useState(false);
  const [templeSearch, setTempleSearch]     = useState("");

  /* ── city state ── */
  const [cities, setCities]                   = useState([]);
  const [allCities, setAllCities]             = useState([]);
  const [citySearch, setCitySearch]           = useState("");
  const [selectedCity, setSelectedCity]       = useState(null); // { id, name }
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");

  /* ── id proof type dropdown ── */
  const [showIdTypeDropdown, setShowIdTypeDropdown] = useState(false);

  /* ── crop state ── */
  const [rawSrc, setRawSrc]         = useState(null);
  const [crop, setCrop]             = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedPreview, setCroppedPreview] = useState(null);
  const [showCropModal, setShowCropModal]  = useState(false);
  const [isUploading, setIsUploading]      = useState(false);
  const [uploadedOk, setUploadedOk]        = useState(false);
  const imgRef   = useRef(null);
  const fileInput = useRef(null);

  /* ── init ── */
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchTemples = async () => {
      try {
        const res = await Apiconnect.postData("templelist");
        if (res.data.status === "1") setTemples(res.data.data);
      } catch {}
    };
    fetchTemples();

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

    const fetchLanguages = async () => {
      try {
        const res = await Apiconnect.postData("admin_languagelist");
        if (res.data.status === "1") setLanguages(res.data.data);
      } catch {}
    };
    fetchLanguages();
  }, []);

  /* ── click-outside ── */
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".temple-dropdown"))  setShowTempleDropdown(false);
      if (!e.target.closest(".city-dropdown"))     setShowCityDropdown(false);
      if (!e.target.closest(".idtype-dropdown"))   setShowIdTypeDropdown(false);
      if (!e.target.closest(".language-dropdown")) setShowLanguageDropdown(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  /* ── handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "zip") {
      setInfoz((p) => ({ ...p, [name]: value.replace(/\D/g, "") }));
    } else {
      setInfoz((p) => ({ ...p, [name]: value }));
    }
  };

  const handleTempleSelect = (id) => {
    setSelectedTemples((prev) =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const filteredTemples = temples.filter(t =>
    t.name.toLowerCase().includes(templeSearch.toLowerCase())
  );

  const handleLanguageSelect = (id) => {
    setSelectedLanguages((prev) =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const filteredLanguages = languages.filter(l =>
    l.name.toLowerCase().includes(languageSearch.toLowerCase())
  );

  /* ── city handlers ── */
  const handleCitySearch = (search) => {
    setCitySearch(search);
    setCities(
      allCities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    );
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
    setCitySearch("");
    setCities(allCities);
  };

  /* ── IMAGE PICK → open crop modal ── */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawSrc(reader.result);
      setCrop(undefined);
      setCompletedCrop(null);
      setCroppedPreview(null);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 16 / 9));
  };

  /* ── CROP CONFIRM → upload ── */
  const handleCropAndUpload = async () => {
    if (!completedCrop || !imgRef.current) {
      toast.error("Please select a crop area");
      return;
    }
    if (!infoz.id_proof_typ) {
      toast.error("Please select ID proof type first");
      return;
    }

    try {
      setIsUploading(true);

      const img = imgRef.current;
      const scaleX = img.naturalWidth  / img.width;
      const scaleY = img.naturalHeight / img.height;
      const pixelCrop = {
        x:      completedCrop.x      * scaleX,
        y:      completedCrop.y      * scaleY,
        width:  completedCrop.width  * scaleX,
        height: completedCrop.height * scaleY,
      };

      const blob = await getCroppedBlob(rawSrc, pixelCrop);
      setCroppedPreview(URL.createObjectURL(blob));

      const fd = new FormData();
      fd.append("files", blob, "id_proof.jpg");
      fd.append("folder", "id_proof");

      const res = await Apiconnect.postData("upload", fd);
      console.log(res);
      if (res.data?.success) {
        const fileUrl = res.data.files?.[0]?.url;
        setUploadedFileUrl(fileUrl);
        setUploadedOk(true);
        setShowCropModal(false);
        toast.success("ID proof uploaded!");
      } else {
        toast.error(res.data?.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  /* ── SUBMIT ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (infoz.bot) { alert("Get Lost Bot"); return; }
    if (!infoz.id_proof_typ) { toast.error("Please select ID proof type"); return; }
    if (!uploadedOk) { toast.error("Please upload your ID proof image"); return; }
if (!selectedCity) {
  setCityError(true);
  return;
}
    setIsLoading(true);
    try {
      const payload = {
        ...infoz,
        city_id: selectedCity?.id || "",
        temple_ids: selectedTemples,
        language_ids: selectedLanguages,
        id_proof: uploadedFileUrl,
      };
      if (!payload.address)   delete payload.address;
      if (!payload.zip)       delete payload.zip;
      if (!payload.latitude)  delete payload.latitude;
      if (!payload.longitude) delete payload.longitude;

      const response = await Apiconnect.postDataNoauth("vendor/register", payload);
      console.log(response);
      if (response.data.status === 1) {
        toast.success(response.data.message);
        setTimeout(() => { window.location.href = "/signin"; }, 4000);
      } else {
        // toast.error(response.data.message || "Registration failed.");
        toast.error( "An Account with this phone or email is already exist");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedIdType = ID_PROOF_TYPES.find(t => t.value === infoz.id_proof_typ);

  return (
    <div style={styles.page}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div style={styles.card}>
        <h1 style={styles.title}>Create Your Account</h1>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <label style={styles.label}>Full Name *</label>
          <input style={styles.input} type="text" name="fname"
            placeholder="Full Name" value={infoz.fname}
            onChange={handleChange} required />

          {/* Email */}
          <label style={styles.label}>Email Address *</label>
          <input style={styles.input} type="email" name="email"
            placeholder="Email Address" value={infoz.email}
            onChange={handleChange} required />

          {/* Phone */}
          <label style={styles.label}>Phone Number *</label>
          <input style={styles.input} type="tel" name="phone"
            placeholder="Phone Number" value={infoz.phone}
            onChange={handleChange} maxLength={10} required />

          {/* Password */}
          <label style={styles.label}>Password *</label>
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <input
              type={showPassword ? "text" : "password"}
              style={{ ...styles.input, marginBottom: 0, paddingRight: 42 }}
              name="password" placeholder="Enter Password"
              value={infoz.password} onChange={handleChange} required
            />
            <span
              onClick={() => setShowPassword(p => !p)}
              style={styles.eyeBtn}
              className="material-icons"
            >
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </div>

          {/* Temples */}
          <label style={styles.label}>Select Temples</label>
          <div className="temple-dropdown" style={{ position: "relative", marginBottom: "15px" }}>
            <div
              onClick={() => setShowTempleDropdown(p => !p)}
              style={{ ...styles.input, display: "flex", flexWrap: "wrap", gap: 5, cursor: "pointer", minHeight: 45, marginBottom: 0 }}
            >
              {selectedTemples.length === 0 ? (
                <span style={{ color: "#aaa" }}>Select Temples</span>
              ) : (
                selectedTemples.map(id => {
                  const temple = temples.find(t => t.id === id);
                  return (
                    <span key={id} style={styles.tag}>
                      {temple?.name}
                      <span onClick={(e) => { e.stopPropagation(); handleTempleSelect(id); }} style={{ marginLeft: 5, cursor: "pointer" }}>×</span>
                    </span>
                  );
                })
              )}
            </div>
            {showTempleDropdown && (
              <div style={{ ...styles.dropdown, maxHeight: 200, overflowY: "auto" }}>
                <div style={{ padding: 10 }}>
                  <input type="text" placeholder="Search temple..."
                    value={templeSearch} onChange={e => setTempleSearch(e.target.value)}
                    style={styles.searchInput} autoFocus />
                </div>
                {filteredTemples.length === 0
                  ? <div style={styles.dropdownItem}>No temples found</div>
                  : filteredTemples.map(temple => (
                    <div key={temple.id}
                      style={{ ...styles.dropdownItem, display: "flex", alignItems: "center" }}
                      onClick={() => handleTempleSelect(temple.id)}>
                      <input type="checkbox" readOnly
                        checked={selectedTemples.includes(temple.id)}
                        style={{ marginRight: 8 }} />
                      {temple.name}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Languages */}
          <label style={styles.label}>Select Languages</label>
          <div className="language-dropdown" style={{ position: "relative", marginBottom: "15px" }}>
            <div
              onClick={() => setShowLanguageDropdown(p => !p)}
              style={{ ...styles.input, display: "flex", flexWrap: "wrap", gap: 5, cursor: "pointer", minHeight: 45, marginBottom: 0 }}
            >
              {selectedLanguages.length === 0 ? (
                <span style={{ color: "#aaa" }}>Select Languages</span>
              ) : (
                selectedLanguages.map(id => {
                  const lang = languages.find(l => l.id === id);
                  return (
                    <span key={id} style={styles.tag}>
                      {lang?.name}
                      <span onClick={(e) => { e.stopPropagation(); handleLanguageSelect(id); }} style={{ marginLeft: 5, cursor: "pointer" }}>×</span>
                    </span>
                  );
                })
              )}
            </div>
            {showLanguageDropdown && (
              <div style={{ ...styles.dropdown, maxHeight: 200, overflowY: "auto" }}>
                <div style={{ padding: 10 }}>
                  <input type="text" placeholder="Search language..."
                    value={languageSearch} onChange={e => setLanguageSearch(e.target.value)}
                    style={styles.searchInput} autoFocus />
                </div>
                {filteredLanguages.length === 0
                  ? <div style={styles.dropdownItem}>No languages found</div>
                  : filteredLanguages.map(lang => (
                    <div key={lang.id}
                      style={{ ...styles.dropdownItem, display: "flex", alignItems: "center" }}
                      onClick={() => handleLanguageSelect(lang.id)}>
                      <input type="checkbox" readOnly
                        checked={selectedLanguages.includes(lang.id)}
                        style={{ marginRight: 8 }} />
                      {lang.name}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* City + Zip */}
          <div style={styles.row}>
  <div style={styles.col}>
    <label style={styles.label}>City *</label>

    <div style={{ position: "relative" }} className="city-dropdown">
      <div
        onClick={() => setShowCityDropdown(true)}
        style={{
          ...styles.input,
          cursor: "pointer",
          border:
            cityError && !selectedCity
              ? "1px solid red"
              : styles.input.border,
        }}
      >
        {selectedCity ? (
          selectedCity.name
        ) : (
          <span style={{ color: "#aaa" }}>Select City</span>
        )}
      </div>

      {/* Hidden required input */}
      <input
        type="text"
        value={selectedCity ? selectedCity.name : ""}
        required
        readOnly
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          height: 0,
          width: 0,
        }}
      />

      {cityError && !selectedCity && (
        <div style={{ color: "red", fontSize: 12, marginTop: 4 }}>
          City is required
        </div>
      )}

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

          <div style={{ maxHeight: 160, overflowY: "auto" }}>
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
                  onClick={() => {
                    handleCitySelect(city);
                    setCityError(false);
                  }}
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
  </div>

  <div style={styles.col}>
    <label style={styles.label}>Zip Code *</label>

    <input
      style={styles.input}
      type="text"
      name="zip"
      placeholder="Zip Code"
      value={infoz.zip}
      maxLength={6}
      onChange={handleChange}
      required
    />
  </div>
</div>

          {/* Address */}
          <label style={styles.label}>Address *</label>
          <input
            style={styles.input}
            type="text"
            name="address"
            placeholder="Enter your address"
            value={infoz.address}
            onChange={handleChange}
            required

          />

          {/* Referral */}
          <label style={styles.label}>Referal Code </label>
          <input style={styles.input} type="text" name="referal"
            placeholder="Referal Code(Optional)" value={infoz.referal}
            onChange={handleChange}  />

          {/* ── ID PROOF SECTION ── */}
          <div style={styles.sectionDivider}>
            <span className="material-icons" style={{ fontSize: 16, color: "#ffd569" }}>verified_user</span>
            ID Proof
          </div>

          {/* ID Proof Type Dropdown */}
          <label style={styles.label}>ID Proof Type *</label>
          <div className="idtype-dropdown" style={{ position: "relative", marginBottom: 15 }}>
            <div
              onClick={() => setShowIdTypeDropdown(p => !p)}
              style={{ ...styles.input, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginBottom: 0 }}
            >
              {selectedIdType ? (
                <>
                  <span className="material-icons" style={{ fontSize: 18, color: "#ffd569" }}>{selectedIdType.icon}</span>
                  {selectedIdType.label}
                </>
              ) : (
                <span style={{ color: "#aaa" }}>Select ID Proof Type</span>
              )}
              <span className="material-icons" style={{ marginLeft: "auto", fontSize: 18, color: "rgba(255,255,255,0.4)" }}>
                {showIdTypeDropdown ? "expand_less" : "expand_more"}
              </span>
            </div>
            {showIdTypeDropdown && (
              <div style={{ ...styles.dropdown, zIndex: 20 }}>
                {ID_PROOF_TYPES.map(opt => (
                  <div
                    key={opt.value}
                    style={{
                      ...styles.dropdownItem,
                      display: "flex", alignItems: "center", gap: 10,
                      background: infoz.id_proof_typ === opt.value ? "rgba(255,213,105,0.1)" : "transparent",
                      color: infoz.id_proof_typ === opt.value ? "#ffd569" : "#fff",
                    }}
                    onClick={() => {
                      setInfoz(p => ({ ...p, id_proof_typ: opt.value }));
                      setShowIdTypeDropdown(false);
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: 18 }}>{opt.icon}</span>
                    {opt.label}
                    {infoz.id_proof_typ === opt.value && (
                      <span className="material-icons" style={{ marginLeft: "auto", fontSize: 16 }}>check</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ID Proof Image Upload */}
          <label style={styles.label}>ID Proof Image *</label>
          <div
            style={styles.uploadBox}
            onClick={() => fileInput.current?.click()}
          >
            {croppedPreview ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <img src={croppedPreview} alt="ID proof" style={{ height: 60, borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)" }} />
                <div>
                  <div style={{ color: "#6ee7b7", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
                    <span className="material-icons" style={{ fontSize: 16 }}>check_circle</span>
                    Uploaded successfully
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 3 }}>Click to change</div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <span className="material-icons" style={{ fontSize: 36, color: "rgba(255,213,105,0.5)", display: "block", marginBottom: 8 }}>add_photo_alternate</span>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Click to upload ID proof image</div>
                <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 4 }}>JPG, PNG • You can crop after selecting</div>
              </div>
            )}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* Bot honeypot */}
          <input type="text" name="bot" value={infoz.bot} onChange={handleChange} style={{ display: "none" }} />

          <button style={{ ...styles.button, marginTop: 24, opacity: isLoading ? 0.6 : 1 }} disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Register"}
          </button>

          <p style={styles.signupText}>
            Already have an account?{" "}
            <Link href="/signin" style={styles.signupLink}>Sign in</Link>
          </p>
        </form>
      </div>

      {/* ── CROP MODAL ── */}
      {showCropModal && rawSrc && (
        <div style={styles.overlay} onClick={e => { if (e.target === e.currentTarget) setShowCropModal(false); }}>
          <div style={styles.cropModal}>
            <div style={styles.cropHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="material-icons" style={{ color: "#ffd569", fontSize: 20 }}>crop</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>Crop ID Proof Image</span>
              </div>
              <button style={styles.closeBtn} onClick={() => setShowCropModal(false)}>
                <span className="material-icons" style={{ fontSize: 18 }}>close</span>
              </button>
            </div>

            <div style={styles.cropHint}>Drag to crop — adjust to show your ID clearly</div>

            <div style={{ maxHeight: "55vh", overflow: "auto", borderRadius: 10, background: "rgba(0,0,0,0.3)" }}>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                style={{ maxWidth: "100%" }}
              >
                <img
                  ref={imgRef}
                  src={rawSrc}
                  alt="crop source"
                  style={{ maxWidth: "100%", display: "block" }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>

            <div style={styles.cropFooter}>
              <button style={styles.cancelBtn} onClick={() => setShowCropModal(false)}>
                Cancel
              </button>
              <button
                style={{ ...styles.confirmBtn, opacity: isUploading ? 0.6 : 1 }}
                onClick={handleCropAndUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  "Uploading…"
                ) : (
                  <>
                    <span className="material-icons" style={{ fontSize: 16 }}>cloud_upload</span>
                    Crop & Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <style>{`
        .react-crop__crop-selection { border: 2px solid #ffd569 !important; }
        .react-crop__rule-of-thirds-hz::before,
        .react-crop__rule-of-thirds-hz::after,
        .react-crop__rule-of-thirds-vt::before,
        .react-crop__rule-of-thirds-vt::after {
          border-color: rgba(255,213,105,0.3) !important;
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "60px 20px 80px",
  },
  card: {
    width: "100%",
    maxWidth: 600,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    borderRadius: 24,
    padding: "40px",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
    color: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: "2rem",
    color: "#ffd569",
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 14,
    color: "#fff",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: 15,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#ffd569",
    fontSize: 20,
    userSelect: "none",
  },
  row: { display: "flex", gap: 15 },
  col: { flex: 1 },
  tag: {
    background: "#ffd569",
    color: "#000",
    padding: "3px 8px",
    borderRadius: 6,
    fontSize: 12,
    display: "flex",
    alignItems: "center",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#1a0b2e",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    zIndex: 10,
    marginTop: 4,
  },
  dropdownItem: {
    padding: "10px 14px",
    cursor: "pointer",
    color: "#fff",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: 13,
    transition: "background 0.15s",
  },
  searchInput: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "8px 10px",
    color: "#fff",
    outline: "none",
    fontSize: 13,
  },
  sectionDivider: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: "20px 0 16px",
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    paddingBottom: 10,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  uploadBox: {
    width: "100%",
    minHeight: 90,
    borderRadius: 12,
    border: "2px dashed rgba(255,213,105,0.3)",
    background: "rgba(255,213,105,0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 16,
    marginBottom: 20,
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: 13,
    borderRadius: 12,
    border: "none",
    background: "#e08007",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 15,
  },
  signupText: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 14,
    color: "#ccc",
  },
  signupLink: {
    color: "#ffd569",
    textDecoration: "none",
    fontWeight: 600,
    marginLeft: 5,
  },
  /* CROP MODAL */
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.78)",
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backdropFilter: "blur(6px)",
  },
  cropModal: {
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 560,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  cropHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cropHint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.35)",
  },
  cropFooter: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
    paddingTop: 8,
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
  closeBtn: {
    background: "rgba(255,255,255,0.07)",
    border: "none",
    borderRadius: 8,
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "rgba(255,255,255,0.5)",
  },
  cancelBtn: {
    height: 36,
    padding: "0 18px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
  confirmBtn: {
    height: 36,
    padding: "0 18px",
    borderRadius: 8,
    border: "none",
    background: "#e08007",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
};

export default Signup;