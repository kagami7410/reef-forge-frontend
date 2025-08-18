'use client'
import { PaymentRequestUpdateDetailsStatus } from '@stripe/stripe-js';
import { List } from 'postcss/lib/list';
import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading/Loading';

const page = () => {

  interface BasketItem {
    id: number;
    quantity: number;
    item: Item;
    order: EmptyOrder;

  }

  interface EmptyOrder {

  }

  interface Item {
    id: number;
    title: string;
    price: number;
    photoUrls: string[];
  }

  interface Order {
    OrderId: string;
    basketItems: Array<BasketItem>;
    date: string;
  }




  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUserOrder = async () => {
    const res = await fetch(`/api/getUserOrders`,
      {
        credentials: "include", // ensures browser sends cookies
      }
    )

    const data = await res.json()
    setUserOrders(data.data)
    setLoading(false)
    console.log("isArray?", Array.isArray(userOrders));

    console.log(data.data)

  }
  const image_url = `${process.env.NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS}/All`;


  const returnAllOrders = Array.isArray(userOrders) && userOrders.map(eachOrder => {
    return <div key={eachOrder.OrderId} className='rounded-xl p-5 flex flex-col border shadow-xl    bg-slate-50 mt-4 w-full max-w-screen-2xl' >
      <div className='flex flex-col '>
        <h1> Order number: {eachOrder.OrderId}</h1>
        <h1> Date: {eachOrder.date}</h1>
        <h1>Items: </h1>


        <div className='flex flex-col border shadow-lg rounded-xl'>
          {eachOrder.basketItems.map(eachBasketItem => {
            return <div key={eachBasketItem.id} className='flex shadow-lg'>
              <div className='bg-gradient-to-r from-blue-400/70 via-red-500/40 to-orange-500/50 rounded-xl w-44 h-44 md:w-22 md:h-22 m-2 shadow-xl border flex'>
                <img src={`${image_url}/${eachBasketItem.item.photoUrls[0]}`} className=' opacity-100 w-full rounded-xl h-full object-cover cursor-pointer' ></img>

              </div>
              <div className='flex flex-col w-60 items-center  '>
                <h1 className='m-4'>{eachBasketItem.item.title}</h1>
                <div className='flex'>
                  <div className='flex flex-col w-28'>
                    <h1>Quantity: </h1>
                    <h1>Price: </h1>
                  </div>

                  <div className='flex flex-col w-20'>
                    <h1>{eachBasketItem.quantity}</h1>
                    <h1>£{eachBasketItem.item.price}</h1>
                  </div>
                </div>
              </div>


            </div>
          })}
        </div>

      </div>
      {/* <h1>{eachOrder.basketItems.map(eachItem => )}</h1> */}
    </div>
  }
  )

  useEffect(() => {
    fetchUserOrder()

  }, [])
  return (
    <div className='flex flex-col mt-20 w-full '>
      <h1 className='mb-6'>Your Orders </h1>
      {/* {loading?<Loading/>:userOrders.map(eachOrder => {return <h1>{eachOrder.orderId}</h1>})} */}

      {loading ? <Loading /> : returnAllOrders}


    </div>
  )
}

export default page
