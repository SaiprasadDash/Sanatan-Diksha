'use client';

import React, { useState, useContext } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { AuthContext } from '../AuthProvider.jsx'
import Apiconnect from '@/services/Apiconnect.js"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const indata = {
      email: email,
      password: password
    };

    try {
      const response = await Apiconnect.postDataNoauth("customer/login", indata);
      console.log(response)
      const res = response.data;

      if (res.status === 1) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("u_email", res.customer?.email || "");
        localStorage.setItem("u_name", res.customer?.fname || "");
        localStorage.setItem("userId", res.customer?.id || "");

        // FIX: Set role manually (because API has no role field)
        const userRole = "Customer";
        localStorage.setItem("user_typ", userRole);

        login(1, userRole);

        toast.success("Login successful!");

        router.push("/customer/dashboard");
      }
      else {
        toast.error(res.message || "Invalid credentials");
      }

    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error?.response?.data?.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
        <div className="login-aside text-center d-flex flex-column flex-row-auto"
          style={{
            backgroundImage: `
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='%23FFFFFF0F'/%3E%3C/svg%3E"),
    linear-gradient(80deg, #7b0c43ff, #ff8c00)
  `,
            backgroundSize: "40px 40px, cover",
            backgroundRepeat: "repeat, no-repeat"
          }}
        >
          <div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
            <div className="text-center mb-lg-4 mb-2 pt-5 logo">
              <div className="d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  fontSize: '56px',
                  color: 'white'
                }}>
                ॐ
              </div>
            </div>
            <h3 className="mb-2 text-white" style={{ fontWeight: '700', fontSize: '28px' }}>Welcome to Sanatan Deeksha!</h3>
            <p className="mb-4 text-white" style={{ fontSize: '16px', opacity: '0.9' }}>
              Continue Your Spiritual Journey <br />Discover Inner Peace & Divine Wisdom
            </p>
          </div>

        </div>
        <div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
          <div className="d-flex justify-content-center h-100 align-items-center">
            <div className="authincation-content style-2">
              <div className="row no-gutters">
                <div className="col-xl-12 tab-content">
                  <div id="sign-up" className="auth-form tab-pane fade show active form-validation">
                    <form onSubmit={handleLogin}>
                      <div className="text-center mb-4">
                        <h3 className="text-center mb-2" style={{ color: '#7b0c43ff', fontWeight: '700', fontSize: '32px' }}>
                        User Sign In
                        </h3>
                        <p style={{ color: '#7b0c43ff', fontSize: '14px' }}>Enter your credentials to access your spiritual dashboard</p>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label mb-2 fs-13 font-w500"
                          style={{ color: '#7b0c43ff', fontWeight: '600' }}>
                          Email address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="exampleFormControlInput1"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter Your Email"
                          required
                          style={{
                            padding: '12px 16px',
                            border: '1px solid #E0E0E0',
                            borderRadius: '12px',
                            fontSize: '15px'
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="exampleFormControlInput2" className="form-label mb-2 fs-13 font-w500"
                          style={{ color: '#7b0c43ff', fontWeight: '600' }}>
                          Password
                        </label>
                        <div className="input-group" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                          <input
                            type={passwordVisible ? 'text' : 'password'}
                            className="form-control"
                            id="exampleFormControlInput2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Your Password"
                            required
                            minLength="8"
                            style={{
                              padding: '12px 16px',
                              border: '1px solid #E0E0E0',
                              borderTopLeftRadius: '12px',
                              borderBottomLeftRadius: '12px',
                              fontSize: '15px'
                            }}
                          />
                          <button
                            type="button"
                            className="btn"
                            onClick={togglePasswordVisibility}
                            style={{
                              border: '1px solid #E0E0E0',
                              borderLeft: 'none',
                              background: 'white',
                              borderTopRightRadius: '12px',
                              borderBottomRightRadius: '12px'
                            }}
                          >
                            {passwordVisible ? (
                              <i className="fa fa-eye-slash" style={{ color: '#999' }}></i>
                            ) : (
                              <i className="fa fa-eye" style={{ color: '#999' }}></i>
                            )}
                          </button>
                        </div>
                      </div>
                      <Link href="/Forgetpass" className="float-end mb-4"
                        style={{ color: '#7b0c43ff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                        Forgot Password ?
                      </Link>
                      <button
                        type="submit"
                        className="btn btn-block"
                        disabled={isLoading}
                        style={{
                          background: 'linear-gradient(80deg, #7b0c43ff, #ff8c00)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '14px',
                          fontSize: '16px',
                          fontWeight: '600',
                          width: '100%',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        {isLoading ? "Please wait..." : " Sign In "}
                      </button>
                    </form>
                    <div className="new-account mt-3 text-center">
                      <p className="font-w500" style={{ color: '#666' }}>
                        Don't have an account? <Link href="/register" style={{ color: '#7b0c43ff', textDecoration: 'none', fontWeight: '600' }}>Sign up</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default Login