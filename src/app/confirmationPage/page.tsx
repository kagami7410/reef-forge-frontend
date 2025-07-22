'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useBasket } from '../components/BasketContext/BasketContext';
import Cookies from 'js-cookie';
import Loading from '../components/Loading/Loading';
import { verifyQuantity } from '@/lib/checkStockQuantity';
interface BasketItem {
  id: number;
  title: string;
  price: number;
  code: string;
  quantity: number;
  photoUrls: string[];

}




const Page = () => {

 const [unavailableItems, setUnavailableItems] = useState<BasketItem[]>([])
  const [showUnvailableItemsModal, setShowUnavailableItemsModal] = useState(false)
  const image_url =`${process.env.NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS}/All`;

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

          // setShowModal(!showModal)

        }
        else {
          console.log(response.body)
        }
      }
    }
    else {
      console.log("trying to show unavailable items")
      setShowUnavailableItemsModal(!unavailableItems)
    }


  };
  console.log('unavailable Items: ', unavailableItems)


  const returnAvailableItems = unavailableItems.map(
    (eachItem) => {
      return <div key={eachItem.id} className='w-72 h-72 bg-slate-200 top-64 '>
        <h1>{eachItem.title}</h1>
        <img src={`${image_url}/${eachItem?.photoUrls[0]}`} className=' rounded-md cursor-pointer' ></img>
      </div>
    }
  )


  // useEffect(() => {
  //   handleSubmitPost()

  // },[])
  return (
    <>
      {loading ? <Loading /> :
        <div className='flex flex-col align-middle justify-center items-center mt-20 '>
          <h1 className='text-xl '>Thank you for your Order!</h1>
          <h1 className='text-md '>confirmation has been sent to your email.</h1>

          <Link className='w-2/5 mr-3 items-center flex justify-center' href={`/`}>

            <h1 className='btn  bg-slate-900 text-cyan-50 hover:bg-slate-700 w-48  text-md mb-4 mt-6'>Continue Shopping</h1>
          </Link>
          {/* <div onClick={handleSubmitPost} className='btn  bg-slate-900 text-cyan-50 hover:bg-slate-700 w-48  text-md mb-4 mt-6'>TEST</div>  */}

        </div>}

      {showUnvailableItemsModal ? returnAvailableItems : <></>}

    </>

  )
}

export default Page
