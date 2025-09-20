import { z } from "zod";

export const createLocationSchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  locationType: z.enum(["pickup", "dropoff", "both"]),
  facilities: z.array(z.string()).default([]),
  operatingHours: z
    .record(
      z.object({
        start: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
      })
    )
    .optional(),
});

export const createRouteSchema = z.object({
  routeName: z.string().min(1).max(255),
  routeCode: z.string().min(1).max(50),
  description: z.string().optional(),
  pickupSequence: z.array(z.string().cuid()).min(1),
  dropoffSequence: z.array(z.string().cuid()).min(1),
  estimatedDurationMinutes: z.number().min(1),
  maxCapacity: z.number().min(1).max(100),
  operatingDays: z.array(z.number().min(1).max(7)).min(1),
  departureTimes: z
    .array(z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/))
    .min(1),
  basePrice: z.number().min(0),
  distanceBasedPricing: z.boolean().default(false),
});

export const createBookingSchema = z.object({
  tripId: z.string().cuid(),
  pickupLocationId: z.string().cuid(),
  dropoffLocationId: z.string().cuid(),
  specialRequirements: z.array(z.string()).default([]),
});
