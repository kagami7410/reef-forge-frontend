"use client"
import styles from './LandingPage.module.css'
import '/src/app/globals.css'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const LandingPage = () => {

  const [opacityEnabled, setOpacity] = useState(0);

  const [xPosition, setXPosition] = useState(0);



  // const [showVideo, setShowVideo] = useState('recentlyAddedCoralsContainer');


  // const [border, setBorder] = useState('');
  const observedElement = useRef(null);

  const [isMobile, setIsMobile] = useState(false)
  const [screenSize, setScreenSize] = useState(0);
  const image_url = process.env.NEXT_PUBLIC_GS_IMAGE_URL_FRAG_RACKS;



  console.log("stripe public key: " + process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    handleResize()
    if (screenSize < 760) {
      setIsMobile(true)
      console.log("Device is Mobile")
    }
    else {
      setIsMobile(false)
      console.log('Device is Desktop')
    }
  }, [screenSize])




  useEffect(() => {
    // Get the new X position (for example, randomly)

    if (isMobile) {
      console.log(isMobile)
      const newXPosition = 0
      setXPosition(newXPosition);
    }


    if (!isMobile) {
      console.log("is mobile: ", isMobile)
      const newXPosition = 5
      setXPosition(newXPosition);
      setTimeout(() => {
        setOpacity(1)
        // setBorder('border')

      }, 1)
    }
    else {
      setTimeout(() => {
        setOpacity(1)

      }, 1)
    }


    // Set the new X position
  }, [isMobile]);






  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         setShowVideo('recently-added-corals-container video-visible')

  //         console.log('Element is in view!');
  //       } else {
  //         setShowVideo('recently-added-corals-container ')

  //         console.log('Element is out of view!');
  //       }
  //     },
  //     {
  //       root: null, // Use the viewport as the root
  //       rootMargin: '0px',
  //       threshold: 0.1 // Trigger callback when 10% of the element is in view
  //     }
  //   );

  // }, []);

  return (
    <div className={` ${styles.landingPageContainer} mb-96`}>
      <div className={`max-w-screen-2xl ${styles.landingPageTopContainer}  pb-24 pt-10 md:pt-8  md:pb-20`}>
        <div className={` transform transition-all px-8 md:px-4`}
          style={{ opacity: `${opacityEnabled}`, transitionDuration: '750ms', transform: `translateX(${xPosition}%)` }}>
          <div className={`${styles.mainHeadline}`}>Rock-Solid Magnetic Frag Holder</div>
          <div className={`${styles.shortDescription} ${styles.glow} ${styles.textGlow}`}>- Never worry about slipping or shifting – perfect for reef aquariums.</div>
          <div className={styles.shopCoralsButtonContainer}>
            <Link href={{ pathname: '/shopFragRacks' }} className="btn btn-lg opacity-0 hover:bg-yellow-400 bg-yellow-300 sm:opacity-100 border-0  sm:btn-lg">Buy Now</Link>
          </div>
        </div>

        <div className={`flex w-5/6 md:w-2/5 md:h-3/4 h-48 card `} style={{ opacity: `${opacityEnabled}`, transitionDuration: '750ms', transform: `translateX(-${xPosition}%)` }}>
          <div className='card-over flex justify-center align-middle items-center'>
            <div className='flex absolute'>
              <img className='md:scale-125 scale-110 pb-32' src={`${image_url}/Large/IMG20250406195739.png`} />
            </div>
          </div>
        </div>
        <Link href='/shopFragRacks' className="btn z-10 opacity-100 btn-lg sm:opacity-0 mt-6 border-none bg-yellow-300  hover:bg-yellow-500">Buy Now</Link>
      </div>

      <div className='h-px bg-slate-200 w-full '></div>


      <div className='flex w-full md:flex-row flex-col m-4 items-center align-middle md:px-5 justify-center'>
        <div className='flex  flex-col  md:mr-20 mt-4 items-center align-middle justify-center'>
          <h1 className={`text-center text-xl  w-full mb-8 md:mb-0 ${styles.otherHeadline} md:text-2xl`}> Reef Forge Magnetic Frag holder </h1>
          <div className={`${styles.landingPageImageMainContainer} card`} style={{ opacity: `${opacityEnabled}`, transitionDuration: '750ms' }}>
            <div className='card-over flex justify-center align-middle items-center'>
                <img className='scale-100' src={`${image_url}/All/IMG20250406100147.png`} />
            </div>
          </div>
        </div>



        <div className='my-4 mt-4 md:mt-24 bg-slate-100  flex-col  p-8  rounded-md md:rounded-lg w-full md:w-full' ref={observedElement}>
          <div className='flex  justify-center items-center '>
            {/* <video className='w-[80%] rounded-3xl  '
          src="http://localhost:8000/contents/video?videoName=video1"
          loop
          autoPlay
          controls/> */}
            <div className='mt-4 text-xs md:text-sm'>
              <h1>🚨 Transform Your Reef Tank with Ultimate Coral Frag Rack! 🚨</h1>
              <h1>🔷 Aqua-Print 21cm Honeycomb Frag Rack </h1>
              <h1>💎 Available Now at Reef-forge.uk 💎</h1>
              <ul className='list-disc list-inside mt-4'>
                <strong>✅ Innovative Honeycomb Design</strong>
                <li>Maximize coral placement with full usability of all frag holes!</li>
                <li>Designed to minimize shadowing and boost upward flow, perfect for SPS, LPS coral growth.</li>
              </ul>

              <ul className='list-disc list-inside mt-4'>
                <strong>✅ Heavy-Duty Magnets Included</strong>
                <li>Attach securely to glass up to 20mm thick—no slipping, no worries!</li>
                <li>Single magnet is all you need for a strong and sturdy hold but hey if you want two go for it!</li>
              </ul>

              <ul className='list-disc list-inside mt-4'>
                <strong>🌊 Stylish, Durable, and Functional</strong>
                <li>Polyreef frag racks combine aesthetics with performance to give your tank a professional edge.</li>
              </ul>

              <div className='mt-4'>
                <h1 className='text-sm'>📢 Grab yours now at the best price!</h1>
                <h1 className='text-sm'>👉 Visit REEFIN 3D to upgrade your reef tank today! </h1>
                <h1 className='text-sm'>✨ Do not miss out! Your reef deserves the best! ✨</h1>

              </div>

            </div>

          </div>

        </div>


      </div>

      <div className='h-px bg-slate-200 w-full mt-16'></div>

      <div className='flex flex-col mt-3 md:mt-4'>
        <div className='flex'>
        <h1 className={`text-center text-xl  w-full mb-8 md:mb-0 ${styles.otherHeadline} md:text-2xl`}> Reef Forge Products </h1>
        </div>

      </div>



      {/* <div className='my-40  flex-col ' ref={observedElement} >
        <h1 className=' text-center text-xl md:text-3xl'> Benifits </h1>
        <div className='my-5 flex  justify-center items-center'>


        </div>

      </div>

      <div className='my-40  flex-col ' ref={observedElement} >
        <h1 className=' text-center text-xl md:text-3xl'> FAQ </h1>
        <div className='my-5 flex  justify-center items-center'>


        </div>

      </div> */}

    </div>
  )
}

export default LandingPage
