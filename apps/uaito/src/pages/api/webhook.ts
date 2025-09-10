import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import crypto from 'crypto';
import { createUser } from '@/db/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

const generateSecurePassword = (length: number = 16): string => {
  return crypto.randomBytes(length).toString('hex');
};



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const chunks: Uint8Array[] = [];

    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }

    const rawBody = Buffer.concat(chunks);
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'customer.created':
        const customer = event.data.object as Stripe.Customer;
        const username = customer.email!;
        const name = customer.name!;
        const password = generateSecurePassword();
        try {
          const newUser = await createUser(username, name, password);
          console.log('New user created:', newUser);
        } catch (error: any) {
          console.error('Error creating user:', error.message);
          return res.status(500).json({ error: 'Failed to create user' });
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}