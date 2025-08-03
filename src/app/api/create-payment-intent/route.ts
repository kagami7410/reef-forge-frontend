import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest){

    // Define a type for the item
    interface BasketItem {
    id: number;
    title: string;
    price: number;
    code: string;
    quantity: number;
    photoUrls: string[];
    stockQuantity: number;

    }
        try{
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


        console.log("requesting clientsecret.....")
        const {amount, basketItems, orderId} = await request.json();

        // You can serialize product info into metadata
        const metadata: Record<string, string> = {
            order_id: orderId,
            products: basketItems
            .map((item: BasketItem) => `${item.title} x ${item.quantity}`)
            .join(', '),
  };
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "gbp",
            metadata,
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