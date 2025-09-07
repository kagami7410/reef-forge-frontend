'use client'
import React, { useEffect, useState } from 'react'
import { useBasket } from '../components/BasketContext/BasketContext';
import BasketComponent from '../components/BasketComponent/BasketComponent';
import { loadStripe } from "@stripe/stripe-js";
import { AddressElement, Elements } from "@stripe/react-stripe-js"
import CheckoutPage from '../components/CheckoutPage/CheckoutPage';
import convertToSubcurrency from '@/lib/convertToSubcurrency';
import { StripeAddressElementOptions } from '@stripe/stripe-js';

let stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
const shippingPrice = process.env.NEXT_PUBLIC_SHIPPING_PRICE??2.95;

const Page = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { getBasketTotal } = useBasket();
  const [userEmail, setUserEmail] = useState("");

  const [somethingInBasket, setSomethingInBasket] = useState(false)
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [invalidCode, setInvalidCode] = useState(false)
    const [codeApplied, setCodeApplied] = useState(false)

  const validCodes: Record<string, number> = {
    SAVE10: 0.9,
  };
  useEffect(() => {

    if (getFinalTotal() > 0) {
      setSomethingInBasket(true)
    }
    setHasMounted(true);
  }, []);



  if (stripePublicKey === undefined) {
    // const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "default_key_for_dev";
    // throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")

    stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "default_key_for_dev";
    console.log("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
  }




  const stripePromise = loadStripe(stripePublicKey)

const getFinalTotal = (): number => {
  const basketTotal = getBasketTotal();
  console.log("discount: ", discount )

  if (discount > 0) {
    if (basketTotal !== 0) {
      if (basketTotal >= 50) {
        return parseFloat((basketTotal * discount).toFixed(2));
      } else {
        return parseFloat(((basketTotal * discount) + Number(shippingPrice)).toFixed(2));
      }
    } else {
      return 0; // ✅ handle basketTotal = 0 case
    }
  } else {
    if (basketTotal !== 0) {
      if (basketTotal >= 50) {
        return parseFloat(basketTotal.toFixed(2));
      } else {
        return parseFloat((basketTotal + Number(shippingPrice)).toFixed(2));
      }
    } else {
      return 0; // ✅ handle basketTotal = 0 case
    }
  }
};


  const applyCode = () => {
    if (discountCode in validCodes) {
      setCodeApplied(true)
      setDiscount(validCodes[discountCode]);
    } else {
      setInvalidCode(true)
      setDiscount(0);
    }
  };



  const addressOptions: StripeAddressElementOptions = {
    mode: 'shipping',
    allowedCountries: ['UK'],
    fields: {
      phone: 'always'
    },
  };





  return (

    <div className='flex items-center align-middle justify-center mt-6'>
      {getBasketTotal()? <div className=' w-full flex md:flex-row flex-col align-middle p-4 justify-center '>
        <div className='flex mt-8 md:mr-10  flex-col md:w-96 w-full bg-slate-50 h-full  m-1 pb-8 border p-4 rounded-md  shadow-lg'>
          {hasMounted && stripePromise && somethingInBasket && (

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
                  onChange={(e) => {
                    setUserEmail(e.target.value)
                  }}
                  className="border p-2 mb-4 w-full"
                />
              </div>
              <div className='w-full'>
                <CheckoutPage userEmail={userEmail} amount={getFinalTotal()} />
              </div>
            </Elements>
          )}
        </div>


        <div className='md:w-96 w-11/12 flex flex-col   md:ml-10'>
          <h1 className='m-4 md:m-3 text-lg font-bold'>Order Summary</h1>
          <div className='flex  justify-center items-center'>
            <div className='flex items-center justify-center align-middle mr-4'>
              <input
                type="string"
                placeholder="Discount Code?"

                required
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}

                className="border h-11  w-11/12 text-center rounded-md"
              />

            </div>

            <button onClick={applyCode} className='btn w-28'>Apply</button>

          </div>
          <BasketComponent discount={discount} allowEditQuantity={false} />
        </div>
        <div>
        </div>



      </div>:<div className='mt-20 text-3xl font-serif font-semibold'>Basket is empty</div>
        }

                {invalidCode ? <div className=" modal-box fixed top-1/3 left-1/2 -translate-x-1/2 w-80 m-auto bg-slate-200">
            <h3 className="font-bold text-lg text-center">Invalid Discount Code!</h3>

            <div className="modal-action items-center justify-items-center align-middle justify-center">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button onClick={() => {
                  setInvalidCode(false)
                }}
                  className="btn">Close</button>
              </form>
            </div>
          </div> : <></>}


          
                {codeApplied ? <div className=" modal-box fixed top-1/3 left-1/2 -translate-x-1/2 w-80 m-auto bg-slate-200">
            <h3 className="font-bold text-lg text-center">Discount Code Applied!</h3>

            <div className="modal-action items-center justify-items-center align-middle justify-center">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button onClick={() => {
                  setCodeApplied(false)
                }}
                  className="btn">Close</button>
              </form>
            </div>
          </div> : <></>}
  

    </div>




  )
}

export default Page
