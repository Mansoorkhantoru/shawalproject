import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {

  const isAdmin = localStorage.getItem("admin")

  if (!isAdmin) {
    return <Navigate to="/" />
  }

  return children
}