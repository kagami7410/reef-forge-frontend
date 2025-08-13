import { NextRequest, NextResponse } from 'next/server';


export async function GET(req:NextRequest) {
    const backendHostName = process.env.REEF_FORGE_BACKEND_HOSTNAME
    const cookieHeader = req.headers.get("cookie");
    try{
        console.log(`trying to get user orders`)
        const res = await fetch(`${backendHostName}/backend/orders/getUserOrder`,{
            method: "GET",
        headers: {
            Cookie: cookieHeader
        },
    });
        const data = await res.json();
        console.log(data)
        return NextResponse.json({data, status: res.status})
    }
    catch(error) {
        console.error(error); // Use the error
        return NextResponse.json({ error: 'Failed to get request' }, { status: 500 });
    }


}