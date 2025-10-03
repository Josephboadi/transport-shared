// // export interface User {
// //   id: string;
// //   email: string;
// //   phone?: string;
// //   firstName: string;
// //   lastName: string;
// //   password: string;
// //   userType: UserType;
// //   isActive: boolean;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // export enum UserType {
// //   PASSENGER = 'passenger',
// //   DRIVER = 'driver',
// //   ADMIN = 'admin',
// //   SUPER_ADMIN = 'super_admin',
// // }

// // export interface Location {
// //   id: string;
// //   name: string;
// //   address: string;
// //   latitude: number;
// //   longitude: number;
// //   locationType: LocationType;
// //   facilities: string[];
// //   operatingHours?: Record<string, { start: string; end: string }>;
// //   isActive: boolean;
// //   createdBy: string;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // export enum LocationType {
// //   PICKUP = 'pickup',
// //   DROPOFF = 'dropoff',
// //   BOTH = 'both',
// // }

// // export interface Route {
// //   id: string;
// //   routeName: string;
// //   routeCode: string;
// //   description?: string;
// //   pickupSequence: string[];
// //   dropoffSequence: string[];
// //   estimatedDurationMinutes: number;
// //   maxCapacity: number;
// //   operatingDays: number[];
// //   departureTimes: string[];
// //   basePrice: number;
// //   distanceBasedPricing: boolean;
// //   isActive: boolean;
// //   createdBy: string;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // export interface Trip {
// //   id: string;
// //   routeId: string;
// //   driverId?: string;
// //   tripCode: string;
// //   scheduledDate: Date;
// //   departureTime: string;
// //   status: TripStatus;
// //   currentLocationIndex: number;
// //   currentLocationStage: LocationStage;
// //   passengerCount: number;
// //   startedAt?: Date;
// //   completedAt?: Date;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // export enum TripStatus {
// //   SCHEDULED = 'scheduled',
// //   READY_FOR_BOARDING = 'ready_for_boarding',
// //   BOARDING = 'boarding',
// //   IN_PROGRESS = 'in_progress',
// //   COMPLETED = 'completed',
// //   CANCELLED = 'cancelled',
// //   DELAYED = 'delayed',
// // }

// // export enum LocationStage {
// //   PICKUP = 'pickup',
// //   DROPOFF = 'dropoff',
// // }

// // export interface Booking {
// //   id: string;
// //   tripId: string;
// //   userId: string;
// //   pickupLocationId: string;
// //   dropoffLocationId: string;
// //   verificationCode: string;
// //   qrCodeData: string;
// //   price: number;
// //   paymentStatus: PaymentStatus;
// //   bookingStatus: BookingStatus;
// //   boardedAt?: Date;
// //   droppedOffAt?: Date;
// //   specialRequirements: string[];
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // export enum PaymentStatus {
// //   PENDING = 'pending',
// //   COMPLETED = 'completed',
// //   FAILED = 'failed',
// //   REFUNDED = 'refunded',
// // }

// // export enum BookingStatus {
// //   CONFIRMED = 'confirmed',
// //   BOARDED = 'boarded',
// //   COMPLETED = 'completed',
// //   CANCELLED = 'cancelled',
// //   NO_SHOW = 'no_show',
// // }

// // export interface Role {
// //   id: string;
// //   name: string;
// //   displayName: string;
// //   description?: string;
// //   parentRoleId?: string;
// //   isSystemRole: boolean;
// //   isActive: boolean;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // export interface Permission {
// //   id: string;
// //   name: string;
// //   displayName: string;
// //   description?: string;
// //   resource: string;
// //   action: string;
// //   contextRequired: boolean;
// //   createdAt: Date;
// // }

// // export interface UserRole {
// //   id: string;
// //   userId: string;
// //   roleId: string;
// //   contextType?: string;
// //   contextId?: string;
// //   assignedBy: string;
// //   expiresAt?: Date;
// //   isActive: boolean;
// //   createdAt: Date;
// // }

// // Common types used across all services
// export interface BaseEntity {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface User extends BaseEntity {
//   email: string;
//   phone: string;
//   firstName: string;
//   lastName: string;
//   isActive: boolean;
//   roles: UserRole[];
// }

// export interface UserRole {
//   id: string;
//   userId: string;
//   roleId: string;
//   assignedBy: string;
//   expiresAt?: Date;
//   contextType?: string;
//   contextId?: string;
// }

// export interface Role extends BaseEntity {
//   name: string;
//   displayName: string;
//   description: string;
//   isSystemRole: boolean;
//   permissions: Permission[];
// }

// export interface Permission extends BaseEntity {
//   name: string;
//   displayName: string;
//   description: string;
//   resource: string;
//   action: string;
// }

// export interface Location extends BaseEntity {
//   name: string;
//   address: string;
//   latitude: number;
//   longitude: number;
//   locationType: LocationType;
//   facilities: string[];
//   operatingHours: Record<string, any>;
//   isActive: boolean;
//   createdBy: string;
// }

// export enum LocationType {
//   PICKUP = 'pickup',
//   DROPOFF = 'dropoff',
//   BOTH = 'both',
// }

// export interface Route extends BaseEntity {
//   routeName: string;
//   routeCode: string;
//   description: string;
//   pickupSequence: string[];
//   dropoffSequence: string[];
//   estimatedDurationMinutes: number;
//   maxCapacity: number;
//   operatingDays: number[];
//   departureTimes: string[];
//   basePrice: number;
//   distanceBasedPricing: boolean;
//   isActive: boolean;
//   createdBy: string;
// }

// export interface Trip extends BaseEntity {
//   routeId: string;
//   driverId?: string;
//   tripCode: string;
//   scheduledDate: Date;
//   departureTime: string;
//   status: TripStatus;
//   currentLocationIndex: number;
//   currentLocationType: LocationStage;
//   passengerCount: number;
//   startedAt?: Date;
//   completedAt?: Date;
// }

// export enum TripStatus {
//   SCHEDULED = 'scheduled',
//   READY_FOR_BOARDING = 'ready_for_boarding',
//   BOARDING = 'boarding',
//   IN_PROGRESS = 'in_progress',
//   COMPLETED = 'completed',
//   CANCELLED = 'cancelled',
//   DELAYED = 'delayed',
// }

// export enum LocationStage {
//   PICKUP = 'pickup',
//   DROPOFF = 'dropoff',
// }

// export interface Booking extends BaseEntity {
//   tripId: string;
//   userId: string;
//   pickupLocationId: string;
//   dropoffLocationId: string;
//   verificationCode: string;
//   qrCodeData: string;
//   price: number;
//   paymentStatus: PaymentStatus;
//   bookingStatus: BookingStatus;
//   boardedAt?: Date;
//   droppedOffAt?: Date;
//   specialRequirements: string[];
// }

// export enum BookingStatus {
//   CONFIRMED = 'confirmed',
//   BOARDED = 'boarded',
//   COMPLETED = 'completed',
//   CANCELLED = 'cancelled',
//   NO_SHOW = 'no_show',
// }

// export enum PaymentStatus {
//   PENDING = 'pending',
//   COMPLETED = 'completed',
//   FAILED = 'failed',
//   REFUNDED = 'refunded',
// }

// // API Response types
// export interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   message?: string;
//   errors?: string[];
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

// export interface PaginationQuery {
//   page?: number;
//   limit?: number;
//   sortBy?: string;
//   sortOrder?: 'asc' | 'desc';
//   search?: string;
// }

// // Service communication types
// export interface ServiceResponse<T = any> {
//   success: boolean;
//   data?: T;
//   error?: string;
//   statusCode: number;
// }
