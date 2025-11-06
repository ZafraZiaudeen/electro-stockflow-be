import { Router, Request, Response, NextFunction } from 'express';
import { createClerkClient } from '@clerk/backend';
import { requireAuth } from '@clerk/express';

const router = Router();

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

const requireAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.auth()?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await clerkClient.users.getUser(userId);
    const userRole = user.publicMetadata?.role as string;

    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

router.get('/', requireAuth(), requireAdmin, async (req: Request, res: Response) => {
  try {
    const response = await clerkClient.users.getUserList({
      limit: 100,
    });

    const formattedUsers = response.data.map((user: any) => ({
      id: user.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User',
      email: user.emailAddresses[0]?.emailAddress || '',
      username: user.username || `@${user.firstName?.toLowerCase() || user.id.substring(0, 8)}`,
      role: (user.publicMetadata?.role as string) || 'viewer',
      status: user.banned ? 'inactive' : 'active',
      lastLogin: user.lastSignInAt ? new Date(user.lastSignInAt).toISOString().split('T')[0] : 'Never',
      createdAt: new Date(user.createdAt).toISOString().split('T')[0],
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/', requireAuth(), requireAdmin, async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, role } = req.body;

    if (!email || !firstName) {
      return res.status(400).json({ error: 'Email and first name are required' });
    }

    const validRoles = ['admin', 'warehouse_staff', 'viewer'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      publicMetadata: {
        role: role || 'viewer',
      },
      redirectUrl: (process.env.FRONTEND_URL || 'http://localhost:5173') + '/dashboard',
    });

    res.status(201).json({
      success: true,
      message: `Invitation sent to ${email}`,
      invitation: {
        id: invitation.id,
        email: email,
        role: role || 'viewer',
      },
    });
  } catch (error: any) {
    console.error('Error creating invitation:', error);
    
    if (error.errors?.[0]?.code === 'duplicate_record') {
      return res.status(400).json({
        error: 'A pending invitation already exists for this email address. Please check pending invitations or wait for the user to accept the existing invitation.'
      });
    }
    
    if (error.errors?.[0]?.code === 'form_identifier_exists') {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    res.status(500).json({
      error: 'Failed to create invitation',
      details: error.errors?.[0]?.message || error.message
    });
  }
});

router.patch('/:userId', requireAuth(), requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ['admin', 'warehouse_staff', 'viewer'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role,
      },
    });

    res.json({
      success: true,
      id: user.id,
      role: (user.publicMetadata?.role as string) || 'viewer',
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

router.patch('/:userId/status', requireAuth(), requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    let user;
    if (status === 'inactive') {
      user = await clerkClient.users.banUser(userId);
    } else {
      user = await clerkClient.users.unbanUser(userId);
    }

    res.json({
      success: true,
      id: user.id,
      status: user.banned ? 'inactive' : 'active',
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

router.delete('/:userId', requireAuth(), requireAdmin, async (req: any, res: Response) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.auth()?.userId;

    // Prevent admin from deleting themselves
    if (userId === requestingUserId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await clerkClient.users.deleteUser(userId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.post('/:userId/resend-invite', requireAuth(), requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await clerkClient.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    if (!email) {
      return res.status(400).json({ error: 'User has no email address' });
    }

    await clerkClient.invitations.createInvitation({
      emailAddress: email,
      publicMetadata: {
        role: (user.publicMetadata?.role as string) || 'viewer',
      },
      redirectUrl: (process.env.FRONTEND_URL || 'http://localhost:5173') + '/dashboard',
    });

    res.json({ success: true, message: 'Invitation resent successfully' });
  } catch (error) {
    console.error('Error resending invite:', error);
    res.status(500).json({ error: 'Failed to resend invitation' });
  }
});

router.post('/request-upgrade', requireAuth(), async (req: any, res: Response) => {
  try {
    const userId = req.auth()?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await clerkClient.users.getUser(userId);
    const userRole = user.publicMetadata?.role as string;

    if (userRole !== 'viewer') {
      return res.status(400).json({ error: 'Only viewers can request role upgrade' });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'viewer',
        upgradeRequest: {
          status: 'pending',
          requestedAt: new Date().toISOString(),
          requestedRole: 'warehouse_staff',
        },
      },
    });

    res.json({
      success: true,
      message: 'Upgrade request submitted successfully. An admin will review your request.',
    });
  } catch (error) {
    console.error('Error requesting upgrade:', error);
    res.status(500).json({ error: 'Failed to submit upgrade request' });
  }
});

router.get('/upgrade-requests', requireAuth(), requireAdmin, async (req: Request, res: Response) => {
  try {
    const response = await clerkClient.users.getUserList({
      limit: 100,
    });

    const pendingRequests = response.data
      .filter((user: any) => user.publicMetadata?.upgradeRequest?.status === 'pending')
      .map((user: any) => ({
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User',
        email: user.emailAddresses[0]?.emailAddress || '',
        username: user.username || `@${user.firstName?.toLowerCase() || user.id.substring(0, 8)}`,
        currentRole: user.publicMetadata?.role as string,
        requestedRole: user.publicMetadata?.upgradeRequest?.requestedRole as string,
        requestedAt: user.publicMetadata?.upgradeRequest?.requestedAt as string,
      }));

    res.json(pendingRequests);
  } catch (error) {
    console.error('Error fetching upgrade requests:', error);
    res.status(500).json({ error: 'Failed to fetch upgrade requests' });
  }
});

router.post('/:userId/approve-upgrade', requireAuth(), requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await clerkClient.users.getUser(userId);
    const upgradeRequest = user.publicMetadata?.upgradeRequest as any;

    if (!upgradeRequest || upgradeRequest.status !== 'pending') {
      return res.status(400).json({ error: 'No pending upgrade request found' });
    }

    // Update user role to warehouse_staff and remove upgrade request
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'warehouse_staff',
        upgradeRequest: null,
      },
    });

    res.json({
      success: true,
      message: 'Upgrade request approved successfully',
    });
  } catch (error) {
    console.error('Error approving upgrade:', error);
    res.status(500).json({ error: 'Failed to approve upgrade request' });
  }
});

router.post('/:userId/reject-upgrade', requireAuth(), requireAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await clerkClient.users.getUser(userId);
    const upgradeRequest = user.publicMetadata?.upgradeRequest as any;

    if (!upgradeRequest || upgradeRequest.status !== 'pending') {
      return res.status(400).json({ error: 'No pending upgrade request found' });
    }

    // Remove upgrade request
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'viewer',
        upgradeRequest: null,
      },
    });

    res.json({
      success: true,
      message: 'Upgrade request rejected',
    });
  } catch (error) {
    console.error('Error rejecting upgrade:', error);
    res.status(500).json({ error: 'Failed to reject upgrade request' });
  }
});

router.post('/initialize-role', requireAuth(), async (req: any, res: Response) => {
  try {
    const userId = req.auth()?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await clerkClient.users.getUser(userId);
    const userRole = user.publicMetadata?.role as string;

    // Only assign role if user doesn't have one
    if (userRole) {
      return res.json({
        success: true,
        role: userRole,
        message: 'Role already assigned',
      });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'viewer',
      },
    });

    console.log(`Assigned "viewer" role to user ${userId} via initialize-role endpoint`);

    res.json({
      success: true,
      role: 'viewer',
      message: 'Viewer role assigned successfully',
    });
  } catch (error) {
    console.error('Error initializing role:', error);
    res.status(500).json({ error: 'Failed to initialize role' });
  }
});

export default router;