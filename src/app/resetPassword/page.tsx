'use client'
import { stat } from 'fs';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading/Loading';


const page = () => {

const [newPassword, setnewPassword] = useState("");
    const [newPassword2, setnewPassword2] = useState("");
      const searchParams = useSearchParams();
      const token = searchParams.get('token'); // ✅ Correct way
  const [showModalInvalid, setshowModalInvalid] = useState(false);
const [loading, setLoading] = useState(false)
  const [showModalValid, setshowModalValid] = useState(false);

 


    const resetPassword = async () => {
        setLoading(true)
        const res = fetch(`/api/resetPassword?token=${token}`,{
            method: "POST",
            body: JSON.stringify(
                { 
                    newPassword: newPassword
       
                })

        })

        const status =(await res).status
        console.log(status)
        if(status===200){
                setshowModalValid(true)
                console.log("email is not vaild or registered")       
             }
             else{
          setshowModalInvalid(true)

             }
             setLoading(false)
    }
  return (
            <div className='flex max-w-screen-2xl mt-10'>
                {loading ? <Loading/>: <div className='flex flex-col'>

                    <div className='flex flex-col bg-lime-100 w-96 rounded-2xl items-center p-4 h-96 shadow-xl'>
                        <Link href={'/'} className={`btn btn-ghost text-xl md:text-2xl md:ml-0 md:w-72`}> REEF FORGE</Link>
                        <h1 className='text-sm'>Password Reset</h1>

                        <input type="text" value={newPassword}
                            onChange={(e) => setnewPassword(e.target.value)}
                            required
                            placeholder="New Password" className="input m-1 mt-6" />



                        <input type="text" value={newPassword2}
                            onChange={(e) => setnewPassword2(e.target.value)}
                            required
                            placeholder="repeat Password" className="input m-1" />

{/* 
                        <div className='flex'>
                            <h3 className='text-sm'>Forgot password?</h3>
                            <a className='text-sm ml-2 hover:text-cyan-400 ' href=''>click here</a>

                        </div> */}



                        <button onClick={resetPassword} className='btn bg-violet-300 w-48 mt-8'>Reset</button>
                    </div>
                </div>}
 


                
                           {showModalValid ? <div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
            <div className='flex flex-col items-center'>
        <h1 className='text-xl font-semibold'>Password reset complete!</h1>

      
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



                       {showModalInvalid ? <div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
        <h1 className="font-bold text- md:text-lg"> Bad Request</h1>
        <h3 className=""> Reset password link may have expired!</h3>


        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button onClick={() => {
              setshowModalInvalid(!showModalInvalid)
            }}
              className="btn">Close</button>
          </form>
        </div>
      </div> : <></>}

            </div>
  )
}

export default page
