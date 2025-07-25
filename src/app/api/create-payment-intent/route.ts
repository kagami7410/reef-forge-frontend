import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest){
        try{
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-03-31.basil", // or the version you are using
    });


        console.log("requesting clientsecret.....")
        const {amount} = await request.json();
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "gbp",
            automatic_payment_methods: {enabled:true},
        });

        console.log("payment intent from api: " + paymentIntent.client_secret)

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