import jwt, { SignOptions } from 'jsonwebtoken';
import { User, UserRole } from '../types';

export interface JwtPayload {
  userId: string;
  email: string;
  userType: string;
  roles: string[];
}

export class JwtService {
  private readonly secretKey = process.env.JWT_SECRET!;
  private readonly expiresIn = process.env.JWT_EXPIRES_IN || '24h';

  generateToken(user: User, roles: UserRole[]): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      userType: user.userType,
      roles: roles.map((ur) => ur.roleId),
    };

    return jwt.sign(payload, this.secretKey, {
      expiresIn: this.expiresIn,
    } as SignOptions);
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.secretKey) as JwtPayload;
  }
}
