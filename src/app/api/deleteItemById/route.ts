import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest){
        const backendHostName = process.env.REEF_FORGE_BACKEND_HOSTNAME
        // Extract query parameters from the URL
        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get('itemId'); // Extract 'corqalType' from query

    try{
        console.log(`trying to delete item with id: ${itemId}`)
        const res = await fetch(`${backendHostName}/backend/fragRacks/deleteById?itemId=${itemId}`,
                  {method: "DELETE"}

        );
        const data = await res.json();
        console.log(data)
        return NextResponse.json(data, { status: 200 });
    }
    catch(error) {
        console.error(error); // Use the error
        return NextResponse.json({ error: 'Failed to get request' }, { status: 500 });
    }
}