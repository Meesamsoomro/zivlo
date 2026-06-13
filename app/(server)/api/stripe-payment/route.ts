import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken'

// Next.js automatically loads environment variables from .env files,
// so dotenv is not required.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    // You can specify the API version here if your TypeScript configuration requires it
    // apiVersion: '2023-10-16', 
});

export async function POST(req: Request) {
    try {
        // Parse the JSON body
        const { amount, productName, domain } = await req.json();
        const token = req.headers.get('Authorization')?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Verify token and get user
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

        if (!decoded || !decoded.id) {
            return NextResponse.json(
                { success: false, error: 'Invalid token' },
                { status: 401 }
            )
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "gbp",
                        product_data: {
                            name: productName,
                        },
                        unit_amount: Math.round(amount * 100), // convert to pence
                    },
                    quantity: 1,
                },
            ],
            success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domain}/failure`,
        });

        return NextResponse.json({
            success: true,
            data: session.url,
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}