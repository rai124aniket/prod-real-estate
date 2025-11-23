import React from 'react'
import { useAuth } from '../useContext/useAuth'
import { Navigate } from 'react-router-dom'


const ProtectedRoute = ({children}) => {
    const {user}=useAuth()
    // if(loading){
    //     return<div>loading...</div>
    // }

  if(!user){
    return <Navigate to="/auth/signin" replace />
  }
  return children
}

export default ProtectedRoute
