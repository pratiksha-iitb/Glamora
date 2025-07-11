import React from 'react'
import axios from 'axios'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Products/GenderCollectionSection'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetails from '../components/Products/Productdetails'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeatureSection from '../components/Products/FeatureSection'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'
import { fetchProductsByFilters } from '../redux/slices/productSlice'


const Home = () => {
  const dispatch=useDispatch();
  const{products,loading,error}=useSelector((state)=>state.product);
  const[bestSellerProduct,setBestSellerProduct]=useState(null);

  useEffect(()=>{
    dispatch(fetchProductsByFilters({
        gender:"women",
    category:"Bottom Wear",
    limit:8,
    }));
    const fetchBestSeller=async()=>{
      try {
        const response=await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
                    );
                    console.log('Best Seller Response:', response.data);
                    setBestSellerProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBestSeller();

  },[dispatch]);
  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      <h2 className="text-3xl text-center font-bold mb-[-30px]">Best Seller</h2>
      {bestSellerProduct? (<ProductDetails productId={bestSellerProduct._id}/>):(
      <p className='text-center'>Loading best seller product</p>)}
      <div className="container mx-auto">
        <h2 className="text=3xl text-center font-bold mb-4">
          Top Wears For Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error}/>
      </div>
      <FeaturedCollection/>
      <FeatureSection/>
    </div>
  )
}

export default Home