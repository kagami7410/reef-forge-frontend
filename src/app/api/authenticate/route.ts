import { NextResponse } from "next/server";
import { NextApiRequest } from "next";

import cookie from 'cookie';

export async function POST(request: NextApiRequest) {
  const res = NextResponse.next(); // or NextResponse.redirect(), etc.

  const backendHostName = process.env.HIMALAYAN_COFFEE_BACKEND_HOSTNAME
  const body = await request.json();
  const { itemId, quantity } = body;

  // try {
  //   console.log("Parsed Body:", body); // Debug: Check the parsed data
  // } catch (error) {
  //   console.error("Error parsing JSON:", error);
  //   return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  // }

  try {
    console.log("Parsed Body:", body); // Debug: Check the parsed data
    const loginRes = await fetch(`${backendHostName}/backend/users/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

      },
      body: JSON.stringify(body),

    })

    const data = await loginRes.json();
    const token = data.token;
    // console.log(token)


    if (loginRes.status === 200) {
      console.log(data)

      console.log("Token received:", data.token)
      console.log("logged in successfully!")



      // ✅ Correct way to set a cookie
        res.cookies.set('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
    }
    else {
      console.log("either password or email is incorrect")
    }





    return NextResponse.json({ token }, { status: loginRes.status });


  } catch (error) {
    console.error("Error handling POST request:", error);
    // Send an error response
    return NextResponse.json({ error: "Something went wrong verifying qunatity!" }, { status: 500 });
  }
}