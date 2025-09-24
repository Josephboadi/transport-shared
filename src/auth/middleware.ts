import { NextFunction, Request, Response } from 'express';
import { PermissionService } from '../permissions/permission-services';
import { JWTService } from './jwt';

export type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    email: string;
    // userType: string;
    roles: string[];
  };
};

export class AuthMiddleware {
  private jwtService = new JWTService();
  private permissionService = new PermissionService();

  authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.substring(7);
      const payload = this.jwtService.verifyToken(token);
      req.user = payload;

      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  requirePermission = (resource: string, action: string) => {
    return async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const hasPermission = await this.permissionService.checkPermission(
        req.user.userId,
        resource,
        action,
        req.params.id || req.body.contextId
      );

      if (!hasPermission) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          required: `${resource}.${action}`,
        });
      }

      next();
    };
  };
}
