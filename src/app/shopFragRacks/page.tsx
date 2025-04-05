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

  const image_url = 'https://storage.googleapis.com/fragracks-web-images/frag-racks-images/%20Magnetic-Frag-tray-L'
  const [showModal, setShowModal] = useState(false);

  // asynchronous access of `params.id`.
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FragRackItem[]>([]);
  const [currentlyClickedBasketItem, setCurrentlyClickedBasketItem] = useState<BasketItem>();

  const { addSingleItemToBasket } = useBasket();

  // const vaildPaths = ["getAll", "greenBeans", "darkRoastedBeans"]

  useEffect(() => {
    getItems()
    console.log(currentPage, ': page is clicked!')

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


  const addItemToBasket = (item: BasketItem) => {
    setCurrentlyClickedBasketItem(item)
    setShowModal(!showModal)
    console.log('modal activated')
    addSingleItemToBasket(item)

  }

  const handlePageClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { placeholder } = e.target;
    const currentSelectedPage = Number(placeholder)
    // console.log(currentSelectedPage, ': page is clicked!')
    setCurrentPage(currentSelectedPage - 1)
  }




  const jsxreturnedAllItems = items.map(eachItem => {
    return (
      <div key={eachItem.id} className='flex flex-col w-11/12 rounded-md md:p-2 md:p-8  mt-8  lg:w-1/4'>
        <Link href={`/shopFragRacks/${eachItem.id}`}>
          <img src={`${image_url}/${eachItem.photoUrls[0]}.png`} className='border rounded-md cursor-pointer' ></img>

        </Link>

        <a className='p-2' href={`/shopFragRacks/${eachItem.id}`}>{eachItem.title}</a>
        <h3 className='pl-2'>£{eachItem.price}</h3>








        <div  className="mt-2 drawer-end z-20">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label onClick={() => { addItemToBasket(eachItem) }} 
            htmlFor="my-drawer" className="btn btn-primary drawer-button">Add To Cart</label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              {/* Sidebar content here */}
              <li><a>Sidebar Item 1</a></li>
              <li><a>Sidebar Item 2</a></li>
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
            <img src={`${image_url}/${currentlyClickedBasketItem?.photoUrls[0]}.png`} className='border rounded-md cursor-pointer' ></img>

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
