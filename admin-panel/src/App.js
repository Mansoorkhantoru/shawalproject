// import React from 'react'
// import {Route , Routes , BrowserRouter} from "react-router-dom"
// import AddProduct from "./component/addproducts"
// import Allproducts from './component/allproducts'
// import AllOrders from "./component/Order"
// import AdminLogin from "./component/Login"
// export default function App() {
//   return (
//     <div>
//       <BrowserRouter>
//       <Routes>
//         <Route path="/addproduct" element={<AddProduct/>}  />
//         <Route path='/allproducts' element={<Allproducts/>}/>
//         <Route path='/allorders' element={<AllOrders/>}   />
//         <Route path="/" element={
//   localStorage.getItem("admin") ? <AllOrders /> : <AdminLogin />
// } />
//       </Routes>
//       </BrowserRouter>
//     </div>
//   )
// }



import React from 'react'
import { Route, Routes, BrowserRouter } from "react-router-dom"

import AddProduct from "./component/addproducts"
import Allproducts from './component/allproducts'
import AllOrders from "./component/Order"
import AdminLogin from "./component/Login"
import ProtectedRoute from "./component/protectedRoute"

export default function App() {

  return (
    <div>

      <BrowserRouter>

        <Routes>

          <Route path="/" element={<AdminLogin />} />

          <Route
            path="/addproduct"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/allproducts"
            element={
              <ProtectedRoute>
                <Allproducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/allorders"
            element={
              <ProtectedRoute>
                <AllOrders />
              </ProtectedRoute>
            }
          />

        </Routes>

      </BrowserRouter>

    </div>
  )
}