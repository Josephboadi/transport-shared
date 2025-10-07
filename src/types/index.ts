// ============================================================================
// SHARED TYPES FOR BUS TRANSPORTATION PLATFORM
// ============================================================================

export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  profileImageUrl?: string;
  dateOfBirth?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseExpiryDate: Date;
  vehicleId?: string;
  status: DriverStatus;
  rating?: number;
  totalTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  backgroundCheckDate?: Date;
  backgroundCheckStatus?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  color?: string;
  insurancePolicyNumber: string;
  insuranceExpiryDate: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  locationType: LocationType;
  facilities: string[];
  operatingHours?: Record<string, { open: string; close: string }>;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Route {
  id: string;
  routeName: string;
  routeCode: string;
  description?: string;
  estimatedDurationMinutes: number;
  maxCapacity: number;
  operatingDays: number[];
  departureTimes: string[];
  basePrice: number;
  perStopPrice: number;
  distanceBasedPricing: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Trip {
  id: string;
  routeId: string;
  driverId?: string;
  tripCode: string;
  scheduledDate: Date;
  departureTime: string;
  status: TripStatus;
  currentLocationId?: string;
  currentLocationIndex: number;
  currentLocationStage: LocationStage;
  passengerCount: number;
  availableSeats: number;
  actualDepartureTime?: Date;
  actualArrivalTime?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancellationReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  tripId: string;
  userId: string;
  pickupLocationId: string;
  dropoffLocationId: string;
  verificationCode: string;
  qrCodeData: string;
  price: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  specialRequirements: string[];
  boardedAt?: Date;
  droppedOffAt?: Date;
  rating?: number;
  feedback?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  parentRoleId?: string;
  isSystemRole: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  resource: string;
  action: string;
  contextRequired: boolean;
  createdAt: Date;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  contextType?: string;
  contextId?: string;
  assignedBy?: string;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  userType: UserType;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface SessionData {
  userId: string;
  email: string;
  userType: UserType;
  roles: Role[];
  permissions: Permission[];
  tokens: AuthTokens;
  createdAt: Date;
  lastAccessedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    statusCode: number;
  };
}

// Enums
export enum UserType {
  PASSENGER = "PASSENGER",
  DRIVER = "DRIVER",
  ADMIN = "ADMIN",
  SYSTEM = "SYSTEM",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
}

export enum LocationType {
  PICKUP = "PICKUP",
  DROPOFF = "DROPOFF",
  BOTH = "BOTH",
}

export enum TripStatus {
  SCHEDULED = "SCHEDULED",
  READY_FOR_BOARDING = "READY_FOR_BOARDING",
  BOARDING = "BOARDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  DELAYED = "DELAYED",
}

export enum LocationStage {
  PICKUP = "PICKUP",
  DROPOFF = "DROPOFF",
}

export enum BookingStatus {
  CONFIRMED = "CONFIRMED",
  BOARDED = "BOARDED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export enum PaymentMethods {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  DIGITAL_WALLET = "DIGITAL_WALLET",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH = "CASH",
}

export enum DriverStatus {
  AVAILABLE = "AVAILABLE",
  ON_TRIP = "ON_TRIP",
  OFF_DUTY = "OFF_DUTY",
  SUSPENDED = "SUSPENDED",
}

export enum NotificationType {
  TRIP_ASSIGNED = "TRIP_ASSIGNED",
  TRIP_REMINDER = "TRIP_REMINDER",
  TRIP_CANCELLED = "TRIP_CANCELLED",
  TRIP_DELAYED = "TRIP_DELAYED",
  BOOKING_CONFIRMED = "BOOKING_CONFIRMED",
  PAYMENT_SUCCESSFUL = "PAYMENT_SUCCESSFUL",
  SYSTEM_ALERT = "SYSTEM_ALERT",
}

export enum NotificationChannel {
  PUSH = "PUSH",
  EMAIL = "EMAIL",
  SMS = "SMS",
  IN_APP = "IN_APP",
}

// Error codes
export enum ErrorCodes {
  // Auth errors
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_INVALID = "TOKEN_INVALID",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",

  // Validation errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",

  // Resource errors
  NOT_FOUND = "NOT_FOUND",
  ALREADY_EXISTS = "ALREADY_EXISTS",
  CONFLICT = "CONFLICT",

  // System errors
  INTERNAL_ERROR = "INTERNAL_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",

  // Business logic errors
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  RESOURCE_LOCKED = "RESOURCE_LOCKED",
  OPERATION_NOT_ALLOWED = "OPERATION_NOT_ALLOWED",
}

// HTTP Status Codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}
