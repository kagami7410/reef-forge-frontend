import { NextResponse } from "next/server"

export async function GET(request: Request){
    const backendHostName = process.env.REEF_FORGE_BACKEND_HOSTNAME
          const { searchParams } = new URL(request.url);
          const email = searchParams.get('email')

    // try {
    //   console.log("Parsed Body:", body); // Debug: Check the parsed data
    // } catch (error) {
    //   console.error("Error parsing JSON:", error);
    //   return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    // }
  
  try {
    // console.log("Parsed Body from postOrder:"); // Debug: Check the parsed data
    const res = await fetch(`${backendHostName}/backend/users/restPasswordInit?email=${email}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
        return NextResponse.json(res, { status: res.status });

    
  } catch (error) {
    console.error("Error handling POST request:", error);
    // Send an error response
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }

}