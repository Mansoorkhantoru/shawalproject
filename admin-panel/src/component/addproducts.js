import React, { useState } from 'react'
import axios from "axios"
import "./addproduct.css"
import Sidebar from './sidebar'
export default function Addproducts() {
  const [productform , setproductForm] = useState({
    name:"",
    price:"",
    discountPrice:"" 
, description:"",
requiresPrescription:false
  })
  const [image , setImage] = useState(null)
  const handleChange = (e) => {
        const { name, type, checked, value } = e.target
        setproductForm({
            ...productform,
            [name]: type === 'checkbox' ? checked : value
        })
    }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    
    }
  }
  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!productform.name || !productform.price || !productform.discountPrice){
      alert("Please fill all requirement")
      return

    }
    if(!image){
      alert("Please add image")
      return
    }
     const formData = new FormData(); 
    formData.append('name', productform.name);
    formData.append('price', productform.price);
    formData.append('discountPrice', productform.discountPrice);
  formData.append('description', productform.description)
  formData.append(
  "requiresPrescription",
  productform.requiresPrescription
)
formData.append('image', image);
    try{
      const res = await axios.post("http://localhost:3000/addproduct",
        formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      )
      alert("Product added succefully")
    }catch(error){
      console.error(error.message)
    }
    

  }
  return (
    <div className='addproduct'>
      <div className="link-btn">
        <Sidebar />
      </div>
      <form action="" onSubmit={handleSubmit}>
        <h3>ADD PRODUCT</h3>
        <input type="file" name='image' onChange={handleImageChange} required />
        <input type="text" name='name' value={productform.name}  placeholder='Enter a name' onChange={handleChange}/>
        <input type="number" name='price' value={productform.price} placeholder='Enter Price' onChange={handleChange} />
        <input type="number" name='discountPrice' value={productform.discountPrice} placeholder='Enter Discounted price' onChange={handleChange} />
        <input type="text" name='description' value={productform.description} onChange={handleChange} placeholder='Describtion' style={{height:"60px"}}/>
        <h4>Prescription</h4>
        <input type="checkbox" name='requiresPrescription'  checked={productform.requiresPrescription} onChange={handleChange} />
        <button type='submit'>save</button>
      </form>
    </div>
  )
}
