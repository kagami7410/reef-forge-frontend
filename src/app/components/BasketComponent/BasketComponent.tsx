'use client'
import React, { useEffect, useState } from 'react'
import { useBasket } from '@/src/app/components/BasketContext/BasketContext';
import { useRouter } from 'next/navigation'
import Loading from '../Loading/Loading';
import Link from 'next/link';


type Props = {
  allowEditQuantity: boolean;
};
const BasketComponent = ({allowEditQuantity}: Props) => {
  const image_url = process.env.NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS;

  // Define a type for the item
  interface BasketItem {
    id: number;
    title: string;
    price: number;
    code: string;
    quantity: number;
    photoUrls: string[];
  }
  const { basket, removeItemInBasket, getBasketTotal, getBasketCount, addSingleItemToBasket, removeAllQuantityitem} = useBasket();
  const [noItems, setNoItems] = useState(false);
  const [itemExistsInBasket, setItemExistsInBasket] = useState(false)
  const [basketItems, setBasketItems] = useState<BasketItem[]>()
  const router = useRouter() // may be null or a NextRouter instance
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    setBasketItems(basket)
    if (basket.length === 0) {
      setItemExistsInBasket(false)
    }
    else {
      setItemExistsInBasket(true)

    }
    setLoading(false)

  }, [basket])


  const returnBasketItems = basketItems?.map(eachItem => {
    if (eachItem.id) {
      return <div key={eachItem.id} className='flex-col'>
       <div  className='flex  p-2  items-center  w-full  justify-center '>
        <div className='flex w-2/5 md:w-1/6 mr-2'>
          <Link href={`/shopFragRacks/${eachItem.id}`}>

            <div className='flex h-full aspect-square w-full  '>

              <img key={eachItem.id} src={`${image_url}/${eachItem.photoUrls[0]}`} className='border  rounded-md cursor-pointer w-full h-full object-cover ' ></img>
            </div>
          </Link>
        </div>
        <div className='flex w-4/6 flex-col  align-middle justify-center items-start ml-1 md:ml-5'>
          <Link href={`/shopFragRacks/${eachItem.id}`}>

            <h1 className='p-1 md:p-2'>{eachItem.title}</h1>
          </Link>

          <h3 className='p-1'>£{eachItem.price}</h3>
          {allowEditQuantity ? <div className='flex mt-1 md:mt-2 w-full'>
          <div className='flex border items-center justify-center w-4/6 pr-2 pl-2 rounded-xl '>
            <button onClick={() => removeItemInBasket(eachItem)} className=' text-2xl w-1/6'>-</button>
            <h4 className=' w-1/2 text-center text-stone-900 text-sm m-2'> {eachItem.quantity}</h4>
            <button onClick={() => { addSingleItemToBasket(eachItem) }} className=' text-2xl  w-1/6' >+</button>
          </div>
          <button onClick={()=>removeAllQuantityitem(eachItem)} className='flex w-8 cursor-pointer ml-4 md:ml-8 hover:w-9'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#2e2d2d" d="M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
          </svg> 
          </button>
           </div>: <div>Quantity:{eachItem.quantity}</div> }

           </div>
           </div>
           <div className='border w-full mt-2 md:mt-3 '></div>


      </div>
    }
    else {
      return <div key='' className='flex flex-col w-5/6  p-2 border items-center  lg:w-1/2 lg:p-6 m-2 md:m-4'>
        <h2>Basket is empty</h2>
      </div>
    }

  })

  const routeToCheckout = () => {
    if (basket.length > 0) {
      router.push('/userDetailsCheckout')
    }
    else {
      setNoItems(true)
    }
  }

  return (
    <>
      {loading ? <Loading /> : <><div className='flex flex-col   items-center justify-center  p-4 md:p-1 '>
        <div className=' items-center w-full pt-4 rounded-t-2xl  flex-col flex p-1'>
          <h2 className='  text-lg text-center font-semibold md:text-xl'>Your basket Total is   £{getBasketTotal()} ( {getBasketCount()} items ) </h2>
          {/* <button onClick={routeToCheckout} className=' btn  text-xl'> Checkout </button> */}

          <div className="divider"></div>


        </div>
        {/* <div className='flex flex-col w-full items-center p-4 md:p-6 bg-slate-100 '> */}
          {itemExistsInBasket ? returnBasketItems : <h1 className='p-10 text-2xl md:p-20 md:text-3xl font-bold'>Your Basket is Empty!</h1>}
        {/* </div> */}

        {/* <div className="border-b w-4/6 border-gray-550 m-4"></div> */}

        <div className=' items-center rounded-md flex flex-col w-5/6 '>
          <div className=' items-center w-3/5 pt-2 rounded-md flex-col flex md:pt-4 md:w-full'>
            <div className='flex'>
              <h2 className=' p-2 text-2xl text-center '>Total  </h2>
              {/* <h2 className=' p-2 text-2xl text-center font-semibold'> £{getBasketTotal()} </h2> */}

            </div>
            <button onClick={routeToCheckout} className=' btn  text-xl'> Checkout </button>
          </div>
        </div>
      </div>
        <div>
          {noItems ? <div className=" modal-box fixed top-1/3 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
            <h3 className="font-bold text-lg">Your Basket is Empty</h3>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button onClick={() => {
                  setNoItems(false)
                }}
                  className="btn">Close</button>
              </form>
            </div>
          </div> : <></>}
        </div>
      </>
      }


    </>


  )
}

export default BasketComponent
