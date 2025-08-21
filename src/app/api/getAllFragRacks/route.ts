import { NextRequest, NextResponse } from 'next/server';


export async function GET(req:NextRequest) {
    const backendHostName = process.env.REEF_FORGE_BACKEND_HOSTNAME

    try{
        console.log(`trying to getAll the items`)
        const { searchParams } = new URL(req.url);
        const pageNumber = searchParams.get('pageNumber'); // Extract 'corqalType' from query   
        const pageSize = searchParams.get('pageSize'); // Extract 'corqalType' from query        console.log('pageNumber: ',  req.query)
        const res = await fetch(`${backendHostName}/backend/fragRacks/getByPage?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        const data = await res.json();
        // console.log(data)
        return NextResponse.json({data, status: res.status})
    }
    catch(error) {
        console.error(error); // Use the error
        return NextResponse.json({ error: 'Failed to get request' }, { status: 500 });
    }


}