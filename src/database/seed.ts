// import { PrismaClient } from '@prisma/client';

// import { PrismaClient } from './db';

import { Prisma } from './db';

// const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('🌱 Seeding database...');

  try {
    // Create permissions
    const permissions = [
      // User permissions
      {
        name: 'users.create',
        displayName: 'Create Users',
        resource: 'users',
        action: 'create',
      },
      {
        name: 'users.read',
        displayName: 'Read Users',
        resource: 'users',
        action: 'read',
      },
      {
        name: 'users.update',
        displayName: 'Update Users',
        resource: 'users',
        action: 'update',
      },
      {
        name: 'users.delete',
        displayName: 'Delete Users',
        resource: 'users',
        action: 'delete',
      },

      // Location permissions
      {
        name: 'locations.create',
        displayName: 'Create Locations',
        resource: 'locations',
        action: 'create',
      },
      {
        name: 'locations.read',
        displayName: 'Read Locations',
        resource: 'locations',
        action: 'read',
      },
      {
        name: 'locations.update',
        displayName: 'Update Locations',
        resource: 'locations',
        action: 'update',
      },
      {
        name: 'locations.delete',
        displayName: 'Delete Locations',
        resource: 'locations',
        action: 'delete',
      },

      // Route permissions
      {
        name: 'routes.create',
        displayName: 'Create Routes',
        resource: 'routes',
        action: 'create',
      },
      {
        name: 'routes.read',
        displayName: 'Read Routes',
        resource: 'routes',
        action: 'read',
      },
      {
        name: 'routes.update',
        displayName: 'Update Routes',
        resource: 'routes',
        action: 'update',
      },
      {
        name: 'routes.delete',
        displayName: 'Delete Routes',
        resource: 'routes',
        action: 'delete',
      },

      // Trip permissions
      {
        name: 'trips.create',
        displayName: 'Create Trips',
        resource: 'trips',
        action: 'create',
      },
      {
        name: 'trips.read',
        displayName: 'Read Trips',
        resource: 'trips',
        action: 'read',
      },
      {
        name: 'trips.update',
        displayName: 'Update Trips',
        resource: 'trips',
        action: 'update',
      },
      {
        name: 'trips.update_status',
        displayName: 'Update Trip Status',
        resource: 'trips',
        action: 'update_status',
      },

      // Booking permissions
      {
        name: 'bookings.create',
        displayName: 'Create Bookings',
        resource: 'bookings',
        action: 'create',
      },
      {
        name: 'bookings.read',
        displayName: 'Read Bookings',
        resource: 'bookings',
        action: 'read',
      },
      {
        name: 'bookings.update',
        displayName: 'Update Bookings',
        resource: 'bookings',
        action: 'update',
      },
      {
        name: 'bookings.cancel',
        displayName: 'Cancel Bookings',
        resource: 'bookings',
        action: 'cancel',
      },

      // Driver permissions
      {
        name: 'passengers.verify',
        displayName: 'Verify Passengers',
        resource: 'passengers',
        action: 'verify',
      },

      // Admin permissions
      {
        name: 'roles.create',
        displayName: 'Create Roles',
        resource: 'roles',
        action: 'create',
      },
      {
        name: 'roles.read',
        displayName: 'Read Roles',
        resource: 'roles',
        action: 'read',
      },
      {
        name: 'roles.update',
        displayName: 'Update Roles',
        resource: 'roles',
        action: 'update',
      },
      {
        name: 'roles.delete',
        displayName: 'Delete Roles',
        resource: 'roles',
        action: 'delete',
      },
      {
        name: 'roles.assign',
        displayName: 'Assign Roles',
        resource: 'roles',
        action: 'assign',
      },
      {
        name: 'permissions.read',
        displayName: 'Read Permissions',
        resource: 'permissions',
        action: 'read',
      },

      // System permissions
      {
        name: 'system.manage',
        displayName: 'System Management',
        resource: 'system',
        action: 'manage',
      },
      {
        name: 'analytics.read',
        displayName: 'Read Analytics',
        resource: 'analytics',
        action: 'read',
      },
    ];

    await Prisma.permission.createMany({
      data: permissions,
      skipDuplicates: true,
    });

    // Create roles
    const roles = [
      {
        name: 'super_admin',
        displayName: 'Super Administrator',
        description: 'Full system access with all permissions',
        isSystemRole: true,
      },
      {
        name: 'platform_admin',
        displayName: 'Platform Administrator',
        description: 'Administrative access to manage platform operations',
        isSystemRole: true,
      },
      {
        name: 'route_manager',
        displayName: 'Route Manager',
        description: 'Manage routes and trip scheduling',
        isSystemRole: false,
      },
      {
        name: 'customer_service',
        displayName: 'Customer Service',
        description: 'Handle customer support and booking issues',
        isSystemRole: false,
      },
      {
        name: 'driver',
        displayName: 'Driver',
        description: 'Bus driver with trip management access',
        isSystemRole: true,
      },
      {
        name: 'passenger',
        displayName: 'Passenger',
        description: 'Regular passenger with booking capabilities',
        isSystemRole: true,
      },
    ];

    const createdRoles: any = [];
    for (const role of roles) {
      const createdRole = await Prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: role,
      });
      createdRoles.push(createdRole);
    }

    // Assign permissions to roles
    const rolePermissions = [
      // Super Admin - all permissions
      {
        roleName: 'super_admin',
        permissions: permissions.map((p) => p.name),
      },

      // Platform Admin - most permissions except system management
      {
        roleName: 'platform_admin',
        permissions: [
          'users.read',
          'users.update',
          'locations.create',
          'locations.read',
          'locations.update',
          'locations.delete',
          'routes.create',
          'routes.read',
          'routes.update',
          'routes.delete',
          'trips.create',
          'trips.read',
          'trips.update',
          'bookings.read',
          'bookings.update',
          'bookings.cancel',
          'roles.read',
          'roles.assign',
          'permissions.read',
          'analytics.read',
        ],
      },

      // Route Manager - route and trip management
      {
        roleName: 'route_manager',
        permissions: [
          'locations.read',
          'routes.create',
          'routes.read',
          'routes.update',
          'trips.create',
          'trips.read',
          'trips.update',
        ],
      },

      // Customer Service - booking and user support
      {
        roleName: 'customer_service',
        permissions: [
          'users.read',
          'users.update',
          'bookings.read',
          'bookings.update',
          'bookings.cancel',
          'trips.read',
        ],
      },

      // Driver - trip management and passenger verification
      {
        roleName: 'driver',
        permissions: [
          'trips.read',
          'trips.update_status',
          'bookings.read',
          'passengers.verify',
        ],
      },

      // Passenger - basic booking capabilities
      {
        roleName: 'passenger',
        permissions: [
          'bookings.create',
          'bookings.read',
          'locations.read',
          'routes.read',
          'trips.read',
        ],
      },
    ];

    for (const rolePermission of rolePermissions) {
      const role = createdRoles.find(
        (r: any) => r.name === rolePermission.roleName
      );
      if (!role) continue;

      for (const permissionName of rolePermission.permissions) {
        const permission = await Prisma.permission.findUnique({
          where: { name: permissionName },
        });

        if (permission) {
          await Prisma.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                roleId: role.id,
                permissionId: permission.id,
              },
            },
            update: {},
            create: {
              roleId: role.id,
              permissionId: permission.id,
            },
          });
        }
      }
    }

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await Prisma.$disconnect();
  }
}

if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
