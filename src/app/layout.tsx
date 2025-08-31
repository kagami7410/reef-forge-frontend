import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './components/NavBar/NavBar'
import BasketProvider from './components/BasketContext/BasketContext';
import Footer from './components/Footer/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Reef Forge',
  description: ' Transform Your Reef Tank with the Ultimate Affordable Magnetic Frag Rack! Innovative Honeycomb Design. Maximize coral placement with full usability of all frag holes !Designed to minimize shadowing and boost upward flow, perfect for SPS, LPS coral growth.✅ Heavy-Duty Magnets Included; Attaches securely to glass up to 18mm thick—no slipping, no worries! Magnets: N52 Neodymium magnets (2 pairs) Tested: String & Steady hold on Glass thickness up to 3/4" inch! Double magnets included giving strong and sturdy hold up to 10kg! 🌊 Stylish, Durable, and Functional. Reef safe PETG plastic used for material.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className={`${inter.className}flex-col flex w-full`}>
        {/* <main>
          <article>
            
          </article>
        </main> */}

        <div className='flex w-full flex-col items-center'>
                    <h2 className='flex w-full justify-center pb-1 md:pb-2 pt-1 flex fixed top-0 z-40 bg-orange-300'>Free Delivery on order over £50</h2>

          <header></header>
          <BasketProvider>
            <div className='flex-col flex fixed top-8  bg-slate-50 w-full h-20 bg-100 z-40 right-0 '>
              <NavBar />
 
            </div>

            <div className=' bg-slate-200 shadow-2xl h-px'></div>
            <div className=' flex flex-col   mt-24  max-w-screen-2xl '>
              {children}
            </div>
          </BasketProvider>



        <div className='flex  w-full  mt-56 justify-center items-center'>
          <Footer />


        </div>

        </div>


      </body>
    </html>



  )
}
