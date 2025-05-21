import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export async function POST(request: NextRequest){
    try{
        console.log("requesting clientsecret.....")
        const {amount} = await request.json();
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "gbp",
            automatic_payment_methods: {enabled:true},
        });

        console.log("payment: " + paymentIntent.client_secret)

        return NextResponse.json({ clientSecret: paymentIntent.client_secret})
    }

    catch (error){
        console.error(error)
        return NextResponse.json(
        {error: `Internal Server Error: ${error}`},
        {status: 500}
        );
 
    }
}