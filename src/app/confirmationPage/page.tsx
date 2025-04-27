'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useBasket } from '../components/BasketContext/BasketContext';
import Cookies from 'js-cookie';

const page = () => {

    const [showModal, setShowModal] = useState(false);
  
    const orderBasketItems: OrderBasketItem[] = [];
    const { basket } = useBasket();
    const [loading, setLoading] = useState(false)

    interface OrderBasketItem {
        itemId: number,
        itemQuantity: number
      }

      // const [userDetails, setUserDetails] = useState({
      //   email:"",
      //   password:"",
      //   address: {
      //     line1:"",
      //     line2: "",
      //     city: "",
      //     country: "",
      //     postCode: "",

      //   },
      //   role:"ADMIN"
    
      // });



      useEffect(() => {
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
              line1: parsedAddress.address.line1??"",
              line2: parsedAddress.address.line2??"",
              city: parsedAddress.address.city??"",
              country: parsedAddress.address.country??"",
              postCode: parsedAddress.address.postal_code??""
            },
            role:"ADMIN"

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
    

    const handleSubmitPost = async () => {
      console.log('trying to submit order!')
      event?.preventDefault()
        if(basket.length > 0){
          setLoading(true)
          const response = await fetch("/api/postOrder", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(getSubmitOrderBody()),
          });
          console.log('status: ', response.status)
          setShowModal(!showModal)
          setLoading(false)
      
          if (response.status === 202) {
            localStorage.setItem('basket', JSON.stringify([]))
            Cookies.remove('user_email');


            window.location.reload();

            // setShowModal(!showModal)
      
          }
          else {
            console.log(response.body)
          }
        }
    
      };


  // useEffect(() => {
  //   handleSubmitPost()

  // },[])
  return (
    <div className='flex flex-col align-middle justify-center items-center mt-20 '>
        <h1 className='text-xl '>Thank you for your Order!</h1>
        <h1 className='text-md '>confirmation has been sent to your email.</h1>

        <Link className='w-2/5 mr-3 items-center flex justify-center' href={`/`}>

        <h1 className='btn  bg-slate-900 text-cyan-50 hover:bg-slate-700 w-48  text-md mb-4 mt-6'>Continue Shopping</h1> 
        </Link>  
        {/* <div onClick={handleSubmitPost} className='btn  bg-slate-900 text-cyan-50 hover:bg-slate-700 w-48  text-md mb-4 mt-6'>TEST</div>  */}

    </div>
  )
}

export default page
