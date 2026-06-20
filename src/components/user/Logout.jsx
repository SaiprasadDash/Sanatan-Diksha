'use client';

import React, {  useContext,useEffect }  from 'react';
import { AuthContext } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';



const Logout = () => {

    
  const { logout } = useContext(AuthContext); 
  const router = useRouter();


  useEffect(() => {getlogout();},[]);
 
 

  const getlogout = () => {
    //e.preventDefault();
    localStorage.removeItem("token"); 
    localStorage.removeItem("user_typ");  
    
    
    
    localStorage.removeItem("u_email");  
    localStorage.removeItem("u_name");  
     
    logout();
    router.push('/');

     
}; 





  return (
    < > 

Logout . Logout ....
      
    </>
  );
};

export default Logout;