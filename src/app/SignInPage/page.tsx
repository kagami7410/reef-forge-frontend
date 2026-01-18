'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import Loading from '../components/Loading/Loading';

const Page = () => {


const [loading, setLoading] = useState(false)

    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
  const [showModalIvalid, setshowModalInvalid] = useState(false);
  const [showModalValid, setshowModalValid] = useState(false);
    const router = useRouter() // may be null or a NextRouter instance

    const clickSignIn = async () => {
              setLoading(true)

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
            console.log("logged in successfully!")

            // Small delay to ensure cookie is set before reload
            await new Promise(resolve => setTimeout(resolve, 100));

            // Navigate to home page instead of reload to ensure clean state
            window.location.href = '/';

        }
        else {
                setshowModalInvalid(true)

            console.log("either password or email is incorrect")
        }
                     setLoading(false)

    }

    


    return (
        <>

        {loading ? <Loading/>:
                    <div className='flex flex-col md:flex-row max-w-screen-2xl mt-10'>
                <div className='flex flex-col'>
                    <div className='flex flex-col bg-lime-100 w-96 rounded-l-2xl items-center p-4 h-96 shadow-xl'>
                        <Link href={'/'} className={`btn btn-ghost text-xl md:text-2xl md:ml-0 md:w-72`}> REEF FORGE</Link>
                        <h1 className='text-sm'>Sign In to reef-forge</h1>


                        <input type="text" value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                            placeholder="Email" className="input m-2 mt-8" />

                        <input type="password" placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required className="input m-2" />

                        <div className='flex'>
                            <h3 className='text-sm'>Forgot password?</h3>
                            <a  className='text-sm ml-2 hover:text-cyan-400 ' href='resetPasswordInit'>click here</a>

                        </div>



                        <button onClick={clickSignIn} className='btn shadow-lg  bg-violet-300 w-48 mt-8'>Sign In</button>
                    </div>
                </div>
                                    <div className='flex flex-col bg-lime-100 w-96 md:w-60 shadow-xl  md:pt-28 p-4 h-40 md:h-96'>

                        <div className='flex flex-col items-center '>
                            <h3 className='text-sm'>New Customer?</h3>
                            <a className='text-sm ml-2 shadow-xl w-48 hover:text-cyan-400 btn bg-orange-200 hover:bg-orange-300 hover:text-slate-800' href='/signUpPage'>Create Account</a>

                        </div>
                        </div>
            </div>}


                           {showModalIvalid ? <div className="z-30 flex-col items-center flex modal-box fixed top-1/4 left-1/2 -translate-x-1/2  m-auto bg-slate-200">
        <h3 className="font-bold text- md:text-lg"> Email or Password incorrect!</h3>


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
              router.push('/')
            }}
              className="btn">Lets Shop!</button>
          </form>
        </div>
      </div> : <></>}



        </>
    )
}

export default Page
