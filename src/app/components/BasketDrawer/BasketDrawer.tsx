// 'use client'
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { useState } from 'react'
// import { useBasket } from '../BasketContext/BasketContext';

// const BasketDrawer = () => {

//       const [basketItems, setBasketItems] = useState<BasketItem[]>()
//       const [basketClicked, setBasketClicked] = useState(false);
//       const { addSingleItemToBasket, basket, removeItemInBasket, getBasketTotal, getBasketCount, removeAllQuantityitem } = useBasket();
//       const [updatedCart, setUpdatedCart] = useState(false);
//       const router = useRouter() // may be null or a NextRouter instance
//       const [noItems, setNoItems] = useState(false);
//       const [isClient, setIsClient] = useState(false);
//       const image_url = process.env.NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS;

//   interface BasketItem {
//     id: number;
//     title: string;
//     price: number;
//     code: string;
//     quantity: number;
//     photoUrls: string[];

//   }
//   const handleBasketClicked = () => {
//     setUpdatedCart(!updatedCart)
//     setBasketClicked(!basketClicked)

//   }


  
//   const routeToCheckout = () => {
//     if (basket.length > 0) {
//       router.push('/userDetailsCheckout')
//     }
//     else {
//       setNoItems(true)
//     }
//   }

//     //  returns all the items in the basket in drawer when users adds item to the cart
//   const returnBasketItems = basketItems?.map(eachItem => {
//     if (eachItem.id) {
//       return <div className='flex flex-col'  key={eachItem.id} >
//         <div className='flex w-11/12  items-center p-2 rounded-md '>
//         <Link className='w-2/5 mr-3' href={`/shopFragRacks/${eachItem.id}`}>

//           <div className='flex h-full aspect-square items-center border rounded-md '>

//             <img src={`${image_url}/${eachItem?.photoUrls[0]}`} className=' rounded-md cursor-pointer' ></img>
//           </div>
//         </Link>
//         <div className='flex flex-col'>
//           <Link href={`/shopFragRacks/${eachItem.id}`}>

//             <h1 className='p-1 md:p-2 text-sm'>{eachItem.title}</h1>
//           </Link>

//           <h3 className='p-1'>£{eachItem.price}</h3>
//           <div className='flex h-10 text-center items-center align-middle justify-center '>

//             <div className='flex mt-1 md:mt-2 w-full'>
//               <div className='flex border items-center justify-center w-4/6 pr-2 pl-2 rounded-xl '>
//                 <button onClick={() => {
//                   setUpdatedCart(!updatedCart)
//                   removeItemInBasket(eachItem)
//                 }} className=' text-2xl w-1/6'>-</button>
//                 <h4 className=' w-1/2 text-center text-stone-900 text-sm m-2'> {eachItem.quantity}</h4>
//                 <button onClick={() => {
//                   setUpdatedCart(!updatedCart)

//                   addSingleItemToBasket(eachItem)
//                 }} className=' text-2xl  w-1/6' >+</button>
//               </div>
//               <button onClick={() => {
//                 setUpdatedCart(!updatedCart)

//                 removeAllQuantityitem(eachItem)
//               }} className='flex w-8 cursor-pointer ml-4 md:ml-8 hover:w-9'>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#2e2d2d" d="M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
//                 </svg>
//               </button>
//             </div>


//           </div>
//         </div>


//       </div>
//       <div className='flex w-full bg-gray-300 h-px m-1'></div>

//       </div>
//     }
//     else {
//       return <div key='' className='flex flex-col w-5/6  p-2 border items-center  lg:w-1/2 lg:p-6 m-2 md:m-4'>
//         <h2>Basket is empty</h2>
//       </div>
//     }

//   })



//   return (
//     <div>
//         <div className=" drawer drawer-end">
//             <input id="my-drawer-navbar" type="checkbox" className="drawer-toggle" />
//             <div className="drawer-content">
//               <label onClick={handleBasketClicked} htmlFor="my-drawer-navbar" className="btn  bg-slate-100  border-none drawer-button w-full">

//                 <div className="indicator">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="md:h-6 md:w-6 h-5 w-5"
//                     fill="none"
//                     viewBox="0 0 21 21.5"
//                     stroke="currentColor">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                   </svg>
//                   <span className="badge badge-md indicator-item  bg-slate-200">
//                     {isClient ? getBasketCount() : 0}

//                   </span>
//                 </div>
//               </label>
//             </div>
//             <div className="drawer-side z-20">
//               <label htmlFor="my-drawer-navbar" aria-label="close sidebar" className="drawer-overlay"></label>
//               <ul className="pt-8 menu bg-base-200 text-base-content min-h-full md:w-96 w-10/12 items-center">
//                 <h1 className='m-4'>Your Cart</h1>
//                 {returnBasketItems}
//                 <div className='my-4'>
//                   <h1>Your Total: £{isClient ? getBasketTotal() : 0}</h1>
//                 </div>
//                 <div className='flex-col flex w-5/6 mt-6'>
//                   <Link href={"/basket"} className=" btn btn-primary btn-block">View cart</Link>
//                   <h1 onClick={routeToCheckout} className='btn bg-slate-900 text-cyan-50 hover:bg-slate-700 w-full text-md mb-4 mt-2'>Checkout</h1>
//                   </div>

//               </ul>
//             </div>
//           </div>
      
//     </div>
//   )
// }

// export default BasketDrawer
