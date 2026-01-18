'use client'
import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading/Loading';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';

const Page = () => {

  interface BasketItem {
    id: number;
    quantity: number;
    item: Item;
    order: EmptyOrder;

  }

  interface EmptyOrder {
    null:null;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth', {
        credentials: 'include',
      });
      const response = await res.json();

      // Extract the actual data from the wrapped response
      const data = response.data || response;

      if (data.authenticated && data.user) {
        logger.info('User authenticated on UserAccount page', { email: data.user.email });
        setIsAuthenticated(true);
        // Only fetch orders if authenticated
        fetchUserOrder();
      } else {
        logger.debug('User not authenticated on UserAccount page');
        setIsAuthenticated(false);
        setLoading(false);
        // Redirect to sign in page after a short delay
        setTimeout(() => {
          router.push('/SignInPage');
        }, 2000);
      }
    } catch (error) {
      logger.error('Auth check failed on UserAccount page', error);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

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
    checkAuth()
  }, [])
  return (
    <div className='flex flex-col mt-20 w-full '>
      {!isAuthenticated && !loading ? (
        <div className='flex flex-col items-center justify-center mt-32'>
          <h1 className='text-2xl font-semibold mb-4'>Please sign in to view your orders</h1>
          <p className='text-gray-600'>Redirecting to sign in page...</p>
        </div>
      ) : (
        <>
          <h1 className='mb-6'>Your Orders </h1>
          {loading ? <Loading /> : returnAllOrders}
        </>
      )}
    </div>
  )
}

export default Page
