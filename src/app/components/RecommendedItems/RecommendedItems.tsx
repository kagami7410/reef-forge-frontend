import Link from 'next/link';
import React, { useEffect, useState } from 'react'
// import { useBasket } from '@/src/app/components/BasketContext/BasketContext';
// import Loading from '../Loading/Loading';
const image_url = `${process.env.NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS}/All`;




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
  const [isMobile, setIsMobile] = useState(false)
  const [screenSize, setScreenSize] = useState(0);

  // asynchronous access of `params.id`.
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FragRackItem[]>([]);

  const currentPage = 0


  useEffect(() => {
    getItems()

  }, [])

  console.log("all items: " + items)



  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    handleResize()
    if (screenSize < 760) {
      setIsMobile(true)
      console.log("Device is Mobile in recommened page")
    }
    else {
      setIsMobile(false)
      console.log('Device is Desktop in recommened page')
    }
  }, [screenSize])

  function getItems() {
    setLoading(!loading)

    fetch(`/api/getAllFragRacks?pageNumber=${currentPage}&pageSize=6`)
      .then(res => res.json())
      .then(data => {
        setItems(data.data.content)
        setLoading(!loading)

      }
      )
  }







  const jsxreturnedAllItems = items.map((eachItem, index) => {


    const prevIndex = ((index - 1) % items.length);
    const nextIndex = ((index + 1) % items.length);



    const md_start_index = (index * 3) % items.length;
    console.log("items length: " + items.length)
    console.log("index are for md for +1: " + (md_start_index + 1) % items.length)
    console.log("index are for md for +2: " + (md_start_index + 2) % items.length)


    // const md_prev_start_index =(index - 1) * 3;;




    if (isMobile) {
      return <div key={eachItem.title} id={eachItem.title} className=" carousel-item scroll-mt-96 relative items-center justify-center w-full  rounded-lg">
        <div className='flex-col '>

          <div className='border bg-gradient-to-r from-blue-400/70 via-red-500/40 to-orange-500/50'>
            <Link href={`/shopFragRacks/${items[index].id}`}>
              <img src={`${image_url}/${items[index].photoUrls[0]}`} className="w-full rounded-lg p-8 h-96  object-cover" alt={`Slide ${index + 1}`} />
            </Link>
          </div>

          <a className='p-2 md:h-16 ' href={`/shopFragRacks/${items[index].id}`}>{items[index].title}</a>
          <h3 className='pl-2 mb-4'>£{items[index].price}</h3>
        </div>

        <div className="absolute left-8 right-8 top-1/2 flex -translate-y-1/2 transform justify-between">
          <button onClick={() => goToSlide(items[prevIndex].title)} className="btn btn-circle">❮</button>
          <button onClick={() => goToSlide(items[nextIndex].title)} className="btn btn-circle">❯</button>

          {/* <a  href={`#${items[prevIndex].title}`} className="btn btn-circle">❮</a>
              <a  href={`#${items[nextIndex].title}`} className="btn btn-circle">❯</a> */}
        </div>
      </div>
    }

    else {
      return <div key={eachItem.title} id={eachItem.title} className=" carousel-item scroll-mt-96 relative items-center justify-center w-full  rounded-lg">
        <div className=" flex -translate-y-1/2 transform justify-between">


          <button onClick={() => goToSlide(items[prevIndex].title)} className="btn btn-circle">❮</button>
        </div>
        <div className='flex-col m-4'>
          <Link href={`/shopFragRacks/${items[md_start_index].id}`}>
            <div className=' w-96 h-96 bg-gradient-to-r from-blue-400/70 via-red-500/40 to-orange-500/50 rounded-lg'>
              <img src={`${image_url}/${items[md_start_index].photoUrls[0]}`} className="w-full rounded-lg  h-96  w-full object-cover" alt={`Slide ${index + 1}`} />
            </div>
          </Link>
          <a className='p-2 md:h-16 ' href={`/shopFragRacks/${items[md_start_index]}`}>{items[md_start_index].title}</a>
          <h3 className='pl-2 mb-4'>£{items[md_start_index].price}</h3>

        </div>

        <div className='flex-col m-4'>
          <Link href={`/shopFragRacks/${items[(md_start_index + 1) % items.length].id}`}>
            <div className='border  w-96 h-96'>

              <img src={`${image_url}/${items[(md_start_index + 1) % items.length].photoUrls[0]}`} className="w-full rounded-lg  h-96  w-full object-cover" alt={`Slide ${index + 1}`} />
            </div>
          </Link>
          <a className='p-2 md:h-16 ' href={`/shopFragRacks/${items[(md_start_index + 1) % items.length].id}`}>{items[(md_start_index + 1) % items.length].title}</a>
          <h3 className='pl-2  mb-4'>£{items[(md_start_index + 1) % items.length].price}</h3>

        </div>

        <div className='flex-col m-4'>
          <Link href={`/shopFragRacks/${items[(md_start_index + 2) % items.length].id}`}>
            <div className='border  w-96 h-96'>

              <img src={`${image_url}/${items[(md_start_index + 2) % items.length].photoUrls[0]}`} className="w-full rounded-lg  h-96  w-full object-cover" alt={`Slide ${index + 1}`} />
            </div>
          </Link>
          <a className='p-2 md:h-16 ' href={`/shopFragRacks/${items[(md_start_index + 2) % items.length].id}`}>{items[(md_start_index + 2) % items.length].title}</a>
          <h3 className='pl-2  mb-4'>£{items[(md_start_index + 2) % items.length].price}</h3>

        </div>


        <div className=" flex -translate-y-1/2 transform justify-between">
          <button onClick={() => goToSlide(items[nextIndex].title)} className="btn btn-circle">❯</button>

          {/* <a  href={`#${items[prevIndex].title}`} className="btn btn-circle">❮</a>
              <a  href={`#${items[nextIndex].title}`} className="btn btn-circle">❯</a> */}
        </div>
      </div>




      // <div key={eachItem.title} id={eachItem.title}  className=" carousel-item scroll-mt-96 relative w-full bg-lime-100 rounded-lg">
      //   <img src={`${image_url}/${eachItem.photoUrls[0]}`} className="w-full rounded-lg p-8 h-96  w-full object-cover" alt={`Slide ${index + 1}`} />
      //   <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      //   <button onClick={()=>goToSlide(items[prevIndex].title)} className="btn btn-circle">❮</button>
      //   <button onClick={()=>goToSlide(items[nextIndex].title)} className="btn btn-circle">❯</button>

      //     {/* <a  href={`#${items[prevIndex].title}`} className="btn btn-circle">❮</a>
      //     <a  href={`#${items[nextIndex].title}`} className="btn btn-circle">❯</a> */}
      //   </div>
      // </div>

    }





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
