import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "./allproduct.css"
import Sidebar from './sidebar'
export default function Allproducts() {
    const [allProducts , setAllProducts] = useState([])
    const [search , setSearch] = useState("")
    const [deleteProduct , setToDeleteProduct] =useState(null)
    const fetchData = async()=>{
        try{
            const res = await axios.get("http://localhost:3000/allproduct") 
            setAllProducts(res.data.products)
            console.log(res.data)
        }catch(error){
            
        }
    }
    useEffect(()=>{
        fetchData()
    },[])
    const deleProdcut = async(productId)=>{
      try{
        const response = await axios.delete(`http://localhost:3000/allproduct/${productId}`)
        if(response.data.success){
          setAllProducts(allProducts.filter(product => product._id !== productId))
        }else{
          alert("Failed to Delete Product" + response.data.message)
        }
      }
      catch(error){

      }
    }
 
  return (
    <div className='allproducts'>
      <Sidebar className='sideBar'/>
    <br />
    <br />
   <div className="products">
     <input type="text" placeholder='Search Medecine'
      name="" id="" value={search} 
       onChange={(e)=>setSearch(e.target.value)} />
     <div className="products">
       {allProducts.length === 0 ?(
        <p>Add your 1st product</p>
      ):( allProducts
        .filter((product)=>
          product.name
        .toLowerCase()
        .includes(search.toLowerCase())
        )
        .map((product,index)=>(
                    <div key={index} className='product'>
                        {product.imageUrl && (
                        <img src={product.imageUrl} alt="" onError={(e)=>{
                          e.target.src='https://via.placeholder.com/200?text=Image+Not+Found';
                          e.target.onerror= null
                        }}
                        
                        />

                        )}
                       <div className="text">
                        <h3>{product.name}</h3>
                        <p>Price:{product.discountPrice} <span>{product.price}</span></p>
                        <p></p>
                        <button onClick={()=>deleProdcut(product._id)}>Delete</button>
                       </div>
                    </div>
                ))
      )}
     </div>
    
   </div>
   </div>
  )
}
