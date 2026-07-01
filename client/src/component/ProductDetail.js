import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Nav from "./nav"
import './ProductDetail.css'
import Footer from './Footer'
export default function ProductDetail({addToCart , cart}) {

  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/allproduct/${id}`)
      setProduct(res.data.product)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchProduct()
  }, [id])

  if (!product) {
    return <h1>Loading...</h1>
  }

  return (
    <div className='products-detail'>
        <Nav cartt={cart}/>
      <div className="detail">
        <img src={product.imageUrl} alt="" width="300" />
      <div className="details">
        <h1>{product.name}</h1>
      <br />
     <div className="product-detail">
       <h2>Price: {product.price}</h2>
      <h3>Discount Price: {product.discountPrice}</h3>
      <button onClick={()=>addToCart(product)}>Add To Cart</button>
      <p>{product.description}</p>
     </div>
      </div>
      
      </div>
     
    </div>
  )
}