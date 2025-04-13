import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './components/NavBar/NavBar'
import BasketProvider from './components/BasketContext/BasketContext';
import Footer from './components/Footer/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Reef Forge',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className={inter.className}>

        <header>

        </header>
        <BasketProvider> 
        <h2 className='flex justify-center pb-1 md:pb-2 pt-1 bg-orange-300'>Free Delivery on order over £50</h2>

        <NavBar/>
        <div className=' bg-slate-300 w-full h-px'></div>

        {children}
        </BasketProvider>
        <Footer/>

        </body>

    </html>


  )
}
