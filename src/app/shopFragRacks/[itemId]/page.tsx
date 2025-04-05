'use client'
import React, { useEffect, useState } from 'react'
import { useBasket } from '@/src/app/components/BasketContext/BasketContext';
import Loading from '@/src/app/components/Loading/Loading';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Test from '../../components/Test/Test';


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




const Page = ({ params }: { params: Promise<{ itemId: string }> }) => {
  const router = useRouter() // may be null or a NextRouter instance
  const image_url = 'https://storage.googleapis.com/fragracks-web-images/frag-racks-images/%20Magnetic-Frag-tray-L'
  const [itemQuantity, setItemQuanity] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  // asynchronous access of `params.id`.
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState('')
  const [item, setItem] = useState<FragRackItem>();
  const [basketItem, setBasketItem] = useState<BasketItem>({
    id: 0,
    title: "",
    price: 0,
    code: "",
    quantity: 0,
    photoUrls: []

  });
  const [basketItems, setBasketItems] = useState<BasketItem[]>()
  const { addSingleItemToBasket, basket, removeItemInBasket, getBasketTotal, getBasketCount } = useBasket();
  const { itemId } = React.use(params)


  const [addToCartClicked, setAddToCart] = useState(false);


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
    getItems()

  }, [])


  useEffect(() => {
    setBasketItems(basket)
  }, [addToCartClicked])

  useEffect(() => {
    setCurrentImage(`${image_url}/${item?.photoUrls[0]}.png`)
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
          price: data.price,
        }));
        setLoading(false)
      })
  }

  const changeImageView = (event: React.MouseEvent<HTMLImageElement>) => {
    const imageSrc = event.currentTarget.src;
    setCurrentImage(imageSrc)

  }

  // adds single item to basket and opens a basket drawer on right-hand side

  const handleBasketAdd = (basketItem: BasketItem) => {
    addSingleItemToBasket(basketItem)
    setAddToCart(!addToCartClicked)
    setLoading(false)
  }


  const increaseQuantity = () => {
    setItemQuanity(itemQuantity + 1)

  }

  useEffect(() => {
    setBasketItem((prevItem) => ({
      ...prevItem,
      quantity: itemQuantity,
    }));
    console.log(basketItem)
  }, [itemQuantity])

  const decreaseQuantity = () => {
    if (itemQuantity > 0) {
      setItemQuanity(itemQuantity - 1)
    }

  }


  //  returns all the items in the basket in drawer when users adds item to the cart
  const returnBasketItems = basketItems?.map(eachItem => {
    if (eachItem.id) {
      return <div key={eachItem.id} className='flex flex-col w-full   border items-center bg-slate-400 m-1 p-1'>
        <Link href={`/shopFragRacks/${eachItem.id}`}>

          <div className='flex h-full aspect-square w-full bg-yellow-400 border'>

            <img key={eachItem.id} src={`${image_url}/${eachItem.photoUrls[0]}.png`} className='border cursor-pointer w-full h-full object-cover ' ></img>
          </div>
        </Link>
        <Link href={`/shopFragRacks/${eachItem.id}`}>

          <h1 className='p-1 md:p-2'>{eachItem.title}</h1>
        </Link>

        <h3 className='p-1'>£{eachItem.price}</h3>
        <div className='flex border items-center justify-center w-3/6 rounded-xl '>
          <button onClick={() => {
            removeItemInBasket(eachItem)
            setAddToCart(!addToCartClicked)

          }} className=' text-2xl w-1/6'>-</button>
          <h4 className=' w-1/2 text-center text-stone-900 text-sm m-2'> Quantity: {eachItem.quantity}</h4>
          <button onClick={() => {
            addSingleItemToBasket(eachItem)
            setAddToCart(!addToCartClicked)

          }} className=' text-2xl  w-1/6' >+</button>
        </div>
      </div>
    }
    else {
      return <div key='' className='flex flex-col w-5/6  p-2 border items-center  lg:w-1/2 lg:p-6 m-2 md:m-4'>
        <h2>Basket is empty</h2>
      </div>
    }

  })


  return (
    <>

      <div className='flex-col w-full  rounded-md justify-items-center max-w-screen-2xl m-auto  md:p-2 '>
        {loading ? <Loading /> : <div className='flex-col align-middle justify-items-center w-11/12 md:w-5/6 bg- p-4'>
          {/* <Loading/> */}
          <div className='flex rounded-md border flex-col md:flex-row  justify-center  my-4 w-full md:w-full  p-2'>
            <div className='flex flex-col h-full w-full md:m-4 items-center  md:p-2 md:w-1/2 rounded-md   border  '>
              <div className='flex h-full aspect-square w-full'>
                <img className='flex   p-1  w-full  h-full object-cover' src={currentImage} />

              </div>
              <div key={item?.id} className='flex  items-center justify-center  w-full   '>
                {item?.photoUrls.map(eachurl => {
                  return (
                    <div key={eachurl} className='flex h-full aspect-square w-full '>
                      <img key={eachurl} src={`${image_url}/${eachurl}.png`} className='border cursor-pointer w-full h-full object-cover ' onClick={changeImageView}></img>

                    </div>
                  )
                })}
              </div>

            </div>
            <div className='flex flex-col w-full  p-2 md:p-6 md:pl-8 md:w-1/2 md:mt-2'>
              <h1 className='flex  p-2 text-2xl md:text-3xl font-semibold'>{item?.title}</h1>
              <h3 className='flex    p-2 text-xl '>£{item?.price}</h3>
              <div className='flex  justify-center items-center  w-full md:w-1/2 mt-1 mb-1 md:mt-2 md:mb-2'>
                {/* <div className='flex w-full h-full  items-center justify-center'>
                  <button onClick={decreaseQuantity} className=' text-2xl  rounded-md  w-2/6 border' >-</button>
                  <h1 className='flex text-md w-2/6 justify-center border rounded-md h-8  md:h-full  items-center w-1/2'>{itemQuantity}</h1>
                  <button onClick={increaseQuantity} className=' text-2xl rounded-md w-2/6 border' >+</button>
                </div> */}
              </div>


              {/* adding item to cart [single] */}
              

              <div className="mt-2 drawer drawer-end ">
                <input id="my-drawer2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                  {/* Page content here */}
                  <label onClick={() => { handleBasketAdd(basketItem) }} htmlFor="my-drawer2" className="btn btn-primary drawer-button w-full">Add To Cart</label>
                </div>
                <div className="drawer-side z-20">
                  <label htmlFor="my-drawer2" aria-label="close sidebar" className="drawer-overlay"></label>
                  <ul className="menu bg-base-200 text-base-content min-h-full w-96">

                    {returnBasketItems}
                  </ul>
                </div>
              </div>
              {/* <button onClick={() => { handleAddToBasket(basketItem) }} className=' mt-1 mb-1 md:mt-2 md:mb-2 btn w-1/2'> Add To Cart</button> */}




              <div className='flex flex-col w-full  p-1 md:w-full md:mt-1'>
                <div className='my-2  flex-col  w-full ' >
                  <h1 className='  text-lg md:text-2xl mt-6'> Description </h1>
                  <div className='flex items-center  p-2 '>
                    {/* <video className='w-[80%] rounded-3xl  '
          src="http://localhost:8000/contents/video?videoName=video1"
          loop
          autoPlay
          controls/> */}
                    <div className='mt-4 text-sm '>
                      <h1>🚨 Transform Your Reef Tank with the Ultimate Coral Frag Rack! 🚨</h1>
                      <h1>🔷 Aqua-Print 21cm Honeycomb Frag Rack </h1>
                      <h1>💎 Available Now at Kraken Corals & Aquatics 💎</h1>
                      <ul className='list-disc list-inside mt-4'>
                        <strong>✅ Innovative Honeycomb Design</strong>
                        <li>Maximize coral placement with full usability of all frag holes!</li>
                        <li>Designed to minimize shadowing and boost upward flow, perfect for SPS coral growth.</li>
                      </ul>

                      <ul className='list-disc list-inside mt-4'>
                        <strong>✅ Heavy-Duty Magnets Included</strong>
                        <li>Attach securely to glass up to 20mm thick—no slipping, no worries!</li>
                        <li>Single magnet is all you need for a strong and sturdy hold but hey if you want two go for it!</li>
                      </ul>

                      <ul className='list-disc list-inside mt-4'>
                        <strong>🌊 Stylish, Durable, and Functional</strong>
                        <li>Reef Forge frag racks combine aesthetics with performance to give your tank a professional edge.</li>
                      </ul>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className='flex w-full md:min-h-screen  bg-slate-100'></div>

        </div>}




        {showModal ? <div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
          <h3 className="font-bold text- md:text-lg">✅ Added to basket!</h3>

          <h3 className="font-bold text-lg mt-4">{item?.title}</h3>
          <h3 className="font-bold text-lg">Quantity: {itemQuantity}</h3>

          <div key={item?.id} className='flex flex-col w-1/2  rounded-md md:p-2 md:p-2   mt-1  lg:w-1/3'>

            <Link href={`/shopFragRacks/${item?.id}`}>
              <img src={`${image_url}/${item?.photoUrls[0]}.png`} className='border rounded-md cursor-pointer' ></img>

            </Link>
          </div>
          <h3 className="font-bold text-lg">£{item?.price}</h3>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button onClick={() => {
                router.push(`/shopFragRacks/${item?.id}`)
                setShowModal(!showModal)
                setItemQuanity(0)

              }}
                className="btn">Close</button>
            </form>
          </div>
        </div> : <></>}

      </div>

    </>
  )
}

export default Page
