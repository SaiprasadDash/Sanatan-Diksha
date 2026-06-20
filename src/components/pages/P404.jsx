import React from "react";
import Link from 'next/link';

const P404 = () => {
  return (
    <div
      style={{
        height: "100vh",
       
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          fontSize: "120px",
          fontWeight: "800",
          color: "#fff",
          marginBottom: "10px",
        }}
      >
        404
      </h1>

      <h3
        className="mb-2 text-white"
        style={{ fontWeight: "700", fontSize: "28px" }}
      >
        Page Not Found
      </h3>

      <p
        className="mb-4 text-white"
        style={{ fontSize: "16px", opacity: "0.8" }}
      >
        The page you are looking for doesn't exist.
      </p>

      <Link href="/"
        style={{
          padding: "10px 25px",
          background: "#ff6b00",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default P404;