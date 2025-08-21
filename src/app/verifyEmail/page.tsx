'use client'
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { Suspense } from "react";

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // ✅ Correct way

  useEffect(() => {
    verifyEmail()

  }, [])

  const verifyEmail = async () => {
    try {
      const res = await fetch(`/api/register?token=${token}`, {
        method: "POST"
      })

      const data = await res.json();
      console.log(data);

    }
    catch {


    }
  }
  return (

    <Suspense fallback={<p>Loading...</p>}>
      <div className='mb-72'>
        <h1 className='mt-32 font-semibold text-xl'>Thank you for verifying your email!</h1>

      </div>
    </Suspense>

  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyEmailContent />
    </Suspense>
  );
}