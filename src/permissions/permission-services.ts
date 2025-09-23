// import { PrismaClient } from '@prisma/client';

// import { PrismaClient } from '../generated/client';

import { prisma } from '../database/db';

export class PermissionService {
  // private prisma = new PrismaClient();

  async checkPermission(
    userId: string,
    resource: string,
    action: string,
    contextId?: string
  ): Promise<boolean> {
    // const userRoles = await this.prisma.userRole.findMany({
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        ...(contextId && {
          OR: [{ contextType: null }, { contextId }],
        }),
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const permissionName = `${resource}.${action}`;

    for (const userRole of userRoles) {
      const hasPermission = userRole.role.rolePermissions.some(
        (rp: any) =>
          rp.permission.name === permissionName ||
          rp.permission.name === `${resource}.*` ||
          rp.permission.name === '*.*'
      );

      if (hasPermission) return true;
    }

    return false;
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    // const userRoles = await this.prisma.userRole.findMany({
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const permissions = new Set<string>();
    userRoles.forEach((userRole: any) => {
      userRole.role.rolePermissions.forEach((rp: any) => {
        permissions.add(rp.permission.name);
      });
    });

    return Array.from(permissions);
  }
}
