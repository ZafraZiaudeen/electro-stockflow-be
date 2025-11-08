import { Router, Request, Response } from 'express';
import { Webhook } from 'svix';
import { createClerkClient } from '@clerk/backend';

const router = Router();
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

/**
 * POST /api/webhooks/clerk - Handle Clerk webhook events
 * Automatically assign "viewer" role to new users
 */
router.post('/clerk', async (req: Request, res: Response): Promise<void> => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error('CLERK_WEBHOOK_SECRET is not set');
      res.status(500).json({ error: 'Webhook secret not configured' });
      return;
    }

    // Get headers
    const svix_id = req.headers['svix-id'] as string;
    const svix_timestamp = req.headers['svix-timestamp'] as string;
    const svix_signature = req.headers['svix-signature'] as string;

    // Verify webhook signature
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: any;

    try {
      evt = wh.verify(JSON.stringify(req.body), {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      res.status(400).json({ error: 'Invalid webhook signature' });
      return;
    }

    // Handle the event
    const { type, data } = evt;

    if (type === 'user.created') {
      console.log('New user created:', data.id);

      // Automatically assign "viewer" role to new users
      try {
        await clerkClient.users.updateUserMetadata(data.id, {
          publicMetadata: {
            role: 'viewer',
          },
        });
        console.log(`Assigned "viewer" role to user ${data.id}`);
      } catch (error) {
        console.error('Error assigning viewer role:', error);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;