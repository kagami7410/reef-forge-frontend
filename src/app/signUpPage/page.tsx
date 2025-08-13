'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

const Page = () => {


  const [showModalIvalid, setshowModalInvalid] = useState(false);
  const [showModalValid, setshowModalValid] = useState(false);

    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

  const router = useRouter() // may be null or a NextRouter instance

    const clickSignIn = async () => {
        const res = await fetch('/api/preRegister', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                { 
                    fullName: fullName,
                    email: userEmail,
                    password: password,
                })
        })

        if (res.status === 200) {
             const data = await res.json()

            console.log("Token received:", data.token)
            console.log("logged in successfully!")
            setshowModalValid(true)
            setFullName("")
            setPassword("")
            setUserEmail("")

        }
        else {
            setshowModalInvalid(true)
            console.log("email is not vaild")
        }
    }


    return (
        <>
            <div className='flex max-w-screen-2xl mt-10'>
                <div className='flex flex-col'>
                    <div className='flex flex-col bg-lime-100 w-96 rounded-2xl items-center p-4 h-96 shadow-xl'>
                        <Link href={'/'} className={`btn btn-ghost text-xl md:text-2xl md:ml-0 md:w-72`}> REEF FORGE</Link>
                        <h1 className='text-sm'>Sign Up to reef-forge</h1>

                        <input type="text" value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="Full Name" className="input m-1 mt-6" />



                        <input type="text" value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                            placeholder="Email" className="input m-1" />

                        <input type="password" placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required className="input m-1" />

                
{/* 
                        <div className='flex'>
                            <h3 className='text-sm'>Forgot password?</h3>
                            <a className='text-sm ml-2 hover:text-cyan-400 ' href=''>click here</a>

                        </div> */}



                        <button onClick={clickSignIn} className='btn bg-violet-300 w-48 mt-8'>Register</button>
                    </div>
                </div>

            </div>
     {showModalIvalid ? <div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
        <h3 className="font-bold text- md:text-lg"> Email Invaild!</h3>


        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button onClick={() => {
              router.push('/signUpPage')
              setshowModalInvalid(!showModalIvalid)
            }}
              className="btn">Close</button>
          </form>
        </div>
      </div> : <></>}



           {showModalValid ? <div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
            <div className='flex flex-col items-center'>
        <h1 className='text-xl font-semibold'>Verification link has been sent to your email</h1>
                <h1 className='m-2'>please verify it in 24 hours. Thank you!</h1>

      
    </div>


        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button onClick={() => {
              router.push('/signUpPage')
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
