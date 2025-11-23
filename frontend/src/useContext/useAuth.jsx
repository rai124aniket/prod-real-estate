import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext=createContext();

export const AuthProvider=({ children })=>{
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const checkAuth=async ()=>{
            try {
                const res=await axios.get("http://localhost:3000/auth/check",{
                    withCredentials:true
                })
                if(res.data.loggedIn){
                    setUser(res.data.user)
                }
                else{
                    setUser(null);
                }
                setLoading(false)
            } catch (e) {
                setUser(null);
                console.log(e);
            }
        }
        checkAuth();
    },[])


    const login=async (email,password)=>{
        const response=await axios.post("http://localhost:3000/auth/login",
            {email,password},
            {withCredentials:true}
        )
        const res = await axios.get("http://localhost:3000/auth/check", {
            withCredentials: true,
          });
        if (res.data.loggedIn) setUser(res.data.user);
        return response.data
    }

    const signup = async (name, email, password) => {
        const res=await axios.post(
          "http://localhost:3000/auth/register",
          { name, email, password },
          
        );
        return res.data;
        

    };
    return(
        <AuthContext.Provider value={{ login , signup ,user ,loading} }>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth=()=>useContext(AuthContext)
