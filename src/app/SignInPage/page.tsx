'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const Page = () => {



    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");


    const clickSignIn = async () => {
        const res = await fetch('/api/authenticate', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                { 
                    email: userEmail,
                    password: password,
                })
        })

        if (res.status === 200) {
             const data = await res.json()

            console.log("Token received:", data.token)
            console.log("logged in successfully!")
            window.location.reload()
        }
        else {
            console.log("either password or email is incorrect")
        }
    }


    return (
        <>
            <div className='flex max-w-screen-2xl mt-10'>
                <div className='flex flex-col'>
                    <div className='flex flex-col bg-lime-100 w-96 rounded-lg items-center p-4 h-96'>
                        <Link href={'/'} className={`btn btn-ghost text-xl md:text-2xl md:ml-0 md:w-72`}> REEF FORGE</Link>
                        <h1 className='text-sm'>Sign In to reef-forge</h1>


                        <input type="text" value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                            placeholder="Email" className="input m-2 mt-8" />

                        <input type="text" placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
