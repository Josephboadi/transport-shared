// ============================================================================
// SHARED DATABASE CONFIGURATION FOR BUS TRANSPORTATION PLATFORM
// ============================================================================

import { PrismaClient } from "@prisma/client";

export class Database {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient({
        log: ["query", "info", "warn", "error"],
        errorFormat: "pretty",
      });

      // Handle connection errors
      Database.instance
        .$connect()
        .then(() => {
          console.log("✅ Database connected successfully");
        })
        .catch((error: any) => {
          console.error("❌ Database connection failed:", error);
          process.exit(1);
        });

      // Graceful shutdown
      process.on("beforeExit", async () => {
        await Database.instance.$disconnect();
      });

      process.on("SIGINT", async () => {
        await Database.instance.$disconnect();
        process.exit(0);
      });

      process.on("SIGTERM", async () => {
        await Database.instance.$disconnect();
        process.exit(0);
      });
    }

    return Database.instance;
  }

  public static async disconnect(): Promise<void> {
    if (Database.instance) {
      await Database.instance.$disconnect();
    }
  }

  // Health check
  public static async healthCheck(): Promise<boolean> {
    try {
      await Database.instance.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error("Database health check failed:", error);
      return false;
    }
  }

  // Transaction helper
  public static async transaction<T>(
    callback: (
      tx: Omit<
        PrismaClient,
        | "$connect"
        | "$disconnect"
        | "$on"
        | "$transaction"
        | "$use"
        | "$extends"
      >
    ) => Promise<T>
  ): Promise<T> {
    return Database.instance.$transaction(callback);
  }

  // Soft delete helpers
  public static async softDelete(
    model: string,
    id: string,
    deletedBy?: string
  ): Promise<any> {
    const prisma = Database.instance;

    // @ts-ignore - Dynamic model access
    return prisma[model].update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
        ...(deletedBy && { deletedBy }),
        ...(deletedBy && { deletedAt: new Date() }),
      },
    });
  }

  // Restore soft deleted record
  public static async restore(model: string, id: string): Promise<any> {
    const prisma = Database.instance;

    // @ts-ignore - Dynamic model access
    return prisma[model].update({
      where: { id },
      data: {
        isActive: true,
        updatedAt: new Date(),
        deletedAt: null,
        deletedBy: null,
      },
    });
  }

  // Pagination helper
  public static getPaginationParams(
    page: number = 1,
    limit: number = 20
  ): { skip: number; take: number; page: number; limit: number } {
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(100, Math.max(1, limit));
    const skip = (validatedPage - 1) * validatedLimit;

    return {
      skip,
      take: validatedLimit,
      page: validatedPage,
      limit: validatedLimit,
    };
  }

  // Search helper
  public static getSearchCondition(
    searchFields: string[],
    searchTerm: string
  ): Record<string, any> {
    if (!searchTerm || !searchFields.length) {
      return {};
    }

    const searchConditions = searchFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive" as const,
      },
    }));

    return {
      OR: searchConditions,
    };
  }

  // Date range helper
  public static getDateRangeCondition(
    dateField: string,
    dateFrom?: Date,
    dateTo?: Date
  ): Record<string, any> {
    const condition: Record<string, any> = {};

    if (dateFrom) {
      condition[dateField] = {
        ...condition[dateField],
        gte: dateFrom,
      };
    }

    if (dateTo) {
      condition[dateField] = {
        ...condition[dateField],
        lte: dateTo,
      };
    }

    return condition;
  }

  // Audit log helper
  public static async createAuditLog(
    userId: string | null,
    action: string,
    resource: string,
    resourceId: string | null,
    oldValues?: any,
    newValues?: any,
    ipAddress?: string,
    userAgent?: string,
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    try {
      const prisma = Database.instance;

      await prisma.auditLog.create({
        data: {
          userId,
          action,
          resource,
          resourceId,
          oldValues: oldValues ? JSON.parse(JSON.stringify(oldValues)) : null,
          newValues: newValues ? JSON.parse(JSON.stringify(newValues)) : null,
          ipAddress,
          userAgent,
          success,
          errorMessage,
        },
      });
    } catch (error) {
      console.error("Failed to create audit log:", error);
      // Don't throw error to avoid breaking main operation
    }
  }

  // Permission audit log helper
  public static async createPermissionAuditLog(
    userId: string,
    permissionName: string,
    action: string,
    granted: boolean,
    resourceType?: string,
    resourceId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const prisma = Database.instance;

      await prisma.permissionAuditLog.create({
        data: {
          userId,
          permissionName,
          resourceType,
          resourceId,
          action,
          granted,
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      console.error("Failed to create permission audit log:", error);
      // Don't throw error to avoid breaking main operation
    }
  }

  // Analytics helpers
  public static async upsertRouteAnalytics(
    routeId: string,
    date: Date,
    data: {
      totalTrips?: number;
      completedTrips?: number;
      cancelledTrips?: number;
      totalPassengers?: number;
      totalRevenue?: number;
      averageOccupancy?: number;
      onTimePerformance?: number;
    }
  ): Promise<void> {
    try {
      const prisma = Database.instance;
      const dateOnly = new Date(date.toISOString().slice(0, 10));

      await prisma.routeAnalytics.upsert({
        where: {
          routeId_date: {
            routeId,
            date: dateOnly,
          },
        },
        update: {
          ...data,
          updatedAt: new Date(),
        },
        create: {
          routeId,
          date: dateOnly,
          ...data,
        },
      });
    } catch (error) {
      console.error("Failed to upsert route analytics:", error);
    }
  }

  public static async upsertDriverAnalytics(
    driverId: string,
    date: Date,
    data: {
      totalTrips?: number;
      completedTrips?: number;
      cancelledTrips?: number;
      totalPassengers?: number;
      averageRating?: number;
      totalRevenue?: number;
      onTimePerformance?: number;
    }
  ): Promise<void> {
    try {
      const prisma = Database.instance;
      const dateOnly = new Date(date.toISOString().slice(0, 10));

      await prisma.driverAnalytics.upsert({
        where: {
          driverId_date: {
            driverId,
            date: dateOnly,
          },
        },
        update: {
          ...data,
          updatedAt: new Date(),
        },
        create: {
          driverId,
          date: dateOnly,
          ...data,
        },
      });
    } catch (error) {
      console.error("Failed to upsert driver analytics:", error);
    }
  }

  // Cache invalidation helpers
  public static async invalidateUserCache(userId: string): Promise<void> {
    // This would integrate with Redis or other caching solution
    // For now, just log the action
    console.log(`Cache invalidated for user: ${userId}`);
  }

  public static async invalidateRouteCache(routeId: string): Promise<void> {
    // This would integrate with Redis or other caching solution
    // For now, just log the action
    console.log(`Cache invalidated for route: ${routeId}`);
  }

  public static async invalidateTripCache(tripId: string): Promise<void> {
    // This would integrate with Redis or other caching solution
    // For now, just log the action
    console.log(`Cache invalidated for trip: ${tripId}`);
  }
}

export default Database;
