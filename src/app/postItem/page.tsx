'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const Page = () => {

    interface AuthenticateRequest {
        userEmail: string;
        password: string;
    }

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");





    const clickSignIn = async () => {
        // const res = await fetch('/api/authenticate', {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(
        //         { 
        //             email: userEmail,
        //             password: password,
        //         })
        // })

        // if (res.status === 200) {
        //     console.log("logged in successfully!")
        // }
        // else {
        //     console.log("either password or email is incorrect")
        // }
    }


    // console.log(userEmail + password)

    return (
        <>
            <div className='flex max-w-screen-2xl mt-10'>
                <div className='flex flex-col'>
                    <div className='flex flex-col bg-lime-100 w-96 rounded-lg items-center p-4 h-96'>
                        <Link href={'/'} className={`btn btn-ghost text-xl md:text-2xl md:ml-0 md:w-72`}> REEF FORGE </Link>
                        <h1 className='text-sm'>  </h1>

              <h1 className='text-lg font-bold font-sans text-slate-800 mt-3 w-full'>Title</h1>

                        <input type="text" value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Title" className="input m-2" />
              <h1 className='text-lg font-bold font-sans text-slate-800 mt-3 w-full'>Description</h1>

                        <input type="text" placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required className="input m-2" />

                        <div className='flex'>
                            <h3 className='text-sm'>Forgot password?</h3>
                            <a className='text-sm ml-2 hover:text-cyan-400' href=''>click here</a>
                        </div>
                        <button onClick={clickSignIn} className='btn w-48 mt-4'>Sign In</button>
                    </div>
                </div>

            </div>

        </>
    )
}

export default Page
