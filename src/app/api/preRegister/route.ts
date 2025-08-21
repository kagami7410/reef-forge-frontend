import { NextResponse } from "next/server";

export async function POST(request: Request){
        const backendHostName = process.env.REEF_FORGE_BACKEND_HOSTNAME
    
        const body = await request.json();
    
        // try {
        //   console.log("Parsed Body:", body); // Debug: Check the parsed data
        // } catch (error) {
        //   console.error("Error parsing JSON:", error);
        //   return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
        // }
      
      try {
        // console.log("Parsed Body of register request:", body); // Debug: Check the parsed data
        const res = await fetch(`${backendHostName}/backend/users/preRegister`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          if(res.status === 200){
          console.log("status from register request: " + res.status)
          }

            return NextResponse.json(res, { status: res.status });
    
        
      } catch (error) {
        console.error("Error handling POST request:", error);
        // Send an error response
        return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
      }

}