import { z } from "zod";
import { createRouter, adminQuery } from "./middleware.js";
import { countUsers, listUsers } from "./queries/users.js";
import { countOrders, countOrdersByStatus, listAllOrders } from "./queries/orders.js";
import { listAllDesigns } from "./queries/designs.js";

export const adminRouter = createRouter({
  getStats: adminQuery.query(async () => {
    const totalUsers = await countUsers();
    const totalOrders = await countOrders();
    const pendingOrders = (await countOrdersByStatus("placed")) + (await countOrdersByStatus("in_production"));
    const conversionRate = totalUsers > 0 ? Math.round((totalOrders / totalUsers) * 1000) / 10 : 0;

    return {
      totalUsers,
      totalOrders,
      totalGarments: totalOrders * 2,
      totalDesigns: totalOrders * 4,
      pendingOrders,
      conversionRate,
    };
  }),

  listUsers: adminQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        search: z.string().optional(),
        role: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;
      const users = await listUsers(input.limit, offset);
      const total = await countUsers();
      return { users, total };
    }),

  listOrders: adminQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        status: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;
      const orders = await listAllOrders(input.limit, offset);
      const total = await countOrders();
      return { orders, total };
    }),

  listDesigns: adminQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;
      const designs = await listAllDesigns(input.limit, offset);
      return { designs, total: 0 };
    }),

  updateOrderStatus: adminQuery
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ input }) => {
      const { updateOrderStatus } = await import("./queries/orders.js");
      const order = await updateOrderStatus(input.id, input.status);
      return order;
    }),
});
