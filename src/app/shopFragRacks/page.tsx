'use client'
import React, { useEffect, useState } from 'react'
import { useBasket } from '@/src/app/components/BasketContext/BasketContext';
import Loading from '../components/Loading/Loading';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


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

const Page = () => {
  const router = useRouter() // may be null or a NextRouter instance
  const [isClient, setIsClient] = useState(false);
  const image_url = process.env.NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS;
  const [showModal, setShowModal] = useState(false);

  // asynchronous access of `params.id`.
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FragRackItem[]>([]);
  const [currentlyClickedBasketItem, setCurrentlyClickedBasketItem] = useState<BasketItem>();

  const { addSingleItemToBasket, basket, removeItemInBasket, removeAllQuantityitem, getBasketTotal } = useBasket();

  // const vaildPaths = ["getAll", "greenBeans", "darkRoastedBeans"]

  useEffect(() => {
    getItems()
  }, [currentPage])

  function getItems() {
    setLoading(true)

    fetch(`/api/getAllFragRacks?pageNumber=${currentPage}&pageSize=2`)
      .then(res => res.json())
      .then(data => {
        setItems(data.data.content)
        setLoading(false)

      }
      )
  }

    useEffect(() => {
      if (typeof window == 'object') {
        // Safe to use window or document here
        setIsClient(true);
      }
      console.log("this is env:" + image_url)
    getItems()

  }, [])

  const addItemToBasket = (item: BasketItem) => {
    setCurrentlyClickedBasketItem(item)
    setShowModal(!showModal)
    addSingleItemToBasket(item)

  }

  const handlePageClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { placeholder } = e.target;
    const currentSelectedPage = Number(placeholder)
    // console.log(currentSelectedPage, ': page is clicked!')
    setCurrentPage(currentSelectedPage - 1)
  }


 //  returns all the items in the basket in drawer when users adds item to the cart
 const returnBasketItems = basket?.map(eachItem => {
  return <div key={eachItem.id} className='flex w-11/12  border items-center p-2 rounded-md m-3 bg-slate-100'>
    <Link className='w-2/5 mr-3' href={`/shopFragRacks/${eachItem.id}`}>

      <div className='flex h-full aspect-square items-center border rounded-md '>

      <img src={`${image_url}/${eachItem.photoUrls[0]}`} className=' rounded-md cursor-pointer' ></img>          
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
            <button onClick={() => removeItemInBasket(eachItem)} className=' text-2xl w-1/6'>-</button>
            <h4 className=' w-1/2 text-center text-stone-900 text-sm m-2'> {eachItem.quantity}</h4>
            <button onClick={() => { addSingleItemToBasket(eachItem) }} className=' text-2xl  w-1/6' >+</button>
          </div>
          <button onClick={()=>removeAllQuantityitem(eachItem)} className='flex w-8 cursor-pointer ml-4 md:ml-8 hover:w-9'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#2e2d2d" d="M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
          </svg> 
          </button>
           </div>


    </div>
    </div>


  </div>
}
)

  const jsxreturnedAllItems = items.map(eachItem => {
    return (
      <div key={eachItem.id} className=' flex flex-col w-11/12 rounded-md md:p-2 md:p-8  mt-8  lg:w-1/4'>
        <Link href={`/shopFragRacks/${eachItem.id}`}>
          <img src={`${image_url}/${eachItem.photoUrls[0]}`} className='border rounded-md cursor-pointer' ></img>

        </Link>

        <a className='p-2' href={`/shopFragRacks/${eachItem.id}`}>{eachItem.title}</a>
        <h3 className='pl-2'>£{eachItem.price}</h3>
        <div  className="mt-2 drawer-end z-20">
          <input id="my-drawer-items-page" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label onClick={() => { addItemToBasket(eachItem) }} 
            htmlFor="my-drawer-items-page" className="btn btn-primary drawer-button">Add To Cart</label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-items-page" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              {/* Sidebar content here */}
              <h1>Your Cart</h1>
              {returnBasketItems}
              <div className="divider"></div>
               <div>
                <h1>Your Total: £{isClient ? getBasketTotal() : 0}</h1>
               </div>
               <div className='flex-col flex w-5/6 mt-6'>
               <Link href={"/basket"} className=" btn btn-primary btn-block">View cart</Link>
               <h1 className='btn bg-slate-900 text-cyan-50 hover:bg-slate-700 text-md m-1'>Checkout</h1>
               </div>
            </ul>
          </div>
        </div>
      </div>
    )
  })




  return (
    <>
      <div>
        {loading ? <Loading /> : <div><div className='flex justify-center  '>
          <div className='flex flex-wrap  justify-center max-w-screen-2xl  my-4 w-5/6'>
            {jsxreturnedAllItems}
          </div>
        </div>


        </div>
        }
      </div>


      {showModal ? <div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
        <h3 className="font-bold text- md:text-lg">✅ Added to basket!</h3>

        <h3 className="font-bold text-lg mt-4">{currentlyClickedBasketItem?.title}</h3>
        <div key={currentlyClickedBasketItem?.id} className='flex flex-col w-1/2  rounded-md md:p-2 md:p-2   mt-1  lg:w-1/3'>

          <Link href={`/shopFragRacks/${currentlyClickedBasketItem?.id}`}>
            <img src={`${image_url}/${currentlyClickedBasketItem?.photoUrls[0]}`} className='border rounded-md cursor-pointer' ></img>

          </Link>
        </div>
        <h3 className="font-bold text-lg mt-1">£{currentlyClickedBasketItem?.price}</h3>

        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button onClick={() => {
              router.push('/shopFragRacks')
              setShowModal(!showModal)
            }}
              className="btn">Close</button>
          </form>
        </div>
      </div> : <></>}


      
      <div className='flex justify-center mt-8 md:mt-20'>
        <div className="join" >
          <input className="join-item btn btn-square" type="radio" name="options" aria-label="1" value={currentPage} placeholder='1' onChange={handlePageClick} defaultChecked />
          <input className="join-item btn btn-square" type="radio" name="options" aria-label="2" value={currentPage} placeholder='2' onChange={handlePageClick} />
          <input className="join-item btn btn-square" type="radio" name="options" aria-label="3" value={currentPage} placeholder='3' onChange={handlePageClick} />
          <input className="join-item btn btn-square" type="radio" name="options" aria-label="4" value={currentPage} placeholder='4' onChange={handlePageClick} />
        </div>


      </div>




    </>
  )
}

export default Page
