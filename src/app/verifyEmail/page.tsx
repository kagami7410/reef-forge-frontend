'use client'
import { error } from 'console';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // ✅ Correct way

    useEffect(() => {
        verifyEmail()

    },[])

    const verifyEmail = async () => {
        try{
            const res = await fetch(`/api/register?token=${token}`,{
                method: "POST"
            })

            const data = await res.json();
            console.log(data);

        }
        catch {


        }
    }
  return (
    <div className='mb-72'>
      <h1 className='mt-32 font-semibold text-xl'>Thank you for verifying your email!</h1>
      
    </div>
  )
}

export default page
