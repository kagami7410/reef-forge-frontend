import { NextApiRequest } from "next"
import { NextResponse } from "next/server";

export async function POST(request: NextApiRequest) {
      
    
    const body = await request.json();
    console.log(body)

    const backendHostName = process.env.HIMALAYAN_COFFEE_BACKEND_HOSTNAME

    try {
        const res = await fetch(`${backendHostName}/backend/fragRacks/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify(body),
        })

        return NextResponse.json(res, { status: 200 });

    } catch (error) {
        console.error("Error handling POST request:", error);
        // Send an error response
        return NextResponse.json({ error: "Something went wrong adding item!" }, { status: 500 });
      }

}