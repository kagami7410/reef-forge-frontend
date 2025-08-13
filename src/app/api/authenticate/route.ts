import { NextResponse, NextRequest } from "next/server";


export async function POST(request: NextRequest) {
  // const res = NextResponse.next(); // or NextResponse.redirect(), etc.

  const backendHostName = process.env.REEF_FORGE_BACKEND_HOSTNAME
  const body = await request.json();


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



    if (loginRes.status === 200) {
      
    const data = await loginRes.json();
    // console.log(token)
      console.log(data)
      console.log("Token received:", data.token)
      console.log("logged in successfully!")


    const response = NextResponse.json({ message: 'Logged in successfully' });

      // ✅ Correct way to set a cookie
        response.cookies.set('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60*60,
      });
      return response;
    }
    else {
      console.log("either password or email is incorrect")
    }

  } catch (error) {
    console.error("Error handling POST request:", error);
    // Send an error response
    return NextResponse.json({ error: "Something went wrong verifying qunatity!" }, { status: 500 });
  }
}