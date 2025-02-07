'use client'
import React, { useEffect, useState } from 'react'
import { useBasket } from '@/src/app/components/BasketContext/BasketContext';
import Loading from '../components/Loading/Loading';
import Link from 'next/link';


interface BasketItem {
  id: number;
  title: string;
  price: number;
  code: string;
  quantity: number;
}

interface FragRackItem extends BasketItem {
  colour: string;
  magnetNum: number;
  size: string;
  stockQuantity: number;
  photoUrls: string[];
  quantity: number;

}

const Page = () => {
  const image_url = 'https://storage.googleapis.com/fragracks-web-images/frag-racks-images/%20Magnetic-Frag-tray-L'

  // asynchronous access of `params.id`.
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FragRackItem[]>([]);
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

  const handlePageClick = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {placeholder} = e.target;
    const currentSelectedPage = Number(placeholder)
    // console.log(currentSelectedPage, ': page is clicked!')
    setCurrentPage(currentSelectedPage - 1)
  }

  const imageClick = () => {

  }


  const jsxreturnedAllItems = items.map(eachItem => {
    return (
      <div key={eachItem.id} className='flex flex-col w-11/12 rounded-md md:p-2 md:p-8  mt-8  lg:w-1/4'>
        <Link href={`/shopFragRacks/${eachItem.id}`}> 
        <img src={`${image_url}/${eachItem.photoUrls[0]}.png`} className='border rounded-md cursor-pointer' ></img>
        
        </Link>

        <a className='p-2' href={`/shopFragRacks/${eachItem.id}`}>{eachItem.title}</a>
        <h3 className='pl-2'>£{eachItem.price}</h3>
        <button onClick={() => { addSingleItemToBasket(eachItem) }} className='btn w-1/2'> Add To Cart</button>
      </div>
    )
  })




  return (
    <>
    <div>
    {loading ? <Loading/>: <div><div className='flex justify-center  '>
        <div className='flex flex-wrap  justify-center my-4 w-5/6'>
          {jsxreturnedAllItems}
        </div>
      </div>


      </div>
}
    </div>
    <div className='flex justify-center mt-8 md:mt-20'>
      <div className="join" >
        <input className="join-item btn btn-square" type="radio" name="options" aria-label="1" value={currentPage} placeholder='1'  onChange={handlePageClick} defaultChecked />
        <input className="join-item btn btn-square" type="radio" name="options" aria-label="2" value={currentPage} placeholder='2'onChange={handlePageClick}/>
        <input className="join-item btn btn-square" type="radio" name="options" aria-label="3" value={currentPage} placeholder='3'onChange={handlePageClick}/>
        <input className="join-item btn btn-square" type="radio" name="options" aria-label="4" value={currentPage} placeholder='4'onChange={handlePageClick}/>
      </div>


      </div>


    </>
  )
}

export default Page
