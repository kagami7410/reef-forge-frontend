'use client'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'


const page = () => {

const [newPassword, setnewPassword] = useState("");
    const [newPassword2, setnewPassword2] = useState("");
      const searchParams = useSearchParams();
      const token = searchParams.get('token'); // ✅ Correct way


 


    const resetPassword = async () => {
        const res = fetch(`/api/resetPassword?token=${token}`,{
            method: "POST",
            body: JSON.stringify(
                { 
                    newPassword: newPassword
       
                })

        })
    }
  return (
            <div className='flex max-w-screen-2xl mt-10'>
                <div className='flex flex-col'>
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
                </div>

            </div>
  )
}

export default page
