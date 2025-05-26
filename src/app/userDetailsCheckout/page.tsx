'use client'
import React, { useState } from 'react'
import { useBasket } from '../components/BasketContext/BasketContext';
import BasketComponent from '../components/BasketComponent/BasketComponent';
import {loadStripe} from "@stripe/stripe-js";
import {AddressElement, Elements} from "@stripe/react-stripe-js"
import CheckoutPage from '../components/CheckoutPage/CheckoutPage';
import convertToSubcurrency from '@/lib/convertToSubcurrency';
import { StripeAddressElementOptions } from '@stripe/stripe-js';



const Page = () => {



  const {getBasketTotal } = useBasket();
  const [userEmail, setUserEmail] = useState("");

  if(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined){
  // const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "default_key_for_dev";

  // throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")

  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "default_key_for_dev";
  console.warn("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
}




const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)


  const getFinalTotal = () => {
    return getBasketTotal() + 2.95;
  }




  const addressOptions:StripeAddressElementOptions  = {
    mode: 'shipping',
    allowedCountries: ['UK'],
    fields: { phone: 'always'
     },
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   // Update the specific field
  //   setUserDetails((prevUser) => ({
  //     ...prevUser, // Keep the existing fields intact
  //     [name]: value, // Update the specific field
  //   }));
  // };



  return (
    <div className=' flex items-center align-middle justify-center mt-6'>
      <div className=' w-5/6 flex md:flex-row flex-col  align-middle justify-center'>

      {/* <div className={showModal ? 'bg-slate-700 flex-col flex border items-center blur-sm' : 'flex-col flex border rounded-lg items-center md:w-3/6'}>
        <h1 className='text-2xl m-4'>Personal Details</h1>

        <form className='flex flex-col w-5/6  items-center md:w-3/4 align-middle justify-center flex flex-col p-4 rounded-t-2xl bg-slate-100 md:items-start' >
            <label className="form-control w-full max-w-xs mr-0 md:mr-2">
              <div className="label">
                <span className="label-text"> First Name*  </span>
              </div>
              <input name="firstName" value={userDetails.firstName} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={handleChange} />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text"> Last Name*  </span>
              </div>
              <input name="lastName" value={userDetails.lastName} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={handleChange} />
            </label>


          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text"> Email*  </span>
            </div>
            <input name="email" value={userDetails.email} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={handleChange} />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text"> Confirm Email*  </span>
            </div>
            <input name="email" value={userDetails.email} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={handleChange} />
          </label>
          <h1 className='text-2xl m-4'>Delivery Details</h1>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text"> Address*  </span>
            </div>
            <input name="address" value={userDetails.address} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={handleChange} />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text"> ZIP/Post code*  </span>
            </div>
            <input name="postCode" value={userDetails.postCode} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={handleChange} />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text"> Town*  </span>
            </div>
            <input name="town" value={userDetails.town} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={handleChange} />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text"> Phone Number*  </span>
            </div>
            <input name="phoneNumber" value={userDetails.phoneNumber} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" onChange={handleChange} />
          </label>
        </form>
        <div className='flex w-full justify-center mt-2 md:mt-4'>
          <button onClick={handleSubmit} className=' btn bg-slate-900 text-cyan-50 hover:bg-slate-700 w-48  m-2 text-xl'> Checkout </button>
        </div>
      </div> */}


      <div className='flex flex-col md:w-2/5 m-1 pb-8 border p-4 rounded-md justify-center shadow-lg'>


        <Elements stripe={stripePromise}
                options={{
                  mode: "payment",
                  amount: convertToSubcurrency(getFinalTotal()),
                  currency: "gbp",
                }}>
      <div className='w-full'>
        <h2 className=' text-slate-500 my-4 text-lg'>Ship to</h2>
        <AddressElement options={addressOptions}/>

              <h1 className='text-md font-sans text-slate-600 mt-3'>Email Address</h1>

  <input
        type="email"
        required
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        className="border p-2 mb-4 w-full"
      />      </div>

      <div className='w-full'>
      <CheckoutPage userEmail={userEmail} amount={getFinalTotal()}/>

      </div>


      </Elements>




        </div>

      <div className='md:w-2/5 flex flex-col md:mt-4 mt-16 items-center md:align-middle md:items-center md:ml-10'>
      <h1 className='m-4 md:m-3 text-lg font-bold'>Order Summary</h1>
        <BasketComponent allowEditQuantity={false}/>
      </div>
      <div>

      </div>
      <div>
      </div>
      


      </div>

    </div>




  )
}

export default Page
