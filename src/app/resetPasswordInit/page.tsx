'use client'
import Link from 'next/link'
import React, { useState } from 'react'

const Page = () => {
        const [userEmail, setUserEmail] = useState("");


  const [showModalIvalid, setshowModalInvalid] = useState(false);
  const [showModalValid, setshowModalValid] = useState(false);

  
        const resetPasswordInit = async () => {
            const res = await fetch(`/api/resetPasswordInit?email=${userEmail}`)

            const status = await res.status
            if(status !== 200){
                setshowModalInvalid(true)
                console.log("email is not vaild or registered")
            }
            else{
                setshowModalValid(true)
            }
            
        }
    
  return (
<>

            <div className='flex max-w-screen-2xl mt-10'>
                <div className='flex flex-col'>
                    <div className='flex flex-col bg-lime-100 w-96 rounded-l-2xl items-center p-4 h-96 shadow-xl'>
                        <Link href={'/'} className={`btn btn-ghost text-xl md:text-2xl md:ml-0 md:w-72`}> REEF FORGE</Link>
                        <h1 className='text-sm'>Send reset password link to your email </h1>


                        <input type="text" value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                            placeholder="Your registered email" className="input m-2 mt-8" />





                        <button onClick={resetPasswordInit} className='btn  bg-violet-300 w-48 mt-8'> Send</button>
                    </div>
                </div>
                                  
            </div>

                 {showModalIvalid ? <div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
        <h3 className="font-bold text- md:text-lg"> Email Invaild!</h3>


        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button onClick={() => {
              setshowModalInvalid(!showModalIvalid)
            }}
              className="btn">Close</button>
          </form>
        </div>
      </div> : <></>}



           {showModalValid ? <div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
            <div className='flex flex-col items-center'>
        <h1 className='text-xl font-semibold'>Password reset link has been sent to your email</h1>
                <h1 className='m-2'>please reset you password within 24 hours. Thank you!</h1>

      
    </div>


        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button onClick={() => {
              setshowModalValid(!showModalValid)
            }}
              className="btn">Close</button>
          </form>
        </div>
      </div> : <></>}
</>
  )
}

export default Page
