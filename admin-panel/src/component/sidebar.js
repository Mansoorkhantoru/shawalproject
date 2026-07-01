import React, { useState } from 'react'
import "./Sidebar.css"

export default function Sidebar() {
  const logout = () => {
    localStorage.removeItem("admin")
    window.location.href = "/"
  }
  
  const [sideBar, setSideBar] = useState(false)
  
  const sideBars = () => {
    setSideBar(true)
  }
  
  const removeSide = () => {
    setSideBar(false)
  }
  
  return (
    <div className='sidebar'>
      <div className="sid">
        {!sideBar ? (
          <button onClick={sideBars} className='sidebtn'>
            -<br />-<br />-
          </button>
        ) : (
          <button onClick={removeSide} className='sidebtn'>X</button>
        )}
        
        {sideBar && (
          <div className="sideToggle open">
            <a href="/allorders">📦 Orders</a>
            <a href="/allproducts">🛍️ All Products</a>
            <a href="/addproduct">➕ Add Products</a>
            
            <div className="log">
              <button onClick={() => logout()}>🚪 Logout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}