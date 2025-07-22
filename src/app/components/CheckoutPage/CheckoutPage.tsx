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


interface BasketItem {
    id: number;
    title: string;
    price: number;
    code: string;
    quantity: number;
    photoUrls: string[];

}


interface OrderBasketItem {
    itemId: number,
    itemQuantity: number
}
const CheckoutPage = ({ userEmail, amount }: { userEmail: string, amount: number }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [errorMessage, setErrorMessage] = useState<string>()
    const [clientSecret, setClientSecret] = useState("")
    const { getBasketTotal } = useBasket();

    const [unavailableItems, setUnavailableItems] = useState<BasketItem[]>([])
    const [showUnvailableItemsModal, setShowUnavailableItemsModal] = useState(false)
    const image_url = `${process.env.NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS}/All`;

    const orderBasketItems: OrderBasketItem[] = [];
    const { basket } = useBasket();
    const [loading, setLoading] = useState(false)
    // const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        fetch('/api/create-payment-intent', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))


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
        return {
            registerRequest: getUserDetails(),
            orderedItems: getOrderedItems()
        }
    }

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
                console.log(item.title + " is available")
                setLoading(false)
            }
        }

        return unavailableCount;
    }


    const handleSubmitPost = async () => {
        //checks if the order is submitted to backend
        let orderSumbitted = false
        console.log('trying to validate stock availablity!')

        const unavailableItemsCount = await verifyStockQuantityOfBasketItems()
        if (unavailableItemsCount === 0) {
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
                    orderSumbitted = true
                    window.location.reload();
                    // setShowModal(!showModal)
                }
                else {
                    console.log(response.body)
                }
            }
        }
        else {
            console.log("trying to show unavailable items")
            setShowUnavailableItemsModal(!showUnvailableItemsModal)
        }
        return orderSumbitted;

    };
    console.log('unavailable Items: ', unavailableItems)


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




    const getFinalTotal = () => {
        if(getBasketTotal()!= 0){
        return ((getBasketTotal() ).toFixed(2));

        }
        else
                return 0;

    }
    const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault()
        setLoading(true);

        if (userEmail.length === 0) {
            alert('Email is required');
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
            console.log('Address:', result.value); // Contains name, address, phone, etc.
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
        const orderSumbitted = await handleSubmitPost()

        if (orderSumbitted) {

            const { error } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: `http://www.localhost:3000/confirmationPage`,
                },
            })




            if (error) {
                console.log('There was an error in making payment!')
                setErrorMessage(error.message)
            } else {
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
                <button className='btn bg-slate-900 text-cyan-50 hover:bg-slate-700 w-48 mt-4 text-xl w-full'>{!loading ? `Pay £${getFinalTotal()}` : `Processing... `}</button>


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


        </div>

    )
}

export default CheckoutPage
