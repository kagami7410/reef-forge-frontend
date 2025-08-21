'use client'
import React, { useEffect, useState } from 'react'
import { useBasket } from '@/src/app/components/BasketContext/BasketContext';
import Loading from '@/src/app/components/Loading/Loading';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { verifyQuantity } from '@/lib/checkStockQuantity';
import RecommendedItems from '../../components/RecommendedItems/RecommendedItems';


interface BasketItem {
  id: number;
  title: string;
  price: number;
  code: string;
  quantity: number;
  photoUrls: string[];
  stockQuantity: number;

}

interface FragRackItem extends BasketItem {
  colour: string;
  magnetNum: number;
  size: string;
  stockQuantity: number;
  description: string;

}



const Page = ({ params }: { params: Promise<{ itemId: string }> }) => {
  const [isClient, setIsClient] = useState(false);
  const [itemAvailable, setItemAvailable] = useState(true);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter() // may be null or a NextRouter instance
  const image_url = process.env.NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS;
  const [itemQuantity, setItemQuanity] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  // asynchronous access of `params.id`.
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState('')
  const [item, setItem] = useState<FragRackItem>();
  const [noItems, setNoItems] = useState(false);
  const [basketItem, setBasketItem] = useState<BasketItem>({
    id: 0,
    title: "",
    price: 0,
    code: "",
    quantity: 0,
    photoUrls: [],
    stockQuantity: 0

  });
  const { addSingleItemToBasket, basket, removeItemInBasket, getBasketTotal, removeAllQuantityitem } = useBasket();
  const { itemId } = React.use(params)
    const [futureDate, setFutureDate] = useState('');


  // const handleAddToBasket = (item: BasketItem) => {

  // if (itemQuantity > 0) {
  //   setShowModal(!showModal)
  //   addItemToBasket(item);
  // }
  // else {
  //   setShowModalNoQuantity(!showModalNoQuantity)

  // } 

  // addItemToBasket(item);


  // };
  // const vaildPaths = ["getAll", "greenBeans", "darkRoastedBeans"]

    useEffect(() => {

    const now = new Date();
    now.setDate(now.getDate() + 3); // Add 3 days
    setFutureDate(now.toDateString()); // Or toISOString(), toLocaleDateString(), etc.
      if (typeof window == 'object') {
        // Safe to use window or document here
        setIsClient(true);
      }
    getItems()

  }, [])



  useEffect(() => {
    setCurrentImage(`${image_url}/All/${item?.photoUrls[0]}`)
  }, [item])

  function getItems() {
    // if(vaildPaths.includes(beanType)){
    console.log('loading single page')
    setLoading(true)
    fetch(`/api/getFragRackById?itemId=${itemId}`)
      .then(res => res.json())
      .then(data => {
        setItem(data)
        setBasketItem((prevItem) => ({
          ...prevItem,
          id: data.id,
          title: data.title,
          photoUrls: data.photoUrls,
          price: data.price,
        }));
        setLoading(false)
      })
  }

  const handleClose = () => {
    setDrawerVisible(false);
    setTimeout(() => {
      setDrawerMounted(false); // Unmount after animation ends
    }, 300); // Match transition duration
  };

  
  const routeToCheckout = () => {
    if (basket.length > 0) {
      router.push('/userDetailsCheckout')
    }
    else {
      setNoItems(true)
    }
  }

  const changeImageView = (event: React.MouseEvent<HTMLImageElement>) => {
    const imageSrc = event.currentTarget.src;
    setCurrentImage(imageSrc)

  }

  // adds single item to basket and opens a basket drawer on right-hand side

  // const handleBasketAdd = (basketItem: FragRackItem) => {
  //   setAddToCart(!addToCartClicked)
  //   setBasketItems(basket)
  //   console.log(basketItem)
  //   addSingleItemToBasket(basketItem)
  //   setLoading(false)
  // }



    const addItemToBasket = (item: BasketItem) => {
      setLoading(true)
  
      const basketItem = basket.find((itemToFind) => item.id === itemToFind.id)
      console.log("basketItem: ", basketItem)
      if (basketItem != null) {
  
        verifyQuantity(item.id, basketItem?.quantity+1)
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
  





  // const increaseQuantity = () => {
  //   setItemQuanity(itemQuantity + 1)

  // }

  useEffect(() => {
    setBasketItem((prevItem) => ({
      ...prevItem,
      quantity: itemQuantity,
    }));
    console.log(basketItem)
  }, [itemQuantity])

  // const decreaseQuantity = () => {
  //   if (itemQuantity > 0) {
  //     setItemQuanity(itemQuantity - 1)
  //   }

  // }

 //  returns all the items in the basket in drawer when users adds item to the cart
 const returnBasketItems = basket?.map(eachItem => {
  return <div key={eachItem.id} className='flex flex-col'>
    <div  className='flex w-full   justify-center items-center p-2 '>
    <Link className='w-2/5 mr-3' href={`/shopFragRacks/${eachItem.id}`}>

            <div className='flex h-full  aspect-square justify-center '>
              <img key={eachItem.id} src={`${image_url}/All/${eachItem.photoUrls[0]}`} className='  rounded-md cursor-pointer object-cover ' ></img>
            </div>
    </Link>
    <div className='flex  w-4/6 flex-col'>
    <Link href={`/shopFragRacks/${eachItem.id}`}>

      <h1 className='p-1 md:p-2 text-sm'>{eachItem.title}</h1>
    </Link>

    <h3 className='p-1'>£{eachItem.price}</h3>
    <div className='flex h-10 text-center items-center align-middle justify-center '>

    <div className='flex mt-1 md:mt-2 w-full'>
          <div className='flex border items-center justify-center w-4/6 pr-2 pl-2 rounded-xl '>
            <button onClick={() => removeItemInBasket(eachItem)} className=' text-2xl w-1/6'>-</button>
            <h4 className=' w-1/2 text-center text-stone-900 text-sm m-2'> {eachItem.quantity}</h4>
            <button onClick={() => { addItemToBasket(eachItem) }} className=' text-2xl  w-1/6' >+</button>
          </div>
          <button onClick={()=>removeAllQuantityitem(eachItem)} className='flex w-8 cursor-pointer ml-4 md:ml-8 hover:w-9'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#2e2d2d" d="M576 128c0-35.3-28.7-64-64-64L205.3 64c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7L512 448c35.3 0 64-28.7 64-64l0-256zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
          </svg> 
          </button>
           </div>

    </div>

    </div>

  </div>
      <div className='flex w-full bg-gray-300 h-px m-1'></div>
      </div>

}
)

  return (
    <>

      <div className='flex-col w-full   justify-items-center max-w-screen-2xl m-auto  md:p-2 '>
        {loading ? <Loading /> : <div className='flex-col align-middle justify-items-center w-11/12 md:w-5/6 h-screen p-4'>
          {/* <Loading/> */}
          <div className='flex rounded-2xl  flex-col md:flex-row align-middle items-center justify-center  my-4 w-full md:w-full  p-2'>
            <div className='flex flex-col h-full w-full md:m-4 items-center  md:p-2 md:w-1/2 rounded-2xl    '>
              <div className='flex h-full  border-slate-400 rounded-2xl  aspect-square w-full'>
                <img className='flex p-1  w-full h-full object-cover bg-gradient-to-r from-blue-400/70 via-red-500/40 to-orange-500/50 rounded-2xl' src={currentImage} />

              </div>
              <div key={item?.id} className='flex  items-center justify-center  w-full   '>
                {item?.photoUrls.map(eachurl => {
                  return (
                    <div key={eachurl} className='flex m-1 mt-3 rounded-md border-slate-400  border  h-full aspect-square w-full '>
                      <img key={eachurl} src={`${image_url}/All/${eachurl}`} className='border cursor-pointer w-full h-full object-cover ' onClick={changeImageView}></img>

                    </div>
                  )
                })}
              </div>

            </div>
            <div className='flex flex-col w-96  p-2 md:p-6 md:pl-8 md:w-1/2 md:mt-2 rounded-xl shadow-2xl'>
                          <h1 className='flex pl-2 text-sm'>Reef Forge</h1>

              <h1 className='flex  pl-2 text-2xl md:text-3xl font-semibold'>{item?.title}</h1>
              <h3 className='flex    p-2 text-xl '>£{item?.price}</h3>
              <div className='flex flex-col items-center align-middle justify-center'>
              <div className="flex border w-80 md:w-96 justify-center p-2 rounded-lg  text-lime-600">✅ Get it by {futureDate}</div>

              <div className='flex  justify-center items-center  w-full md:w-1/2 mt-1 mb-1 md:mt-2 md:mb-2'>
                {/* <div className='flex w-full h-full  items-center justify-center'>
                  <button onClick={decreaseQuantity} className=' text-2xl  rounded-md  w-2/6 border' >-</button>
                  <h1 className='flex text-md w-2/6 justify-center border rounded-md h-8  md:h-full  items-center w-1/2'>{itemQuantity}</h1>
                  <button onClick={increaseQuantity} className=' text-2xl rounded-md w-2/6 border' >+</button>
                </div> */}
              </div>
              </div>

              {noItems ? <div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
        <h3 className="font-bold text-lg md:text-lg">Basket is Empty!</h3>



        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button onClick={() => {
              router.push(`/shopFragRacks/${itemId}`)
              setNoItems(!noItems)
            }}
              className="btn">Close</button>
          </form>
        </div>
      </div> : <></>}

              {/* adding item to cart [single] */}
              

              <div className=" drawer drawer-end justify-center">
            <input id="my-drawer-single-item-page" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label onClick={() => { if(item !==undefined){addItemToBasket(item)}}} 
            htmlFor="my-drawer-single-item-page" className="btn btn-primary drawer-button w-72 md:w-96">Add To Cart</label>
            </div>

                    {/* Overlay */}
        {drawerMounted && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${drawerVisible ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            onClick={handleClose}
          />
        )}

        {/* Drawer panel */}
        {drawerMounted && (
          <div
            className={`fixed top-0 right-0 h-full bg-base-200 z-50 w-10/12 md:w-96 transform transition-transform duration-300 ease-in-out ${drawerVisible ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <ul className="pt-8 menu bg-base-200 text-base-content min-h-full md:w-96 w-full items-center">
              {/* Sidebar content here */}
              <h1>Your Cart</h1>

              {returnBasketItems}
              <div className='mt-8'></div><div>
                <h1>Your Total: £{isClient ? getBasketTotal() : 0}</h1>
              </div>
              <div className='flex-col flex w-5/6 mt-6'>
                <Link href={"/basket"} className=" btn btn-primary btn-block">View cart</Link>
                <h1 onClick={routeToCheckout} className='btn bg-slate-900 text-cyan-50 hover:bg-slate-700 w-full text-md mb-4 mt-2'>Checkout</h1>
              </div>
            </ul>
          </div>
        )}
            {/* <div className="drawer-side z-50 items-center">
              <label htmlFor="my-drawer-single-item-page" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="pt-8 menu bg-base-200 text-base-content min-h-full md:w-96 w-10/12 items-center">
              <h1 className='mt-2 mb-4'>Your Cart</h1>
              
               {returnBasketItems}
               
               <div className="divider"></div>
               <div>
                <h1>Your Total: £{isClient ? getBasketTotal() : 0}</h1>
               </div>
               <div className='flex-col flex w-5/6 mt-6'>
               <Link href={"/basket"} className=" btn btn-primary btn-block">View cart</Link>
               <h1 onClick={routeToCheckout} className='btn bg-slate-900 text-cyan-50 hover:bg-slate-700 w-full text-md mb-4 mt-2'>Checkout</h1>
               </div>

              </ul>
            </div> */}
          </div>
              {/* <button onClick={() => { handleAddToBasket(basketItem) }} className=' mt-1 mb-1 md:mt-2 md:mb-2 btn w-1/2'> Add To Cart</button> */}




              <div className='flex flex-col w-full  p-1 md:w-full md:mt-1'>
                <div className='my-2  flex-col  w-full ' >
                  <h1 className='  text-lg md:text-xl mt-6 font-bold'> About this product </h1>
                  <h3 className='mt-4 text-sm'>{item?.description}</h3>

                </div>
              </div>


            </div>

            
          </div>


          <div className='flex w-full md:min-h-screen '></div>

        </div>}


      {itemAvailable? <></>:<div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
        <h3 className="font-bold text- md:text-lg">❌ Item has limited Quantity in Stock!</h3>

        <h3 className="font-bold text-lg mt-4">{item?.title}</h3>
        <div key={item?.id} className='flex flex-col w-1/2  rounded-md md:p-2 md:p-2   mt-1  lg:w-1/3'>

          <Link href={`/shopFragRacks/${item?.id}`}>
            <img src={currentImage} className='border rounded-md cursor-pointer' ></img>

          </Link>
        </div>
        <h3 className="font-bold text-lg mt-1">£{item?.price}</h3>
      <h3 className="font-bold text-lg mt-1">only {item?.stockQuantity} available!</h3>


        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button onClick={() => {
              router.push(`/shopFragRacks/${itemId}`)
              setItemAvailable(!itemAvailable)
            }}
              className="btn">Close</button>
          </form>
        </div>
      </div>}


        {showModal ? <div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
          <h3 className="font-bold text- md:text-lg">✅ Added to basket!</h3>

          <h3 className="font-bold text-lg mt-4">{item?.title}</h3>
          <h3 className="font-bold text-lg">Quantity: {itemQuantity}</h3>

          <div key={item?.id} className='flex flex-col w-1/2  rounded-md md:p-2 md:p-2   mt-1  lg:w-1/3'>

            <Link href={`/shopFragRacks/${item?.id}`}>
              <img src={`${image_url}/All/${item?.photoUrls[0]}`} className='border rounded-md cursor-pointer' ></img>

            </Link>
          </div>
          <h3 className="font-bold text-lg">£{item?.price}</h3>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button onClick={() => {
                setShowModal(!showModal)
                setItemQuanity(0)

              }}
                className="btn">Close</button>
            </form>
          </div>
        </div> : <></>}


             <div className='flex flex-col mt-3 md:mt-4'>

                <div className='flex flex-col  md:mt-4 mt-96'>
          <h1 className={`text-center text-xl font-sans font-semibold  w-full mb-6 md:text-2xl`}> Reef Forge Products </h1>
                <RecommendedItems />

                </div>
        
        
              </div>

      </div>

    </>
  )
}

export default Page
