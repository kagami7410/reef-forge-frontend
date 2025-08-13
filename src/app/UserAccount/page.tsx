'use client'
import React, { useEffect } from 'react'

const page = () => {

    const fetchUserOrder = async () => {
        const res = await fetch(`/api/getUserOrders`,
          {
          credentials: "include", // ensures browser sends cookies
          }
        )
    }

    useEffect(() => {
        fetchUserOrder()

    },[])
  return (
    <div className='flex mt-20'>
        <h1>Welcome {}</h1>
      
    </div>
  )
}

export default page
