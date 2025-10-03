// import { PrismaClient } from '@prisma/client';
// import { JWTPayload } from '../auth/jwt';

// export class PermissionService {
//   private prisma: PrismaClient;

//   constructor(prisma: PrismaClient) {
//     this.prisma = prisma;
//   }

//   async checkPermission(
//     userId: string,
//     resource: string,
//     action: string,
//     contextId?: string
//   ): Promise<boolean> {
//     const userRoles = await this.prisma.userRole.findMany({
//       where: {
//         userId,
//         isActive: true,
//         OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
//         ...(contextId && {
//           OR: [{ contextType: null }, { contextId }],
//         }),
//       },
//       include: {
//         role: {
//           include: {
//             rolePermissions: {
//               include: {
//                 permission: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     for (const userRole of userRoles) {
//       for (const rolePermission of userRole.role.rolePermissions) {
//         const permission = rolePermission.permission;
//         if (permission.resource === resource && permission.action === action) {
//           return true;
//         }
//         // Check wildcard permissions
//         if (permission.resource === resource && permission.action === '*') {
//           return true;
//         }
//         if (permission.resource === '*' && permission.action === action) {
//           return true;
//         }
//         if (permission.resource === '*' && permission.action === '*') {
//           return true;
//         }
//       }
//     }

//     return false;
//   }

//   async getUserPermissions(userId: string): Promise<string[]> {
//     const userRoles = await this.prisma.userRole.findMany({
//       where: {
//         userId,
//         isActive: true,
//         OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
//       },
//       include: {
//         role: {
//           include: {
//             rolePermissions: {
//               include: {
//                 permission: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     const permissions = new Set<string>();

//     for (const userRole of userRoles) {
//       for (const rolePermission of userRole.role.rolePermissions) {
//         permissions.add(rolePermission.permission.name);
//       }
//     }

//     return Array.from(permissions);
//   }

//   // Middleware for permission checking
//   requirePermission(resource: string, action: string) {
//     return async (req: any, res: any, next: any) => {
//       const user: JWTPayload = req.user;

//       if (!user) {
//         return res.status(401).json({
//           success: false,
//           message: 'Authentication required',
//         });
//       }

//       const hasPermission = await this.checkPermission(
//         user.userId,
//         resource,
//         action,
//         req.params.contextId
//       );

//       if (!hasPermission) {
//         return res.status(403).json({
//           success: false,
//           message: `Insufficient permissions: ${resource}.${action}`,
//         });
//       }

//       next();
//     };
//   }
// }
