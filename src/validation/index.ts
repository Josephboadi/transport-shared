// ============================================================================
// SHARED VALIDATION SCHEMAS FOR BUS TRANSPORTATION PLATFORM
// ============================================================================

import { z } from "zod";

// ============================================================================
// COMMON VALIDATORS & ENUMS
// ============================================================================

// Enums matching Prisma schema
export const UserStatus = z.enum([
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "PENDING_VERIFICATION",
]);

export const UserType = z.enum(["PASSENGER", "DRIVER", "ADMIN", "SYSTEM"]);

export const LocationType = z.enum(["PICKUP", "DROPOFF", "BOTH"]);

export const TripStatus = z.enum([
  "SCHEDULED",
  "READY_FOR_BOARDING",
  "BOARDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "DELAYED",
]);

export const LocationStage = z.enum(["PICKUP", "DROPOFF"]);

export const BookingStatus = z.enum([
  "CONFIRMED",
  "BOARDED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

export const PaymentStatus = z.enum([
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
]);

export const PaymentMethodEnum = z.enum([
  "CREDIT_CARD",
  "DEBIT_CARD",
  "DIGITAL_WALLET",
  "BANK_TRANSFER",
  "CASH",
]);

export const DriverStatus = z.enum([
  "AVAILABLE",
  "ON_TRIP",
  "OFF_DUTY",
  "SUSPENDED",
]);

export const NotificationType = z.enum([
  "TRIP_ASSIGNED",
  "TRIP_REMINDER",
  "TRIP_CANCELLED",
  "TRIP_DELAYED",
  "BOOKING_CONFIRMED",
  "PAYMENT_SUCCESSFUL",
  "SYSTEM_ALERT",
]);

export const NotificationChannel = z.enum(["PUSH", "EMAIL", "SMS", "IN_APP"]);

// Common validators
export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email().max(255);
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/)
  .max(20);
export const positiveInt = z.number().int().positive();
export const nonNegativeInt = z.number().int().min(0);
export const currencyAmount = z.number().min(0).multipleOf(0.01);
export const ratingSchema = z.number().min(0).max(5).multipleOf(0.01);
export const percentageSchema = z.number().min(0).max(100).multipleOf(0.01);

// Coordinate validators
export const latitudeSchema = z.number().min(-90).max(90);
export const longitudeSchema = z.number().min(-180).max(180);

// Date/Time validators
export const dateSchema = z.string().datetime();
export const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const timeSchema = z
  .string()
  .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/);

// ============================================================================
// AUTH SERVICE SCHEMAS
// ============================================================================

export const registerUserSchema = z.object({
  email: emailSchema,
  phoneNumber: phoneSchema.optional(),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character"
    ),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  userType: UserType.default("PASSENGER"),
  dateOfBirth: dateOnlySchema.optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .max(128)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  token: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export const verifyPhoneSchema = z.object({
  code: z
    .string()
    .length(6)
    .regex(/^\d{6}$/),
});

// ============================================================================
// USER SERVICE SCHEMAS
// ============================================================================

export const updateUserProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phoneNumber: phoneSchema.optional(),
  profileImageUrl: z.string().url().optional(),
  dateOfBirth: dateOnlySchema.optional(),
});

export const updateUserStatusSchema = z.object({
  status: UserStatus,
});

export const userQuerySchema = z.object({
  page: positiveInt.default(1),
  limit: positiveInt.max(100).default(20),
  status: UserStatus.optional(),
  userType: UserType.optional(),
  search: z.string().max(255).optional(),
  sortBy: z.enum(["createdAt", "lastName", "email"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================================================
// DRIVER SERVICE SCHEMAS
// ============================================================================

export const createDriverSchema = z.object({
  userId: uuidSchema,
  licenseNumber: z.string().min(1).max(50),
  licenseExpiryDate: dateOnlySchema,
  emergencyContactName: z.string().min(1).max(255),
  emergencyContactPhone: phoneSchema,
  backgroundCheckDate: dateOnlySchema.optional(),
  backgroundCheckStatus: z.string().max(50).optional(),
});

export const updateDriverSchema = z.object({
  licenseNumber: z.string().min(1).max(50).optional(),
  licenseExpiryDate: dateOnlySchema.optional(),
  vehicleId: uuidSchema.optional(),
  status: DriverStatus.optional(),
  emergencyContactName: z.string().min(1).max(255).optional(),
  emergencyContactPhone: phoneSchema.optional(),
  backgroundCheckDate: dateOnlySchema.optional(),
  backgroundCheckStatus: z.string().max(50).optional(),
  isActive: z.boolean().optional(),
});

export const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1).max(50),
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  capacity: positiveInt.max(100),
  color: z.string().max(50).optional(),
  insurancePolicyNumber: z.string().min(1).max(100),
  insuranceExpiryDate: dateOnlySchema,
  lastMaintenanceDate: dateOnlySchema.optional(),
  nextMaintenanceDate: dateOnlySchema.optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const uploadDriverDocumentSchema = z.object({
  documentType: z.enum([
    "LICENSE",
    "INSURANCE",
    "REGISTRATION",
    "BACKGROUND_CHECK",
    "OTHER",
  ]),
  documentUrl: z.string().url(),
  expiryDate: dateOnlySchema.optional(),
});

export const assignDriverToTripSchema = z.object({
  driverId: uuidSchema,
  tripId: uuidSchema,
});

// ============================================================================
// LOCATION SERVICE SCHEMAS
// ============================================================================

export const createLocationSchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().min(1),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  locationType: LocationType,
  facilities: z
    .array(
      z.enum([
        "WHEELCHAIR_ACCESSIBLE",
        "SHELTER",
        "PARKING",
        "RESTROOM",
        "SEATING",
        "LIGHTING",
        "SECURITY_CAMERA",
      ])
    )
    .default([]),
  operatingHours: z
    .object({
      monday: z.object({ open: timeSchema, close: timeSchema }).optional(),
      tuesday: z.object({ open: timeSchema, close: timeSchema }).optional(),
      wednesday: z.object({ open: timeSchema, close: timeSchema }).optional(),
      thursday: z.object({ open: timeSchema, close: timeSchema }).optional(),
      friday: z.object({ open: timeSchema, close: timeSchema }).optional(),
      saturday: z.object({ open: timeSchema, close: timeSchema }).optional(),
      sunday: z.object({ open: timeSchema, close: timeSchema }).optional(),
    })
    .optional(),
});

export const updateLocationSchema = createLocationSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const locationQuerySchema = z
  .object({
    page: positiveInt.default(1),
    limit: positiveInt.max(100).default(20),
    locationType: LocationType.optional(),
    isActive: z.boolean().optional(),
    search: z.string().max(255).optional(),
    latitude: latitudeSchema.optional(),
    longitude: longitudeSchema.optional(),
    radiusKm: z.number().positive().max(100).optional(),
  })
  .refine(
    (data) => {
      const hasCoords = data.latitude && data.longitude;
      const hasRadius = data.radiusKm;
      return !hasRadius || hasCoords;
    },
    { message: "Radius requires latitude and longitude" }
  );

// ============================================================================
// ROUTE SERVICE SCHEMAS
// ============================================================================

export const routeLocationSchema = z.object({
  locationId: uuidSchema,
  sequenceOrder: positiveInt,
  locationType: LocationStage,
  estimatedArrival: timeSchema.optional(),
});

const baseRouteSchema = z.object({
  routeName: z.string().min(1).max(255),
  routeCode: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[A-Z0-9-]+$/),
  description: z.string().max(1000).optional(),
  estimatedDurationMinutes: positiveInt.max(1440),
  maxCapacity: positiveInt.max(100),
  operatingDays: z.array(z.number().int().min(0).max(6)).min(1),
  departureTimes: z.array(timeSchema).min(1),
  basePrice: currencyAmount,
  perStopPrice: currencyAmount.default(0),
  distanceBasedPricing: z.boolean().default(false),
  pickupLocations: z.array(routeLocationSchema).min(1),
  dropoffLocations: z.array(routeLocationSchema).min(1),
});

export const createRouteSchema = baseRouteSchema.refine(
  (data) => {
    const pickupOrders = data.pickupLocations.map((l) => l.sequenceOrder);
    const dropoffOrders = data.dropoffLocations.map((l) => l.sequenceOrder);
    return (
      new Set(pickupOrders).size === pickupOrders.length &&
      new Set(dropoffOrders).size === dropoffOrders.length
    );
  },
  { message: "Location sequence orders must be unique within pickup/dropoff" }
);

export const updateRouteSchema = baseRouteSchema
  .partial()
  .extend({ isActive: z.boolean().optional() });

export const routeQuerySchema = z.object({
  page: positiveInt.default(1),
  limit: positiveInt.max(100).default(20),
  isActive: z.boolean().optional(),
  search: z.string().max(255).optional(),
  operatingDay: z.number().int().min(0).max(6).optional(),
  pickupLocationId: uuidSchema.optional(),
  dropoffLocationId: uuidSchema.optional(),
});

// ============================================================================
// TRIP SERVICE SCHEMAS
// ============================================================================

export const createTripSchema = z.object({
  routeId: uuidSchema,
  scheduledDate: dateOnlySchema,
  departureTime: timeSchema,
  availableSeats: positiveInt.optional(),
  notes: z.string().max(1000).optional(),
});

export const bulkCreateTripsSchema = z
  .object({
    routeId: uuidSchema,
    startDate: dateOnlySchema,
    endDate: dateOnlySchema,
    departureTimes: z.array(timeSchema).optional(), // Use route defaults if not provided
    excludeDates: z.array(dateOnlySchema).optional(),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Start date must be before or equal to end date",
  });

export const updateTripStatusSchema = z
  .object({
    status: TripStatus,
    currentLocationId: uuidSchema.optional(),
    currentLocationIndex: nonNegativeInt.optional(),
    currentLocationStage: LocationStage.optional(),
    cancellationReason: z.string().max(1000).optional(),
  })
  .refine((data) => data.status !== "CANCELLED" || data.cancellationReason, {
    message: "Cancellation reason required when status is CANCELLED",
  });

export const tripProgressUpdateSchema = z.object({
  action: z.enum([
    "START_BOARDING",
    "COMPLETE_BOARDING",
    "START_TRIP",
    "ARRIVE_AT_LOCATION",
    "COMPLETE_TRIP",
  ]),
  locationId: uuidSchema.optional(),
  locationType: LocationStage.optional(),
  latitude: latitudeSchema.optional(),
  longitude: longitudeSchema.optional(),
  message: z.string().max(500).optional(),
  passengerUpdates: z
    .array(
      z.object({
        bookingId: uuidSchema,
        verificationCode: z.string().max(20),
        action: z.enum(["BOARDED", "DROPPED_OFF", "NO_SHOW"]),
        timestamp: dateSchema,
      })
    )
    .optional(),
});

export const tripQuerySchema = z.object({
  page: positiveInt.default(1),
  limit: positiveInt.max(100).default(20),
  routeId: uuidSchema.optional(),
  driverId: uuidSchema.optional(),
  status: TripStatus.optional(),
  scheduledDate: dateOnlySchema.optional(),
  dateFrom: dateOnlySchema.optional(),
  dateTo: dateOnlySchema.optional(),
  includePassengers: z.boolean().default(false),
});

// ============================================================================
// BOOKING SERVICE SCHEMAS
// ============================================================================

export const createBookingSchema = z.object({
  tripId: uuidSchema,
  pickupLocationId: uuidSchema,
  dropoffLocationId: uuidSchema,
  specialRequirements: z
    .array(
      z.enum([
        "WHEELCHAIR",
        "EXTRA_LUGGAGE",
        "PET_FRIENDLY",
        "CHILD_SEAT",
        "PRIORITY_SEATING",
      ])
    )
    .optional(),
});

export const verifyPassengerSchema = z.object({
  verificationCode: z.string().min(1).max(20),
  action: z.enum(["BOARD", "VERIFY_ONLY"]),
});

export const cancelBookingSchema = z.object({
  cancellationReason: z.string().min(1).max(1000),
});

export const rateBookingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  feedback: z.string().max(1000).optional(),
});

export const bookingQuerySchema = z.object({
  page: positiveInt.default(1),
  limit: positiveInt.max(100).default(20),
  userId: uuidSchema.optional(),
  tripId: uuidSchema.optional(),
  status: BookingStatus.optional(),
  dateFrom: dateOnlySchema.optional(),
  dateTo: dateOnlySchema.optional(),
});

// ============================================================================
// PAYMENT SERVICE SCHEMAS
// ============================================================================

export const processPaymentSchema = z.object({
  bookingId: uuidSchema,
  paymentMethod: PaymentMethodEnum,
  amount: currencyAmount,
  currency: z.string().length(3).default("USD"),
  paymentMethodId: uuidSchema.optional(), // Saved payment method
  savePaymentMethod: z.boolean().default(false),
});

export const addPaymentMethodSchema = z.object({
  type: PaymentMethodEnum,
  tokenId: z.string().min(1).max(255), // Payment gateway token
  isDefault: z.boolean().default(false),
  billingAddress: z
    .object({
      line1: z.string().min(1),
      line2: z.string().optional(),
      city: z.string().min(1),
      state: z.string().min(1),
      postalCode: z.string().min(1),
      country: z.string().length(2), // ISO country code
    })
    .optional(),
});

export const refundPaymentSchema = z
  .object({
    paymentId: uuidSchema,
    amount: currencyAmount.optional(), // Partial refund if specified
    reason: z.string().min(1).max(1000),
  })
  .refine((data) => !data.amount || data.amount > 0, {
    message: "Refund amount must be positive if specified",
  });

export const paymentQuerySchema = z.object({
  page: positiveInt.default(1),
  limit: positiveInt.max(100).default(20),
  status: PaymentStatus.optional(),
  userId: uuidSchema.optional(),
  dateFrom: dateOnlySchema.optional(),
  dateTo: dateOnlySchema.optional(),
});

// ============================================================================
// RBAC / PERMISSION SERVICE SCHEMAS
// ============================================================================

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z_]+$/),
  displayName: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  parentRoleId: uuidSchema.optional(),
  permissionIds: z.array(uuidSchema).optional(),
});

export const updateRoleSchema = createRoleSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const createPermissionSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z_]+\.[a-z_]+$/), // format: resource.action
  displayName: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  resource: z.string().min(1).max(100),
  action: z.string().min(1).max(100),
  contextRequired: z.boolean().default(false),
});

export const assignRoleSchema = z
  .object({
    userId: uuidSchema,
    roleId: uuidSchema,
    contextType: z.enum(["GLOBAL", "ROUTE", "LOCATION"]).optional(),
    contextId: uuidSchema.optional(),
    expiresAt: dateSchema.optional(),
  })
  .refine((data) => !data.contextId || data.contextType, {
    message: "Context type required when context ID is provided",
  });

export const revokeRoleSchema = z.object({
  userId: uuidSchema,
  roleId: uuidSchema,
  contextType: z.string().optional(),
  contextId: uuidSchema.optional(),
});

export const checkPermissionSchema = z.object({
  userId: uuidSchema,
  permission: z.string().min(1).max(100),
  resourceType: z.string().max(50).optional(),
  resourceId: uuidSchema.optional(),
});

export const bulkAssignPermissionsSchema = z.object({
  roleId: uuidSchema,
  permissionIds: z.array(uuidSchema).min(1),
});

// ============================================================================
// NOTIFICATION SERVICE SCHEMAS
// ============================================================================

export const sendNotificationSchema = z.object({
  userId: uuidSchema,
  type: NotificationType,
  channel: NotificationChannel,
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  data: z.record(z.any()).optional(),
  scheduledFor: dateSchema.optional(),
});

export const bulkSendNotificationSchema = z.object({
  userIds: z.array(uuidSchema).min(1).max(1000),
  type: NotificationType,
  channel: NotificationChannel,
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  data: z.record(z.any()).optional(),
});

export const markNotificationReadSchema = z.object({
  notificationIds: z.array(uuidSchema).min(1),
});

export const notificationQuerySchema = z.object({
  page: positiveInt.default(1),
  limit: positiveInt.max(100).default(20),
  userId: uuidSchema.optional(),
  type: NotificationType.optional(),
  isRead: z.boolean().optional(),
  dateFrom: dateSchema.optional(),
  dateTo: dateSchema.optional(),
});

// ============================================================================
// ANALYTICS SERVICE SCHEMAS
// ============================================================================

export const routeAnalyticsQuerySchema = z
  .object({
    routeId: uuidSchema.optional(),
    dateFrom: dateOnlySchema,
    dateTo: dateOnlySchema,
    groupBy: z.enum(["DAY", "WEEK", "MONTH"]).default("DAY"),
  })
  .refine((data) => new Date(data.dateFrom) <= new Date(data.dateTo), {
    message: "Start date must be before or equal to end date",
  });

export const driverAnalyticsQuerySchema = z
  .object({
    driverId: uuidSchema.optional(),
    dateFrom: dateOnlySchema,
    dateTo: dateOnlySchema,
    groupBy: z.enum(["DAY", "WEEK", "MONTH"]).default("DAY"),
  })
  .refine((data) => new Date(data.dateFrom) <= new Date(data.dateTo), {
    message: "Start date must be before or equal to end date",
  });

export const revenueReportSchema = z.object({
  dateFrom: dateOnlySchema,
  dateTo: dateOnlySchema,
  groupBy: z.enum(["DAY", "WEEK", "MONTH", "ROUTE", "DRIVER"]).default("DAY"),
  routeId: uuidSchema.optional(),
  driverId: uuidSchema.optional(),
});

export const occupancyReportSchema = z.object({
  dateFrom: dateOnlySchema,
  dateTo: dateOnlySchema,
  routeId: uuidSchema.optional(),
  threshold: percentageSchema.optional(), // Filter routes below threshold
});

// ============================================================================
// EXPORT ALL SCHEMAS
// ============================================================================

export const schemas = {
  // Auth
  registerUser: registerUserSchema,
  login: loginSchema,
  refreshToken: refreshTokenSchema,
  changePassword: changePasswordSchema,
  resetPassword: resetPasswordSchema,
  verifyEmail: verifyEmailSchema,
  verifyPhone: verifyPhoneSchema,

  // User
  updateUserProfile: updateUserProfileSchema,
  updateUserStatus: updateUserStatusSchema,
  userQuery: userQuerySchema,

  // Driver
  createDriver: createDriverSchema,
  updateDriver: updateDriverSchema,
  createVehicle: createVehicleSchema,
  updateVehicle: updateVehicleSchema,
  uploadDriverDocument: uploadDriverDocumentSchema,
  assignDriverToTrip: assignDriverToTripSchema,

  // Location
  createLocation: createLocationSchema,
  updateLocation: updateLocationSchema,
  locationQuery: locationQuerySchema,

  // Route
  createRoute: createRouteSchema,
  updateRoute: updateRouteSchema,
  routeQuery: routeQuerySchema,

  // Trip
  createTrip: createTripSchema,
  bulkCreateTrips: bulkCreateTripsSchema,
  updateTripStatus: updateTripStatusSchema,
  tripProgressUpdate: tripProgressUpdateSchema,
  tripQuery: tripQuerySchema,

  // Booking
  createBooking: createBookingSchema,
  verifyPassenger: verifyPassengerSchema,
  cancelBooking: cancelBookingSchema,
  rateBooking: rateBookingSchema,
  bookingQuery: bookingQuerySchema,

  // Payment
  processPayment: processPaymentSchema,
  addPaymentMethod: addPaymentMethodSchema,
  refundPayment: refundPaymentSchema,
  paymentQuery: paymentQuerySchema,

  // RBAC
  createRole: createRoleSchema,
  updateRole: updateRoleSchema,
  createPermission: createPermissionSchema,
  assignRole: assignRoleSchema,
  revokeRole: revokeRoleSchema,
  checkPermission: checkPermissionSchema,
  bulkAssignPermissions: bulkAssignPermissionsSchema,

  // Notification
  sendNotification: sendNotificationSchema,
  bulkSendNotification: bulkSendNotificationSchema,
  markNotificationRead: markNotificationReadSchema,
  notificationQuery: notificationQuerySchema,

  // Analytics
  routeAnalyticsQuery: routeAnalyticsQuerySchema,
  driverAnalyticsQuery: driverAnalyticsQuerySchema,
  revenueReport: revenueReportSchema,
  occupancyReport: occupancyReportSchema,
};

// Type exports for TypeScript
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type CreateRouteInput = z.infer<typeof createRouteSchema>;
export type CreateTripInput = z.infer<typeof createTripSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
