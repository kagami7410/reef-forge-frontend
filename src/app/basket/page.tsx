'use client'
import BasketComponent from '../components/BasketComponent/BasketComponent';


const Basket = () => {



  return (
    <>
    <div className='flex align-middle justify-center  mt-4'>
      <div className='md:w-3/4 w-full'>
      <BasketComponent allowEditQuantity={true}/>


      </div>
    </div>

    </>


  )
}

export default Basket
