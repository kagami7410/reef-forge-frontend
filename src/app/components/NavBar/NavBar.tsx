'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useBasket } from "../BasketContext/BasketContext";


const NavBar = () => {

  // Export a custom hook to use the BasketContext
  const { getBasketCount, getBasketTotal } = useBasket();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    if (typeof window == 'object') {
      // Safe to use window or document here
      setIsClient(true);
    }
  }, []);


  
  useEffect(()=>{
    console.log("basket count is: ", getBasketCount())
  
    if(getBasketCount() === 0){
      console.log('basket is empty')
    }
  
  }, [getBasketCount()])
  

  const borderVisibile = ''





  return (
    <div className={`navbar h-8 md:h-10 border m-auto pr-5 pl-5  md:pr-0 md:pl-0  ${borderVisibile}`}>
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
        <Link href={'/'} className={`btn btn-ghost text-xl mr-6 md:text-2xl md:mr-10 md:ml-20 md:w-72`}> REEF FORGE</Link>
      </div>

            <div className="navbar bg-base-100 h-8 opacity-0 md:opacity-100 ">
        <div className="navbar">
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <details>
                <summary className='text-lg'>
                  <Link href="/corals">Beans</Link>
                </summary>
                <ul className="p-2  z-10 flex-col">
                  <li><a>Roasted</a></li>
                  <li><a>Normal</a></li>
                  <li><a>Premium</a></li>
                </ul>
              </details>
            </li>
            <li><a className='text-lg'>About</a></li>

            <li><a className='text-lg'>Story</a></li>

            <li><a className='text-lg'>Special Offers</a></li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center w-full ">

      <div className="flex-none  p-0">
        <div className="dropdown dropdown-end  p-0">
          <div tabIndex={0} role="button" className="btn btn-ghost ">
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
              <span className="badge badge-md indicator-item  bg-slate-300">
                {isClient ? getBasketCount() : 0}

              </span>
            </div>
          </div>
          <div
            tabIndex={0}
            className="rounded-md card-compact dropdown-content bg-base-100 z-[2] mt-3 w-52 shadow">
            <div className="card-body">
              <span className="text-lg font-bold">{isClient ? getBasketCount() : 0} Items</span>
              <span className="text-info">Total:  £{isClient ? getBasketTotal() : 0}</span>
              <div className="card-actions">
                <Link href={"/basket"} className=" btn btn-primary btn-block">View cart</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end p-0 m-0 mr-2">
          <div tabIndex={0} role="button" className="btn btn-ghost p-2 m-0">
            <div className=" rounded-full flex items-center w-8 md:w-10 align-middle justify-center">
            <svg  className="md:h-7 md:w-7 h-6 w-6"
 version="1.1" id="Layer_1"  xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 32 32"  ><style></style><path  d="M25.838 31H6.162a3.957 3.957 0 0 1-3.245-1.661 3.956 3.956 0 0 1-.549-3.604l.704-2.113a6.034 6.034 0 0 1 4.966-4.059C10.131 19.307 13.211 19 16 19c2.788 0 5.869.307 7.963.563a6.032 6.032 0 0 1 4.965 4.059l.704 2.113a3.954 3.954 0 0 1-.55 3.604A3.955 3.955 0 0 1 25.838 31zM16 21c-2.688 0-5.681.298-7.718.549a4.02 4.02 0 0 0-3.312 2.706l-.704 2.112c-.206.618-.106 1.274.274 1.802S5.511 29 6.162 29h19.676a1.98 1.98 0 0 0 1.622-.83c.381-.528.48-1.185.275-1.803l-.704-2.112a4.02 4.02 0 0 0-3.312-2.706C21.681 21.298 18.687 21 16 21zM16 18c-4.687 0-8.5-3.813-8.5-8.5S11.313 1 16 1c4.687 0 8.5 3.813 8.5 8.5S20.687 18 16 18zm0-15c-3.584 0-6.5 2.916-6.5 6.5S12.416 16 16 16s6.5-2.916 6.5-6.5S19.584 3 16 3z"/><path d="M12.04 10.54c-.543 0-.988-.435-1-.98a4.964 4.964 0 0 1 1.394-3.564 4.968 4.968 0 0 1 3.505-1.535c.562.01 1.009.428 1.02.98a1 1 0 0 1-.98 1.02 2.982 2.982 0 0 0-2.103.92 2.981 2.981 0 0 0-.836 2.139 1 1 0 0 1-.98 1.02h-.02z" style={{fill:"#008ad0"}}/></svg>

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
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
      </div>





      {/* <div className={`navbar-center hidden lg:flex ${borderVisibile} justify-center flex-1`}>
    <ul className={`menu menu-horizontal px-1 ${borderVisibile}`}>
    <li>
        <details>
          <summary>Corals</summary>
          <ul className="p-2">
            <li><a>LPS</a></li>
            <li><a>SPS</a></li>
            <li><a>Soft Corals</a></li>

          </ul>
        </details>
      </li>

      <li><a>LiveStocks</a></li>

      <li><a>Special Offers</a></li>
    </ul>
  </div>
 */}

    </div>


  )
}

export default NavBar
