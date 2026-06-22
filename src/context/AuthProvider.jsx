'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import Apiconnect from "../services/Apiconnect";

const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userType, setUserType] = useState('');
//   const [isLoading, setIsLoading] = useState(true);


//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const storedUserType = localStorage.getItem('user_typ');

//     if (token) {
//       setIsAuthenticated(true);
//       setUserType(storedUserType || '');     
//     }
//   }, []);



//   const login = (userId, userType) => {
//     setIsAuthenticated(true);
//     setUserType(userType);
   
//   };

//   const logout = () => {
//     // Clear all localStorage items
//     localStorage.removeItem('token');
//     localStorage.removeItem('u_email');
//     localStorage.removeItem('u_name');
//     localStorage.removeItem('user_typ');

//     // Update state
//     setIsAuthenticated(false);
//     setUserType('');   
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const [userType, setUserType] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('user_typ');

    if (token) {
      setIsAuthenticated(true);
      setUserType(storedUserType || '');
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false); 
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
export { AuthContext, AuthProvider };
