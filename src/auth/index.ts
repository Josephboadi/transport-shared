import * as crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthTokens, JwtPayload, Permission, Role, User } from '../types';
import { Utils } from '../utils';

export interface JwtConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  issuer: string;
  audience: string;
}

export class AuthUtils {
  private static config: JwtConfig;

  public static initialize(config: JwtConfig): void {
    AuthUtils.config = config;
  }

  public static generateTokens(
    user: User,
    roles: Role[],
    permissions: Permission[]
  ): AuthTokens {
    const now = Math.floor(Date.now() / 1000);
    const accessTokenExpiry = AuthUtils.parseExpiry(
      AuthUtils.config.accessTokenExpiry
    );
    const refreshTokenExpiry = AuthUtils.parseExpiry(
      AuthUtils.config.refreshTokenExpiry
    );

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      userType: user.userType,
      roles: roles.map((role) => role.name),
      permissions: permissions.map((permission) => permission.name),
      iat: now,
      exp: now + accessTokenExpiry,
    };

    const accessToken = jwt.sign(payload, AuthUtils.config.accessTokenSecret, {
      issuer: AuthUtils.config.issuer,
      audience: AuthUtils.config.audience,
      expiresIn: AuthUtils.config.accessTokenExpiry,
    } as SignOptions);

    const refreshTokenPayload = {
      sub: user.id,
      type: 'refresh',
      iat: now,
      exp: now + refreshTokenExpiry,
    };

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      AuthUtils.config.refreshTokenSecret,
      {
        issuer: AuthUtils.config.issuer,
        audience: AuthUtils.config.audience,
        expiresIn: AuthUtils.config.refreshTokenExpiry,
      } as SignOptions
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiry,
      tokenType: 'Bearer',
    };
  }

  public static verifyAccessToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, AuthUtils.config.accessTokenSecret, {
        issuer: AuthUtils.config.issuer,
        audience: AuthUtils.config.audience,
      }) as JwtPayload;

      return decoded;
    } catch (error) {
      return null;
    }
  }

  public static verifyRefreshToken(
    token: string
  ): { sub: string; type: string } | null {
    try {
      const decoded = jwt.verify(token, AuthUtils.config.refreshTokenSecret, {
        issuer: AuthUtils.config.issuer,
        audience: AuthUtils.config.audience,
      }) as any;

      if (decoded.type !== 'refresh') {
        return null;
      }

      return {
        sub: decoded.sub,
        type: decoded.type,
      };
    } catch (error) {
      return null;
    }
  }

  public static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  public static isTokenExpired(payload: JwtPayload): boolean {
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  public static getTimeToExpiry(payload: JwtPayload): number {
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, payload.exp - now);
  }

  public static shouldRefreshToken(
    payload: JwtPayload,
    thresholdSeconds: number = 300
  ): boolean {
    const timeToExpiry = AuthUtils.getTimeToExpiry(payload);
    return timeToExpiry <= thresholdSeconds;
  }

  public static hasPermission(
    payload: JwtPayload,
    permission: string
  ): boolean {
    return payload.permissions.includes(permission);
  }

  public static hasRole(payload: JwtPayload, role: string): boolean {
    return payload.roles.includes(role);
  }

  public static hasAnyRole(payload: JwtPayload, roles: string[]): boolean {
    return roles.some((role) => payload.roles.includes(role));
  }

  public static hasAllRoles(payload: JwtPayload, roles: string[]): boolean {
    return roles.every((role) => payload.roles.includes(role));
  }

  public static hasAnyPermission(
    payload: JwtPayload,
    permissions: string[]
  ): boolean {
    return permissions.some((permission) =>
      payload.permissions.includes(permission)
    );
  }

  public static hasAllPermissions(
    payload: JwtPayload,
    permissions: string[]
  ): boolean {
    return permissions.every((permission) =>
      payload.permissions.includes(permission)
    );
  }

  public static generateSecureToken(length: number = 32): string {
    return Utils.generateRandomString(length);
  }

  public static generateEmailVerificationToken(): string {
    return Utils.generateRandomString(32);
  }

  public static generatePasswordResetToken(): string {
    return Utils.generateRandomString(32);
  }

  public static generatePhoneVerificationCode(): string {
    return Utils.generateVerificationCode(6);
  }

  private static parseExpiry(expiry: string): number {
    // Parse expiry string like "15m", "7d", "1h" into seconds
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid expiry format: ${expiry}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return value * multipliers[unit];
  }

  // Password strength validation
  public static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (password.length > 128) {
      errors.push('Password must be less than 128 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common patterns
    const commonPatterns = [
      /^(.)\1+$/, // Repeated characters
      /^(123|abc|qwer)/i, // Common sequences
      /^(password|letmein|admin)/i, // Common passwords
    ];

    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        errors.push('Password contains a common pattern and is not secure');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Rate limiting helpers
  public static generateRateLimitKey(
    identifier: string,
    action: string
  ): string {
    return `rate_limit:${action}:${identifier}`;
  }

  public static generateAttemptKey(identifier: string, action: string): string {
    return `attempts:${action}:${identifier}`;
  }

  // Session management helpers
  public static generateSessionId(): string {
    return Utils.generateRandomString(64);
  }

  public static generateCsrfToken(): string {
    return Utils.generateRandomString(32);
  }

  // Device fingerprinting
  public static async generateDeviceFingerprint(
    userAgent: string,
    ip: string
  ): Promise<string> {
    const combined = `${userAgent}:${ip}:${Date.now()}`;
    const hash = await Utils.hashPassword(combined);
    return hash.slice(0, 32);
  }

  // Token blacklist helpers
  public static generateBlacklistKey(tokenId: string): string {
    return `blacklist:${tokenId}`;
  }

  public static extractTokenId(token: string): string {
    try {
      const decoded = jwt.decode(token, { complete: true }) as any;
      return decoded.header.jti || decoded.sub;
    } catch (error) {
      // Use a simple hash for fallback instead of bcrypt
      return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')
        .slice(0, 16);
    }
  }
}

export default AuthUtils;
