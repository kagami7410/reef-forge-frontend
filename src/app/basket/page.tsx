'use client'
import React, { useEffect, useState } from 'react'
import { useBasket } from '@/src/app/components/BasketContext/BasketContext';
import { useRouter } from 'next/navigation'
import Loading from '../components/Loading/Loading';
import Link from 'next/link';
import BasketComponent from '../components/BasketComponent/BasketComponent';


const Basket = () => {



  return (
    <>
    <div className='flex align-middle justify-center bg-slate-100 '>
      <div className='md:w-3/4 w-full'>
      <BasketComponent allowEditQuantity={true}/>


      </div>
    </div>

    </>


  )
}

export default Basket
