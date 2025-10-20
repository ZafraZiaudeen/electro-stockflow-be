import { UserResource } from '@clerk/types';

/// <reference types="@clerk/express/env" />

export type Role = "admin";

declare global {
  namespace Express {
    interface Request {
      auth(): {
        userId: string | null;
        sessionId: string | null;
        getToken: () => Promise<string | null>;
        sessionClaims?: {
          metadata?: {
            role?: Role;
          };
        };
      };
      user?: UserResource;
    }
  }

  interface CustomJwtSessionClaims {
    metadata: {
      role?: Role;
    };
  }
}

export {};