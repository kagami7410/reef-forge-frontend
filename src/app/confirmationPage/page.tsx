'use client'
import React, { useEffect, useState } from 'react'
import { useBasket } from '../components/BasketContext/BasketContext';
import Cookies from 'js-cookie';
import Loading from '../components/Loading/Loading';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Suspense } from 'react';



function ConfirmationPageDetails() {
  const searchParams = useSearchParams();
  const orderBasketItems: OrderBasketItem[] = [];
  const { basket } = useBasket();
  const [loading, setLoading] = useState(false)
  const orderId = searchParams.get('orderId'); // ✅ Correct way
const [hasMounted, setHasMounted] = useState(false);


  interface OrderBasketItem {
    itemId: number,
    itemQuantity: number
  }





  useEffect(() => {

  setHasMounted(true);
    // console.log(Cookies.get(userEmail))
    handleSubmitPost()

  }, [])

  const getOrderedItems = () => {
    basket.forEach((eachItem) => {
      orderBasketItems.push({ itemId: eachItem.id, itemQuantity: eachItem.quantity })
    })
    return orderBasketItems;
  }




  const getUserDetails = () => {
    const storedEmail = Cookies.get('user_email');
    const storedAddress = Cookies.get('user_address');
    if (storedAddress) {
      const parsedAddress = JSON.parse(storedAddress);
      console.log('Retrieved address:', parsedAddress);
      const userDetails = {
        fullName: parsedAddress.name,
        email: storedEmail,
        password: "",
        address: {
          line1: parsedAddress.address.line1 ?? "",
          line2: parsedAddress.address.line2 ?? "",
          city: parsedAddress.address.city ?? "",
          country: parsedAddress.address.country ?? "",
          postCode: parsedAddress.address.postal_code ?? ""
        },
        role: "ADMIN"

      }

      return userDetails;
    }

  }

  const getSubmitOrderBody = () => {
    console.log("preparing body for postOrder")
    return {
      registerRequest: getUserDetails(),
      orderedItems: getOrderedItems(),
      orderId: orderId
    }
  }


  const handleSubmitPost = async () => {
    //checks if the order is submitted to backend

    console.log('trying to submit order!')
    event?.preventDefault()
    if (basket.length > 0) {
      setLoading(true)
      const response = await fetch("/api/postOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getSubmitOrderBody()),
      });
      console.log('status: ', response.status)
      setLoading(false)

      if (response.status === 202) {
        localStorage.setItem('basket', JSON.stringify([]))
        Cookies.remove('user_email');
        window.location.reload()

        // setShowModal(!showModal)
      }
      else {
        console.error('Order submission failed');
      }
    }
  }





  // useEffect(() => {
  //   handleSubmitPost()

  // },[])
  return (
<>
      {!hasMounted || loading? <Loading /> :
        <div className='flex flex-col align-middle justify-center items-center mt-20 '>
          <h1 className='text-xl '>Thank you for your Order!</h1>
          <h1 className='text-xl '>Your Order number is {orderId}</h1>

          <h1 className='text-md '>confirmation has been sent to your email.</h1>

          <Link className='w-2/5 mr-3 items-center flex justify-center' href={`/`}>

            <h1 className='btn  bg-slate-900 text-cyan-50 hover:bg-slate-700 w-48  text-md mb-4 mt-6'>Continue Shopping</h1>
          </Link>
          {/* <div onClick={handleSubmitPost} className='btn  bg-slate-900 text-cyan-50 hover:bg-slate-700 w-48  text-md mb-4 mt-6'>TEST</div>  */}
        </div>}

</>
          



  )
}
// Wrap in Suspense
export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading order info...</div>}>
      <ConfirmationPageDetails />
    </Suspense>
  );
}
