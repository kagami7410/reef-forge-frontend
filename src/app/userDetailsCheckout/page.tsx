'use client'
import React, { useState } from 'react'
import { useBasket } from '../components/BasketContext/BasketContext';
import BasketComponent from '../components/BasketComponent/BasketComponent';
import { loadStripe } from "@stripe/stripe-js";
import { AddressElement, Elements } from "@stripe/react-stripe-js"
import CheckoutPage from '../components/CheckoutPage/CheckoutPage';
import convertToSubcurrency from '@/lib/convertToSubcurrency';
import { StripeAddressElementOptions } from '@stripe/stripe-js';

let stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

const Page = () => {



  const { getBasketTotal } = useBasket();
  const [userEmail, setUserEmail] = useState("");

  if (stripePublicKey === undefined) {
    // const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "default_key_for_dev";
    // throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")

    stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "default_key_for_dev";
    console.log("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
  }




  const stripePromise = loadStripe(stripePublicKey)


  const getFinalTotal = () => {
    const rounded_number = getBasketTotal() + 2.95
    return rounded_number.toFixed(2) ;
  }




  const addressOptions: StripeAddressElementOptions = {
    mode: 'shipping',
    allowedCountries: ['UK'],
    fields: {
      phone: 'always'
    },
  };




  return (
    <div className='flex items-center align-middle justify-center mt-6'>
      <div className=' w-full flex md:flex-row flex-col  align-middle items-center justify-center'>



        <div className='flex flex-col md:w-3/5 w-11/12 bg-slate-50  m-1 pb-8 border p-4 rounded-md justify-center shadow-lg'>


          <Elements stripe={stripePromise}
            options={{
              mode: "payment",
              amount: convertToSubcurrency(getFinalTotal()),
              currency: "gbp",
            }}>
            <div className='w-full'>
              <h2 className=' text-slate-500 my-4 text-lg'>Ship to</h2>
              <AddressElement options={addressOptions} />

              <h1 className='text-md font-sans text-slate-600 mt-3'>Email Address</h1>

              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="border p-2 mb-4 w-full"
              />      
            </div>

            <div className='w-full'>
              <CheckoutPage userEmail={userEmail} amount={getFinalTotal()} />
            </div>

          </Elements>




        </div>
        <div className='md:w-2/5 flex flex-col md:mt-4 mt-16 items-center md:align-middle md:items-center md:ml-10'>
          <h1 className='m-4 md:m-3 text-lg font-bold'>Order Summary</h1>
          <BasketComponent allowEditQuantity={false} />
        </div>
        <div>
        </div>



      </div>

    </div>




  )
}

export default Page
