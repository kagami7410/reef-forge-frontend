'use client'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import {
    useStripe,
    useElements,
    PaymentElement,
} from '@stripe/react-stripe-js'

import convertToSubcurrency from '@/lib/convertToSubcurrency'
import Loading from '../Loading/Loading'
import { useBasket } from '../BasketContext/BasketContext'



const CheckoutPage = ( {userEmail, amount}:{userEmail: string, amount:number}) => {
    const stripe = useStripe()
    const elements = useElements()
    const [errorMessage, setErrorMessage] = useState<string>()
    const [clientSecret, setClientSecret] = useState("")
    const [loading, setLoading] = useState(false)
    const { getBasketTotal} = useBasket();


    useEffect(() => {
        fetch('/api/create-payment-intent', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({amount: convertToSubcurrency(amount)}),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))


    }, [amount])




    const getFinalTotal = () => {
        return Number(( getBasketTotal() + 2.90).toFixed(2));
      }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault()
        setLoading(true);

        if(userEmail.length===0){
                  alert('Email is required');
                  return;

        }
        if(!stripe || !elements){
            console.log('waiting to load stripe and elements!')
            return;
        }



        const { error: submitError } = await elements.submit(); 

        const addressElement = elements.getElement('address');
        const result = await addressElement?.getValue(); // Extracts the address details

        if (result?.complete) {
            console.log('Address:', result.value); // Contains name, address, phone, etc.
            Cookies.set('user_address', JSON.stringify(result.value),{
                expires: 3,
                sameSite: 'lax'
            })

            Cookies.set('user_email', (userEmail),{
                expires: 3,
            
            // setAddressDetails(result.value);
          })} else {
            console.log('Address is incomplete');
          }




        if(submitError){
            setErrorMessage(submitError.message)
            setLoading(false)
            return;
        }
        console.log("trying to confirm payment......")
        // handleSubmitPost()


        const {error} = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `http://www.localhost:3000/confirmationPage`,
            },
        })




        if(error){
            console.log('There was an error in making payment!')
            setErrorMessage(error.message)
        } else {
            console.log('payment was successful!')
            // router.push('/')


            // user is returmed to return url
        }

        setLoading(false)




    }

    if(!clientSecret || !stripe || !elements){
        return <Loading/>
    }


  return (
    <div className='flex flex-col'>
        <div className='flex align-middle justify-center text-xl m-4'> 
        <h1 >Payment</h1>

        </div>
    <form onSubmit={handleSubmit}>
        {clientSecret && < PaymentElement/>}
        {errorMessage && <div>{errorMessage}</div>}
        {/* {clientSecret?<PaymentElement/>:<></>} */}
        <button className='btn bg-slate-900 text-cyan-50 hover:bg-slate-700 w-48 mt-4 text-xl w-full'>{!loading ? `Pay £${getFinalTotal()}`: `Processing... `}</button>
       

    </form>
    </div>

  )
}

export default CheckoutPage
