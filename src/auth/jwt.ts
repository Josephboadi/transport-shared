// import { NextFunction, Request, Response } from 'express';
// import jwt, { SignOptions } from 'jsonwebtoken';

// export interface JWTPayload {
//   userId: string;
//   email: string;
//   roles: string[];
//   permissions: string[];
//   iat?: number;
//   exp?: number;
// }

// export class JWTService {
//   private readonly secret: string;
//   private readonly expiresIn: string;

//   constructor(
//     secret: string = process.env.JWT_SECRET!,
//     expiresIn: string = '24h'
//   ) {
//     this.secret = secret;
//     this.expiresIn = expiresIn;
//   }

//   generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
//     return jwt.sign(payload, this.secret, {
//       expiresIn: this.expiresIn,
//     } as SignOptions);
//   }

//   verifyToken(token: string): JWTPayload {
//     return jwt.verify(token, this.secret) as JWTPayload;
//   }

//   refreshToken(token: string): string {
//     const payload = this.verifyToken(token);
//     const { iat, exp, ...refreshPayload } = payload;
//     return this.generateToken(refreshPayload);
//   }
// }

// // Middleware for JWT authentication
// export const authenticateToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: 'Access token required',
//     });
//   }

//   try {
//     const jwtService = new JWTService();
//     const decoded = jwtService.verifyToken(token);
//     (req as any).user = decoded;
//     next();
//   } catch (error) {
//     return res.status(403).json({
//       success: false,
//       message: 'Invalid or expired token',
//     });
//   }
// };
