import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

export const LocationSchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  locationType: z.enum(['pickup', 'dropoff', 'both']),
  facilities: z.array(z.string()).default([]),
  operatingHours: z.record(z.any()).optional(),
});

export const RouteSchema = z.object({
  routeName: z.string().min(1).max(255),
  routeCode: z.string().min(1).max(50),
  description: z.string().optional(),
  pickupSequence: z.array(z.string().cuid()).min(1),
  dropoffSequence: z.array(z.string().cuid()).min(1),
  estimatedDurationMinutes: z.number().int().min(1),
  maxCapacity: z.number().int().min(1).default(50),
  operatingDays: z.array(z.number().int().min(1).max(7)).min(1),
  departureTimes: z
    .array(z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/))
    .min(1),
  basePrice: z.number().min(0),
  distanceBasedPricing: z.boolean().default(false),
});

export const BookingSchema = z.object({
  tripId: z.string().cuid(),
  pickupLocationId: z.string().cuid(),
  dropoffLocationId: z.string().cuid(),
  specialRequirements: z.array(z.string()).default([]),
});

export const TripUpdateSchema = z.object({
  action: z.enum([
    'start_boarding',
    'start_trip',
    'arrive_location',
    'complete_trip',
  ]),
  locationId: z.string().cuid().optional(),
  locationType: z.enum(['pickup', 'dropoff']).optional(),
  passengerUpdates: z
    .array(
      z.object({
        bookingId: z.string().cuid(),
        verificationCode: z.string(),
        action: z.enum(['boarded', 'dropped_off']),
        timestamp: z.string().datetime(),
      })
    )
    .default([]),
});
