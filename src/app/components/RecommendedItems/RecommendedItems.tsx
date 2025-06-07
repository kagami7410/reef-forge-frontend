import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useBasket } from '@/src/app/components/BasketContext/BasketContext';
import Loading from '../Loading/Loading';
const image_url = process.env.NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS;




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
const RecommendedItems = () => {


  // asynchronous access of `params.id`.
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FragRackItem[]>([]);
  const [currentlyClickedBasketItem, setCurrentlyClickedBasketItem] = useState<BasketItem>();
  const [showModal, setShowModal] = useState(false);
  const { addSingleItemToBasket, basket, removeItemInBasket, removeAllQuantityitem, getBasketTotal } = useBasket();


  useEffect(() => {
    getItems()

  }, [])

  function getItems() {
    setLoading(true)

    fetch(`/api/getAllFragRacks?pageNumber=${currentPage}&pageSize=3`)
      .then(res => res.json())
      .then(data => {
        setItems(data.data.content)
        setLoading(false)

      }
      )
  }







  const jsxreturnedAllItems = items.map((eachItem, index) => {
    const prevIndex = (index - 1 + items.length) % items.length;
    const nextIndex = (index + 1) % items.length;

    return (
      // <div key={eachItem.title} id={eachItem.title}  className=" carousel-item scroll-mt-96 relative w-full bg-lime-100 rounded-lg">
      //   <img src={`${image_url}/${eachItem.photoUrls[0]}`} className="w-full rounded-lg p-8 h-96  w-full object-cover" alt={`Slide ${index + 1}`} />
      //   <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      //   <button onClick={()=>goToSlide(items[prevIndex].title)} className="btn btn-circle">❮</button>
      //   <button onClick={()=>goToSlide(items[nextIndex].title)} className="btn btn-circle">❯</button>

      //     {/* <a  href={`#${items[prevIndex].title}`} className="btn btn-circle">❮</a>
      //     <a  href={`#${items[nextIndex].title}`} className="btn btn-circle">❯</a> */}
      //   </div>
      // </div>
      <div key={eachItem.title} id={eachItem.title} className=" carousel-item scroll-mt-96 relative items-center justify-center w-full bg-lime-100 rounded-lg">
        <div className='border m-4'>
          
          <img src={`${image_url}/${items[prevIndex].photoUrls[0]}`} className="w-full rounded-lg p-8 h-96  w-full object-cover" alt={`Slide ${index + 1}`} />
        </div>
        <div>
        <img src={`${image_url}/${eachItem.photoUrls[0]}`} className="w-full rounded-lg p-8 h-96  w-full object-cover" alt={`Slide ${index + 1}`} />

        </div>


        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <button onClick={() => goToSlide(items[prevIndex].title)} className="btn btn-circle">❮</button>
          <button onClick={() => goToSlide(items[nextIndex].title)} className="btn btn-circle">❯</button>

          {/* <a  href={`#${items[prevIndex].title}`} className="btn btn-circle">❮</a>
              <a  href={`#${items[nextIndex].title}`} className="btn btn-circle">❯</a> */}
        </div>
      </div>
    );

  })
  function goToSlide(slideId: string) {
    // show the slide
    document.getElementById(slideId)!.scrollIntoView({
      behavior: 'smooth', block: 'nearest', // or 'center', or 'start'
      inline: 'start',
    });

    // optionally update the hash manually if needed
    history.replaceState(null, '', `#${slideId}`);
  }


  return (
    <>
      {/* <div className='flex flex-col items-center w-full'>
        <h1>You may also need?</h1>
      <div>
        {loading ? <Loading /> : <div><div className='flex justify-center'>
          <div className='flex flex-wrap  justify-center max-w-screen-2xl  my-4 w-5/6'>
            {jsxreturnedAllItems}
          </div>
        </div>


        </div>
        }
      </div>
        </div> */}




      <div className='flex items-center rounded-lg justify-center'>
        <div className="carousel rounded-lg w-full">
          {jsxreturnedAllItems}
        </div>

      </div>




    </>
  )
}

export default RecommendedItems
