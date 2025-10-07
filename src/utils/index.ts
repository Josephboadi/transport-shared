// ============================================================================
// SHARED UTILITIES FOR BUS TRANSPORTATION PLATFORM
// ============================================================================

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { JwtPayload } from "../types";

export class Utils {
  // Password utilities
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate random strings
  static generateRandomString(length: number = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }

  static generateVerificationCode(length: number = 6): string {
    const digits = "0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += digits[Math.floor(Math.random() * digits.length)];
    }
    return code;
  }

  static generateTripCode(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `TR${dateStr}${random}`;
  }

  static generateBookingReference(): string {
    const prefix = "BK";
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  // Validation utilities
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  static isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  // Date utilities
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  static isFutureDate(date: Date): boolean {
    return date > new Date();
  }

  static isPastDate(date: Date): boolean {
    return date < new Date();
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static formatDateTime(date: Date): string {
    return date.toISOString();
  }

  static formatDateOnly(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  // Coordinate utilities
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Price calculation utilities
  static calculateTripPrice(
    basePrice: number,
    perStopPrice: number,
    stops: number,
    distanceBasedPricing: boolean = false,
    distance?: number
  ): number {
    let price = basePrice;

    if (distanceBasedPricing && distance) {
      price += distance * 0.5; // $0.50 per km
    } else {
      price += stops * perStopPrice;
    }

    return Math.round(price * 100) / 100; // Round to 2 decimal places
  }

  // JWT utilities
  static extractJwtPayload(token: string): JwtPayload | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
      return payload;
    } catch (error) {
      return null;
    }
  }

  static isTokenExpired(payload: JwtPayload): boolean {
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  // Time utilities
  static isValidTime(timeString: string): boolean {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    return timeRegex.test(timeString);
  }

  static timeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  }

  static minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  }

  // Array utilities
  static chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  static unique<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  static groupBy<T, K extends keyof any>(
    array: T[],
    key: (item: T) => K
  ): Record<K, T[]> {
    return array.reduce((groups, item) => {
      const groupKey = key(item);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<K, T[]>);
  }

  // String utilities
  static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  static truncate(
    text: string,
    length: number,
    suffix: string = "..."
  ): string {
    if (text.length <= length) return text;
    return text.slice(0, length - suffix.length) + suffix;
  }

  // Error utilities
  static createError(
    code: string,
    message: string,
    statusCode: number = 500,
    details?: any
  ): Error & { code: string; statusCode: number; details?: any } {
    const error = new Error(message) as any;
    error.code = code;
    error.statusCode = statusCode;
    error.details = details;
    return error;
  }

  // Validation utilities
  static validateRequired(
    obj: Record<string, any>,
    fields: string[]
  ): string[] {
    const missing: string[] = [];
    for (const field of fields) {
      if (
        obj[field] === undefined ||
        obj[field] === null ||
        obj[field] === ""
      ) {
        missing.push(field);
      }
    }
    return missing;
  }

  static sanitizeObject(
    obj: Record<string, any>,
    allowedFields: string[]
  ): Record<string, any> {
    const sanitized: Record<string, any> = {};
    for (const field of allowedFields) {
      if (obj[field] !== undefined) {
        sanitized[field] = obj[field];
      }
    }
    return sanitized;
  }

  // Async utilities
  static async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (attempt === maxAttempts) break;
        await this.delay(delayMs * attempt);
      }
    }

    throw lastError!;
  }

  // Environment utilities
  static getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (value === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value;
  }

  static getEnvNumber(key: string, defaultValue?: number): number {
    const value = process.env[key];
    if (value === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      throw new Error(`Environment variable ${key} must be a valid number`);
    }
    return parsed;
  }

  static getEnvBoolean(key: string, defaultValue?: boolean): boolean {
    const value = process.env[key];
    if (value === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value.toLowerCase() === "true";
  }
}

export default Utils;
