'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useBasket } from "../BasketContext/BasketContext";
import { useRouter } from 'next/navigation'
import { verifyQuantity } from '@/lib/checkStockQuantity';


const NavBar = () => {

interface BasketItem {
  id: number;
  title: string;
  price: number;
  code: string;
  quantity: number;
  photoUrls: string[];

}

interface FragRackItem extends BasketItem {
  colour: string;
  magnetNum: number;
  size: string;
  stockQuantity: number;

}
  const image_url =`${process.env.NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS}/All`;
 const [drawerMounted, setDrawerMounted] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [basketItems, setBasketItems] = useState<BasketItem[]>()
  const [basketClicked, setBasketClicked] = useState(false);
  const { addSingleItemToBasket, basket, removeItemInBasket, getBasketTotal, getBasketCount, removeAllQuantityitem } = useBasket();
  const [updatedCart, setUpdatedCart] = useState(false);
  const router = useRouter() // may be null or a NextRouter instance
  const [noItems, setNoItems] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false)
  const [itemAvailable, setItemAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentlyClickedBasketItem, setCurrentlyClickedBasketItem] = useState<FragRackItem>()

  useEffect(() => {
        checkAuth()

  })


  useEffect(()=>{
  },[isAdmin])

  useEffect(() => {
    setBasketItems(basket)
    console.log(basketItems)

  }, [updatedCart])

  useEffect(() => {
    setBasketItems(basket)
    // console.log(basketItems)

  }, [basketClicked, updatedCart])

  // Export a custom hook to use the BasketContext
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    if (typeof window == 'object') {
      // Safe to use window or document here
      setIsClient(true);
      setBasketItems(basket)
    }

  }, []);



  useEffect(() => {
    console.log("basket count is: ", getBasketCount())

    if (getBasketCount() === 0) {
      console.log('basket is empty')
    }

  }, [getBasketCount()])


  const borderVisibile = ''


  const handleBasketClicked = () => {
    setUpdatedCart(!updatedCart)
    setBasketClicked(!basketClicked)

  }

      const addItemToBasket = (item: FragRackItem) => {
        setLoading(true)
    
        const basketItem = basket.find((itemToFind) => item.id === itemToFind.id)
        console.log("basketItem: ", basketItem)
        if (basketItem != null) {
    
          verifyQuantity(item.id, basketItem?.quantity)
            .then(data => {
              if (data === 200) {
                setDrawerMounted(true); // Mount it
                // setShowModal(!showModal)
                addSingleItemToBasket(item)
                setLoading(false)
                requestAnimationFrame(() => {
                    setDrawerVisible(true);
  
                });
    
    
    
              } else {
                setLoading(false)
                  requestAnimationFrame(() => {
                    setDrawerVisible(false);
                });
                setItemAvailable(!itemAvailable)
    
              }
            })
        }
        else {
          verifyQuantity(item.id, 1)
            .then(data => {
              if (data === 200) {
                setDrawerMounted(true); // Mount it
    
                // setShowModal(!showModal)
                addSingleItemToBasket(item)
                setLoading(false)
                requestAnimationFrame(() => {
                  setDrawerVisible(true);
                });
              }
              else {
                setLoading(false)
                setItemAvailable(!itemAvailable)
    
              }
            })
    
        }
      }
    
const checkAuth = async () => {
  const res = await fetch('/api/auth', {
    credentials: 'include',
     })
  const data = await res.json();
  console.log(data)


  if (data.authenticated) {
    console.log('User is logged in');
    if (data.user.isAdmin === "true") {
      setIsAdmin(true)
      console.log('User is an admin');
      setSignedIn(true)


    }
  }
  else{
    console.log("user not authenticated")
  }
};
  const routeToCheckout = () => {
    if (basket.length > 0) {
      router.push('/userDetailsCheckout')
    }
    else {
      setNoItems(true)
    }
  }

  //  returns all the items in the basket in drawer when users adds item to the cart
  const returnBasketItems = basketItems?.map(eachItem => {
    if (eachItem.id) {
      return <div className='flex flex-col'  key={eachItem.id} >
        <div className='flex w-11/12  items-center p-2 rounded-md '>
        <Link className='w-2/5 mr-3' href={`/shopFragRacks/${eachItem.id}`}>

          <div className='flex h-full aspect-square items-center border rounded-md '>

            <img src={`${image_url}/${eachItem?.photoUrls[0]}`} className=' rounded-md cursor-pointer' ></img>
          </div>
        </Link>
        <div className='flex flex-col'>
          <Link href={`/shopFragRacks/${eachItem.id}`}>

            <h1 className='p-1 md:p-2 text-sm'>{eachItem.title}</h1>
          </Link>

          <h3 className='p-1'>£{eachItem.price}</h3>
          <div className='flex h-10 text-center items-center align-middle justify-center '>

            <div className='flex mt-1 md:mt-2 w-full'>
              <div className='flex border items-center justify-center w-4/6 pr-2 pl-2 rounded-xl '>
                <button onClick={() => {
                  setUpdatedCart(!updatedCart)
                  removeItemInBasket(eachItem)
                }} className=' text-2xl w-1/6'>-</button>
                <h4 className=' w-1/2 text-center text-stone-900 text-sm m-2'> {eachItem.quantity}</h4>
                <button onClick={() => {
                  setUpdatedCart(!updatedCart)
                  setCurrentlyClickedBasketItem(eachItem)

                  addItemToBasket(eachItem)
                }} className=' text-2xl  w-1/6' >+</button>
              </div>
              <button onClick={() => {
                setUpdatedCart(!updatedCart)

                removeAllQuantityitem(eachItem)
              }} className='flex w-8 cursor-pointer ml-4 md:ml-8 hover:w-9'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#2e2d2d" d="M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                </svg>
              </button>
            </div>


          </div>
        </div>


      </div>
      <div className='flex w-full bg-gray-300 h-px m-1'></div>

      </div>
    }
    else {
      return <div key='' className='flex flex-col w-5/6  p-2 border items-center  lg:w-1/2 lg:p-6 m-2 md:m-4'>
        <h2>Basket is empty</h2>
      </div>
    }

  })
  return (
    <div className={` max-w-screen-2xl navbar h-20  m-auto pr-4 pl-4  bg-slate-100  md:pr-0 md:pl-0  ${borderVisibile}`}>
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>

        <ul
          tabIndex={0}
          className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <li><a>Item 1</a></li>
          <li>
            <a>Parent</a>
            <ul className="p-2">
              <li><a>Submenu 1</a></li>
              <li><a>Submenu 2</a></li>
            </ul>
          </li>
          <li><a>Item 3</a></li>
        </ul>
      </div>

      <div className={` ${borderVisibile} `}>
        <Link href={'/'} className={`btn btn-ghost text-xl md:text-2xl md:ml-0 md:w-72`}> REEF FORGE</Link>
      </div>

      <div className="navbar flex justify-center  h-8 opacity-0 md:opacity-100 ">

        <div className="navbar-center bg-base-400 hidden lg:flex">
          <ul className="menu menu-horizontal px-1">


          {/* This is for Nav Bar multiple options */}


            {/* <li>
              <details>
                <summary className='text-lg'>
                  <Link href="/corals">Magnetic Frag Holder</Link>
                </summary>
                <ul className="p-2 w-56 z-10 flex-col">
                  <li><a>Single Frag</a></li>
                  <li><a>Frag Tray</a></li>
                  <li><a>Mushroom Holder</a></li>
                </ul>
              </details>
            </li> */}

            {/* <li><a className='text-lg'>About</a></li>

            <li><a className='text-lg'>Story</a></li>

            <li><a className='text-lg'>Special Offers</a></li> */}
          </ul>
        </div>
      </div>


            {noItems ? <div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
        <h3 className="font-bold text- md:text-lg">Basket is Empty!</h3>



        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button onClick={() => {
              router.push('/shopFragRacks')
              setNoItems(!noItems)
            }}
              className="btn">Close</button>
          </form>
        </div>
      </div> : <></>}


      {isAdmin?           <div className='flex  w-1/4'>
                <button onClick={() => {
                        router.push('/postItem')

                }} className='btn bg-red-200 hover:bg-red-300'>Manage Inventory</button>
        </div> : <></> }


      <div className="flex justify-center md:mr-0 md:w-72  md:ml-20 p-0 w-64">


        <div className="dropdown dropdown-end  p-0   w-1/2">


          <div className=" drawer drawer-end">
            <input id="my-drawer-navbar" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label onClick={handleBasketClicked} htmlFor="my-drawer-navbar" className="btn  bg-slate-100  border-none drawer-button w-full">

                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="md:h-6 md:w-6 h-5 w-5"
                    fill="none"
                    viewBox="0 0 21 21.5"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="badge badge-md indicator-item  bg-slate-200">
                    {isClient ? getBasketCount() : 0}

                  </span>
                </div>
              </label>
            </div>
            <div className="drawer-side z-20">
              <label htmlFor="my-drawer-navbar" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="pt-8 menu bg-base-200 text-base-content min-h-full md:w-96 w-10/12 items-center">
                <h1 className='m-4'>Your Cart</h1>
                {returnBasketItems}
                <div className='my-4'>
                  <h1>Your Total: £{isClient ? getBasketTotal() : 0}</h1>
                </div>
                <div className='flex-col flex w-5/6 mt-6'>
                  <Link href={"/basket"} className=" btn btn-primary btn-block">View cart</Link>
                  <h1 onClick={routeToCheckout} className='btn bg-slate-900 text-cyan-50 hover:bg-slate-700 w-full text-md mb-4 mt-2'>Checkout</h1>
                  </div>

              </ul>
            </div>
          </div>


          {/* <div
            tabIndex={0}
            className="rounded-md card-compact dropdown-content bg-base-100 z-[2] mt-3 w-52 shadow">
            <div className="card-body">
              <span className="text-lg font-bold">{isClient ? getBasketCount() : 0} Items</span>
              <span className="text-info">Total:  £{isClient ? getBasketTotal() : 0}</span>
              <div className="card-actions">
                <Link href={"/basket"} className=" btn btn-primary btn-block">View cart</Link>
              </div>
            </div>
          </div> */}
        </div>
        <div className="dropdown dropdown-end p-0 m-0  w-1/2">
          <div tabIndex={0} role="button" className="btn btn-ghost p-2 m-0">
            <div className=" rounded-full flex items-center w-8 md:w-10 align-middle justify-center">
              <svg className="md:h-7 md:w-7 h-6 w-6"
                version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 32 32"  ><style></style><path d="M25.838 31H6.162a3.957 3.957 0 0 1-3.245-1.661 3.956 3.956 0 0 1-.549-3.604l.704-2.113a6.034 6.034 0 0 1 4.966-4.059C10.131 19.307 13.211 19 16 19c2.788 0 5.869.307 7.963.563a6.032 6.032 0 0 1 4.965 4.059l.704 2.113a3.954 3.954 0 0 1-.55 3.604A3.955 3.955 0 0 1 25.838 31zM16 21c-2.688 0-5.681.298-7.718.549a4.02 4.02 0 0 0-3.312 2.706l-.704 2.112c-.206.618-.106 1.274.274 1.802S5.511 29 6.162 29h19.676a1.98 1.98 0 0 0 1.622-.83c.381-.528.48-1.185.275-1.803l-.704-2.112a4.02 4.02 0 0 0-3.312-2.706C21.681 21.298 18.687 21 16 21zM16 18c-4.687 0-8.5-3.813-8.5-8.5S11.313 1 16 1c4.687 0 8.5 3.813 8.5 8.5S20.687 18 16 18zm0-15c-3.584 0-6.5 2.916-6.5 6.5S12.416 16 16 16s6.5-2.916 6.5-6.5S19.584 3 16 3z" /><path d="M12.04 10.54c-.543 0-.988-.435-1-.98a4.964 4.964 0 0 1 1.394-3.564 4.968 4.968 0 0 1 3.505-1.535c.562.01 1.009.428 1.02.98a1 1 0 0 1-.98 1.02 2.982 2.982 0 0 0-2.103.92 2.981 2.981 0 0 0-.836 2.139 1 1 0 0 1-.98 1.02h-.02z" style={{ fill: "#008ad0" }} /></svg>

            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            {signedIn ? <li><a>Sign out</a></li> : <li><a href='/SignInPage'>Sign in</a></li>}
          </ul>
        </div>
      </div>

            {itemAvailable? <></>:<div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
        <h3 className="font-bold text- md:text-lg">❌ Item has limited Quantity in Stock!</h3>

        <h3 className="font-bold text-lg mt-4">{currentlyClickedBasketItem?.title}</h3>
        <div key={currentlyClickedBasketItem?.id} className='flex flex-col w-1/2  rounded-md md:p-2 md:p-2   mt-1  lg:w-1/3'>

          <Link href={`/shopFragRacks/${currentlyClickedBasketItem?.id}`}>
            <img src={`${image_url}/${currentlyClickedBasketItem?.photoUrls[0]}`} className='border rounded-md cursor-pointer' ></img>

          </Link>
        </div>
        <h3 className="font-bold text-lg mt-1">£{currentlyClickedBasketItem?.price}</h3>
      <h3 className="font-bold text-lg mt-1">only {currentlyClickedBasketItem?.quantity} available!</h3>


        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button onClick={() => {
              router.replace
              setItemAvailable(!itemAvailable)
            }}
              className="btn">Close</button>
          </form>
        </div>
      </div>}
      
      
    </div>

    


  )
}

export default NavBar
