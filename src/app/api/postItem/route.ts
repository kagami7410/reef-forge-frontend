import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
      
  const token = request.cookies.get("token")?.value;
    console.log(token)

    const body = await request.json();
    console.log("this should get items for posting")
    console.log(body)

    let res;

    const backendHostName = process.env.HIMALAYAN_COFFEE_BACKEND_HOSTNAME

    try {
         res = await fetch(`http://localhost:9080/backend/fragRacks/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `token=${token}`

            },
            body: JSON.stringify(body),
            
        })

    //         const response = await res.json();
    // console.log(response)


    } catch (error) {
        console.error("Error handling POST request:", error);
        // Send an error response
        return NextResponse.json({ error: "Something went wrong adding item!" }, { status: 500 });
      }

      if(res.status === 200){
                return NextResponse.json(res, { status: 200 });

      }
      else{
                return NextResponse.json(  "Something went wrong adding item!",  { status: res.status });

      }

}