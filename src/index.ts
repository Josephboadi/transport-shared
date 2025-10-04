// export { authenticateToken, JWTPayload, JWTService } from './auth/jwt';
// export { AuthenticatedRequest, AuthMiddleware } from './auth/middleware';
// export { prisma } from './database/db';
// export { seedDatabase } from './database/seed';
// // export { PermissionService } from './permissions/permission-services';
// export { PermissionService } from './permissions/rbac';
// export {
//   Booking,
//   BookingStatus,
//   Location,
//   LocationStage,
//   LocationType,
//   PaymentStatus,
//   Permission,
//   Role,
//   Route,
//   Trip,
//   TripStatus,
//   User,
//   UserRole,
// } from './types';
// export { ApiResponse, ResponseHandler } from './utils/response';

export {
  addPaymentMethodSchema,
  assignDriverToTripSchema,
  assignRoleSchema,
  bookingQuerySchema,
  bulkAssignPermissionsSchema,
  bulkCreateTripsSchema,
  bulkSendNotificationSchema,
  cancelBookingSchema,
  changePasswordSchema,
  checkPermissionSchema,
  // Booking
  createBookingSchema,
  // Driver
  createDriverSchema,
  // Location
  createLocationSchema,
  createPermissionSchema,
  // RBAC
  createRoleSchema,
  // Route
  createRouteSchema,
  // Trip
  createTripSchema,
  createVehicleSchema,
  driverAnalyticsQuerySchema,
  locationQuerySchema,
  loginSchema,
  markNotificationReadSchema,
  notificationQuerySchema,
  occupancyReportSchema,
  paymentQuerySchema,
  // Payment
  processPaymentSchema,
  rateBookingSchema,
  refreshTokenSchema,
  refundPaymentSchema,
  // Auth
  registerUserSchema,
  resetPasswordSchema,
  revenueReportSchema,
  revokeRoleSchema,
  // Analytics
  routeAnalyticsQuerySchema,
  routeQuerySchema,
  schemas,
  // Notification
  sendNotificationSchema,
  tripProgressUpdateSchema,
  tripQuerySchema,
  updateDriverSchema,
  updateLocationSchema,
  updateRoleSchema,
  updateRouteSchema,
  updateTripStatusSchema,
  // User
  updateUserProfileSchema,
  updateUserStatusSchema,
  updateVehicleSchema,
  uploadDriverDocumentSchema,
  userQuerySchema,
  verifyEmailSchema,
  verifyPassengerSchema,
  verifyPhoneSchema,
} from './validation/schemas';
