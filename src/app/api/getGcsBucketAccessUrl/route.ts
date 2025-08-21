import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const backendHostName = process.env.REEF_FORGE_BACKEND_HOSTNAME
    const body = await request.json();

    // console.log(body)

    try {
        const res = await fetch(`${backendHostName}/backend/gcsBucket/get/signed-url`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify(body),
        })


        if (res.status === 200) {
            const data = await res.json();
            console.log(data)
            return NextResponse.json({ data }, { status: res.status });
        }

        else{
            return NextResponse.json("error ", { status: res.status });

        }



    }
    catch (error) {
        console.error("Error handling POST request:", error);
        // Send an error response
        return NextResponse.json({ error: "Something went wrong verifying qunatity!" }, { status: 500 });
    }
}