'use client';

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../../i18";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Apiconnect from '@/services/Apiconnect';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/Sanatan Logo-high res.png";
import "@/styles/global.css";

const Header = ({ onMenuToggle, isMenuOpen }) => {
  const menuRef = useRef(null);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const token = localStorage.getItem("token");
  const fname = localStorage.getItem("fname");
  const userType = localStorage.getItem("user_typ");
  const firstLetter = fname ? fname.charAt(0).toUpperCase() : "";
  const openModal = () => {
    setShowModal(true);
    setMenuOpen(false);
  };
  const closeModal = () => setShowModal(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => {
    setMenuOpen(false);
  };
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await Apiconnect.postData("customer/login", {
        email: email,
        password: password,
      });

      console.log("Login Response:", response);

      if (response?.data?.status === 1) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_typ", response.data.customer.user_typ);
        localStorage.setItem("fname", response.data.customer.fname);
        localStorage.setItem("email", response.data.customer.email);
 setTimeout(() => {
      window.location.reload();
    }, 800);
        toast.success(response.data.message, {
          autoClose: 1500,
          onClose: () => {
            closeModal();
            const userType = response.data.customer.user_typ;
            if (userType === "Customer") {
              router.push("/user/dashboard");
            } else {
              router.push("/");
            }
          },
        });
      } else {
        setError(response?.data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login Error:", err);

      if (err.response && err.response.data) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fname");
    localStorage.removeItem("email");
    localStorage.removeItem("user_typ");

    toast.success("Logged out successfully");

    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <>
      {/* <nav className="navbar navbar-expand-lg navbar-dark sd-header px-3"> */}
      <nav
        className={`navbar navbar-expand-lg navbar-dark sd-header px-3 
    ${token ? (userType === "Customer" ? "customer-border" : "vendor-border") : "default-border"}
  `}
      >
        <div className="container">
          <ToastContainer position="top-right" autoClose={3000} />

          {/* Mobile Menu Button - Only visible on mobile */}
          {onMenuToggle && (
            <button
              className="sd-mobile-menu-btn"
              onClick={onMenuToggle}
              style={{
                display: "none",
                background: "transparent",
                border: "none",
                color: "#FFD569",
                fontSize: "24px",
                cursor: "pointer",
                padding: "8px",
                marginRight: "12px",
                borderRadius: "8px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="material-symbols-outlined">
                {isMenuOpen ? "close" : "apps"}
              </i>
            </button>
          )}

          <a className="navbar-brand d-flex align-items-center gap-0" href="/">
            <div className="logo-box">
              <img src={logo.src} alt="Logo" className="logo-img" />
            </div>

            <span className="fw-bold brand-text">Sanatan Diksha</span>
          </a>

          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav mx-auto gap-lg-4 mt-3 mt-lg-0">
              <li className="nav-item">
                <Link href="/"
                  onClick={closeMenu}
                  className={`nav-link ${pathname === "/" ? "active-menu" : ""}`}
                >
                  {t("home")}
                </Link>
              </li>

              <li className="nav-item">
                <Link href="/panchang"
                  onClick={closeMenu}
                  className={`nav-link ${pathname === "/panchang" ? "active-menu" : ""}`}
                >
                  {t("panchang")}
                </Link>
              </li>

              <li className="nav-item">
                <Link href="/geeta"
                  onClick={closeMenu}
                  className={`nav-link ${pathname === "/geeta" ? "active-menu" : ""}`}
                >
                  {t("geeta")}
                </Link>
              </li>

              {/*  <li className="nav-item">
                <Link href="/practice"
                  onClick={closeMenu}
                  className={`nav-link ${pathname === "/practice" ? "active-menu" : ""}`}
                >
                  {t("practice")}
                </Link>
              </li>  */}

              <li className="nav-item">
                <Link href="/temples"
                  onClick={closeMenu}
                  className={`nav-link ${pathname === "/temples" ? "active-menu" : ""}`}
                >
                  {t("temples")}
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/feedback"
                  onClick={closeMenu}
                  className={`nav-link ${pathname === "/feedback" ? "active-menu" : ""}`}
                >
                  {t("feedback")}
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link href="/shop"
                  onClick={closeMenu}
                  className={`nav-link ${pathname === "/shop" ? "active-menu" : ""}`}
                >
                  {t("shop")}
                </Link>
              </li> */}
              <li className="nav-item">
                <Link href="/comingsoon"
                  onClick={closeMenu}
                  className={`nav-link ${pathname === "/comingsoon" ? "active-menu" : ""}`}
                >
                  {t("comingSoon")}
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link href="/test"
                  onClick={closeMenu}
                  className={`nav-link ${pathname === "/test" ? "active-menu" : ""}`}
                >
                  {t("Test")}
                </Link>
              </li> */}
            </ul>

            {/* <div className="d-flex align-items-center gap-3">
              <button
                className="lang-btn d-flex align-items-center"
                onClick={toggleLanguage}
              >
                {i18n.language === "en" ? "EN" : "हिंदी"}
              </button>

              <button className="signin-btn" onClick={openModal}>{t("signIn")}</button>

            </div> */}
            <div className="d-flex align-items-center gap-3">
              <button
                className="lang-btn d-flex align-items-center"
                onClick={toggleLanguage}
              >
                <span
                  className={
                    i18n.language === "en" ? "active-lang" : "inactive-lang"
                  }
                >
                  EN
                </span>
                <span className="mx-1">|</span>
                <span
                  className={
                    i18n.language === "hi" ? "active-lang" : "inactive-lang"
                  }
                >
                  हिं
                </span>
              </button>

              {/* <button className="signin-btn" onClick={openModal}>{t("signIn")}</button> */}
              {token ? (
                <div style={{ position: "relative" }} ref={menuRef}>
                  <div
                    className={`${
                      userType === "Customer"
                        ? "customer-avatar"
                        : "vendor-avatar"
                    }`}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    {firstLetter}
                  </div>

                  {showUserMenu && (
                    <div className="user-dropdown">
                      {/* <div className="user-name">{fname.split(" ")[0]} */}
                      <div className="user-name">{fname}</div>
                      <button
                        className="logout-btn"
                        // onClick={() => router.push("/user/dashboard")}
                        onClick={() => {
                          const userType = localStorage.getItem("user_typ");

                          if (userType === "Customer") {
                            router.push("/user/dashboard");
                          } else {
                            router.push("/vendor/dashboard");
                          }
                        }}
                      >
                        Dashboard
                      </button>
                      {/* {localStorage.getItem("user_typ") === "Customer" && (
                        <button
                          className="logout-btn"
                          onClick={() => router.push("/user/dashboard")}
                        >
                          Dashboard
                        </button>
                      )} */}
                      <button className="logout-btn" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="signin-btn" onClick={openModal}>
                  {t("signIn")}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h6>{t("signInTitle")}</h6>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-subtitle">Login to your account</div>

            <input
              type="email"
              className="email-input mb-3"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Field */}
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="email-input"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              ></i>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: "right", marginBottom: "15px" }}>
              <Link href="/Forgetpass"
                style={{
                  fontSize: "13px",
                  color: "#FFD569",
                  textDecoration: "none",
                }}
                onClick={closeModal}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  color: "#FFD569",
                  fontSize: "13px",
                  marginBottom: "10px",
                }}
              >
                {error}
              </div>
            )}

            <div className="modal-footer">
              <button
                className="launch-btn"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Register Link */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                Don't have an account?{" "}
                <Link href="/register"
                  style={{
                    color: "#FFD569",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                  onClick={closeModal}
                >
                  Register
                </Link>
              </div>
            </div>
            {/* <div className="modal-subtitle">{t("benefitsTitle")}</div>

            <ul className="benefits-list">
              <li><i className="bi bi-check-circle-fill check-icon"></i>{t("benefit1")}</li>
              <li><i className="bi bi-check-circle-fill check-icon"></i>{t("benefit2")}</li>
              <li><i className="bi bi-check-circle-fill check-icon"></i>{t("benefit3")}</li>
              <li><i className="bi bi-check-circle-fill check-icon"></i>{t("benefit4")}</li>
              <li><i className="bi bi-check-circle-fill check-icon"></i>{t("benefit5")}</li>
              <hr />
            </ul>

            <div className="coming-soon">{t("comingSoon")}</div>
            <input type="email" className="email-input" placeholder={t("emailPlaceholder")} />

            <div className="modal-footer">
              <button className="launch-btn">{t("notifyBtn")}</button>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
