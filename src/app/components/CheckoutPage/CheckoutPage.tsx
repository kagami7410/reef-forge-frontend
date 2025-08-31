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
import { verifyQuantity } from '@/lib/checkStockQuantity';
import Link from 'next/link';
import { useRouter } from 'next/navigation'


interface BasketItem {
    id: number;
    title: string;
    price: number;
    code: string;
    quantity: number;
    photoUrls: string[];

}



const CheckoutPage = ({ userEmail, amount }: { userEmail: string, amount: number }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [errorMessage, setErrorMessage] = useState<string>()
    const [clientSecret, setClientSecret] = useState("")
    const { getBasketTotal } = useBasket();
    const [paymentSuccessful, setPaymentSuccessful] = useState<boolean>(true)
    const [unavailableItems, setUnavailableItems] = useState<BasketItem[]>([])
    const [showUnvailableItemsModal, setShowUnavailableItemsModal] = useState(false)
    const image_url = `${process.env.NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS}/All`;

    const { basket } = useBasket();
    const [loading, setLoading] = useState(false)
    const [orderId, setOrderId] = useState("")
    const [updatedOrderId, setUpdatedOrderId] = useState(false)
    const router = useRouter() // may be null or a NextRouter instance


    function generateOrderNumber(): string {
        const timestamp = Date.now(); // ensures uniqueness
        const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        return `ORD-${timestamp}-${random}`;
    }

    useEffect(() => {
        if (!updatedOrderId) {
            setOrderId(generateOrderNumber())
            setUpdatedOrderId(true)
        }
    }, [])



    useEffect(() => {
        if (!updatedOrderId) {

        }
        console.log("creating order id for order: ", orderId)
        fetch('/api/create-payment-intent', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount), basketItems: basket, orderId: orderId }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))


    }, [basket, amount])

    // const getOrderedItems = () => {
    //     basket.forEach((eachItem) => {
    //         orderBasketItems.push({ itemId: eachItem.id, itemQuantity: eachItem.quantity })
    //     })
    //     return orderBasketItems;
    // }





    const verifyStockQuantityOfBasketItems = async () => {
        let unavailableCount = 0;
        for (const item of basket) {
            const status = await verifyQuantity(item.id, item.quantity)
            if (status != 200) {
                setLoading(false)
                setUnavailableItems(prev => [item, ...prev])
                unavailableCount++;
            }
            else {
                // console.log(item.title + " is available")
                setLoading(false)
            }
        }

        return unavailableCount;
    }


    // const handleSubmitPost = async () => {
    //     //checks if the order is submitted to backend
    //     let orderSumbitted = false
    //     console.log('trying to validate stock availablity!')

    //     const unavailableItemsCount = await verifyStockQuantityOfBasketItems()
    //     if (unavailableItemsCount === 0) {
    //         console.log('trying to submit order!')
    //         event?.preventDefault()
    //         if (basket.length > 0) {
    //             setLoading(true)
    //             const response = await fetch("/api/postOrder", {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(getSubmitOrderBody()),
    //             });
    //             console.log('status: ', response.status)
    //             setLoading(false)

    //             if (response.status === 202) {
    //                 localStorage.setItem('basket', JSON.stringify([]))
    //                 Cookies.remove('user_email');
    //                 orderSumbitted = true
    //                 // setShowModal(!showModal)
    //             }
    //             else {
    //                 console.error('Order submission failed');
    //             }
    //         }
    //     }
    //     else {
    //         console.log("trying to show unavailable items")
    //         setShowUnavailableItemsModal(!showUnvailableItemsModal)
    //     }
    //     return orderSumbitted;

    // };


    const returnAvailableItems = unavailableItems.map(
        (eachItem) => {
            return <div key={eachItem.id}><h3 className="font-bold text-lg mt-4">{eachItem?.title}</h3>
                <div key={eachItem?.id} className='flex flex-col w-1/2  rounded-md md:p-2 md:p-2   mt-1  lg:w-1/3'>

                    <Link href={`/shopFragRacks/${eachItem?.id}`}>
                        <img src={`${image_url}/${eachItem?.photoUrls[0]}`} className='border rounded-md cursor-pointer' ></img>

                    </Link>
                </div>


            </div>
        }
    )



    const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault()
        setLoading(true);

        if (userEmail.length === 0) {
            alert('Email is required')
            setLoading(false)

            return;
        }



        if (!stripe || !elements) {
            console.log('waiting to load stripe and elements!')
            return;
        }



        const { error: submitError } = await elements.submit();

        const addressElement = elements.getElement('address');
        const result = await addressElement?.getValue(); // Extracts the address details

        if (result?.complete) {
            // Contains name, address, phone, etc.
            Cookies.set('user_address', JSON.stringify(result.value), {
                expires: 3,
                sameSite: 'lax'
            })

            Cookies.set('user_email', (userEmail), {
                expires: 3,

                // setAddressDetails(result.value);
            })
        } else {
            console.log('Address is incomplete');
        }




        if (submitError) {
            setErrorMessage(submitError.message)
            setLoading(false)
            return;
        }
        console.log("trying to confirm payment......")

        const unavailableItemsCount = await verifyStockQuantityOfBasketItems()
        if (unavailableItemsCount === 0) {
            const { error } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: `https://reef-forge.uk/confirmationPage?orderId=${orderId}`,

                },
            })

            if (error) {
                console.log('There was an error in making payment!')
                setPaymentSuccessful(false)
                setErrorMessage(error.message)
            } else {
                setPaymentSuccessful(true)
                console.log('payment was successful!')

                // router.push('/')


                // user is returmed to return url
            }
        }


        setLoading(false)




    }

    if (!clientSecret || !stripe || !elements) {
        return <Loading />
    }



    return (
        <div className='flex flex-col'>
            <div className='flex align-middle justify-center text-xl m-4'>
                <h1 >Payment</h1>

            </div>
            <form onSubmit={handlePayment}>
                {clientSecret && < PaymentElement />}
                {errorMessage && <div>{errorMessage}</div>}
                <button disabled={!stripe || loading} className='btn bg-slate-900 text-cyan-50 hover:bg-slate-700 w-48 mt-4 text-xl w-full'>{!loading ? `Pay £${amount}` : `Processing... `}</button>


            </form>

            {showUnvailableItemsModal ? <div className="z-30 flex-col items-center h-96 flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
                <h3 className="font-bold text- md:text-lg">❌ Some Items in your basket has limited available</h3>{returnAvailableItems}
                <div className="modal-action">

                </div>                                     <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button onClick={() => {

                        setShowUnavailableItemsModal(!showUnvailableItemsModal)
                        setUnavailableItems([])
                        console.log("unavailable items modal" + showUnvailableItemsModal)
                    }}
                        className="btn ml-72">Close</button>
                </form></div> : <></>}
            {/* {returnAvailableItems } */}



            {paymentSuccessful ? <></> : <div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
                <h3 className="font-bold text- md:text-lg">❌ Something went wrong with the payment!</h3>

                \


                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button onClick={() => {
                            router.push('/userDetailsCheckout')

                        }}
                            className="btn">Close</button>
                    </form>
                </div>
            </div>}


        </div>

    )
}

export default CheckoutPage
