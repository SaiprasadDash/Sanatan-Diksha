"use client";
import { createContext, useContext, useEffect, useState } from "react";

const VisitorContext = createContext(null);

export const VisitorProvider = ({ children }) => {
  const [visitorId, setVisitorId] = useState(null);

  useEffect(() => {
    let storedVisitorId = localStorage.getItem("visitor_id");
    // console.log(storedVisitorId)
    if (!storedVisitorId) {
      const today = new Date();
      const ymd = `${today.getFullYear()}${String(
        today.getMonth() + 1
      ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

      const random = Math.random().toString(36).substring(2, 8);
      storedVisitorId = `SD-${ymd}-${random}`;

      localStorage.setItem("visitor_id", storedVisitorId);
    }

    setVisitorId(storedVisitorId);
  }, []);

  return (
    <VisitorContext.Provider value={{ visitorId }}>
      {children}
    </VisitorContext.Provider>
  );
};

export const useVisitor = () => {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error("useVisitor must be used inside VisitorProvider");
  }
  return context;
};
