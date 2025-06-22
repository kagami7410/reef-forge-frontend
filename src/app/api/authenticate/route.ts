import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
    const res = await fetch(`${backendHostName}/backend/users/authenticate`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify(body),

      });
        return NextResponse.json(res, { status: res.status });

    
  } catch (error) {
    console.error("Error handling POST request:", error);
    // Send an error response
    return NextResponse.json({ error: "Something went wrong verifying qunatity!" }, { status: 500 });
  }
}