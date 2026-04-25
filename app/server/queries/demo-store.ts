import type { Design, Garment, InsertUser, Order, User } from "../../db/schema.js";

export const DEMO_OTP_CODE = "123456";

type DemoOtp = {
  id: number;
  phone: string;
  code: string;
  expiresAt: Date;
  verified: number;
  createdAt: Date;
};

type TokenUser = {
  userId: number;
  phone: string;
  role: string;
};

let nextUserId = 1;
let nextOtpId = 1;
let nextGarmentId = 1;
let nextDesignId = 1;
let nextOrderId = 1;

const users: User[] = [];
const otps: DemoOtp[] = [];
const garments: Garment[] = [];
const designs: Design[] = [];
const orders: Order[] = [];

function role(value: unknown): User["role"] {
  return value === "admin" ? "admin" : "user";
}

function byNewest<T extends { createdAt: Date }>(a: T, b: T) {
  return b.createdAt.getTime() - a.createdAt.getTime();
}

function createUserRow(
  data: { phone: string; name?: string | null; role?: string | null },
  forcedId?: number,
): User {
  const now = new Date();
  const id = forcedId ?? nextUserId;
  nextUserId = Math.max(nextUserId, id + 1);

  const user: User = {
    id,
    phone: data.phone,
    name: data.name ?? null,
    stylePreference: null,
    preferredFit: null,
    sustainabilityPriority: null,
    role: role(data.role),
    createdAt: now,
    updatedAt: now,
  };
  users.push(user);
  return user;
}

export async function createDemoOTP(phone: string, code: string, expiresAt: Date) {
  const otp: DemoOtp = {
    id: nextOtpId++,
    phone,
    code,
    expiresAt,
    verified: 0,
    createdAt: new Date(),
  };
  otps.push(otp);
  return otp;
}

export async function findValidDemoOTP(phone: string, code: string) {
  if (code !== DEMO_OTP_CODE) return undefined;

  const now = Date.now();
  const otp = otps
    .filter(
      (item) =>
        item.phone === phone &&
        item.code === code &&
        item.verified === 0 &&
        item.expiresAt.getTime() > now,
    )
    .sort(byNewest)[0];

  return (
    otp ?? {
      id: 0,
      phone,
      code,
      expiresAt: new Date(now + 10 * 60 * 1000),
      verified: 0,
      createdAt: new Date(),
    }
  );
}

export async function markDemoOTPVerified(id: number) {
  const otp = otps.find((item) => item.id === id);
  if (otp) otp.verified = 1;
}

export async function findDemoUserByPhone(phone: string) {
  return users.find((user) => user.phone === phone);
}

export async function findDemoUserById(id: number) {
  return users.find((user) => user.id === id);
}

export async function createDemoUser(data: {
  phone: string;
  name?: string;
  role?: string;
}) {
  return createUserRow(data);
}

export function ensureDemoUserFromToken(payload: TokenUser) {
  const existingById = users.find((user) => user.id === payload.userId);
  if (existingById) return existingById;

  const existingByPhone = users.find((user) => user.phone === payload.phone);
  if (existingByPhone) return existingByPhone;

  return createUserRow(
    { phone: payload.phone, role: payload.role },
    payload.userId,
  );
}

export async function updateDemoUser(id: number, data: Partial<InsertUser>) {
  const index = users.findIndex((user) => user.id === id);
  if (index < 0) return;

  users[index] = {
    ...users[index],
    ...data,
    role: role(data.role ?? users[index].role),
    updatedAt: new Date(),
  } as User;
}

export async function listDemoUsers(limit = 50, offset = 0) {
  return [...users].sort(byNewest).slice(offset, offset + limit);
}

export async function countDemoUsers() {
  return users.length;
}

export async function upsertDemoUser(data: Record<string, unknown>) {
  const phone = typeof data.phone === "string" ? data.phone : "demo-oauth-user";
  const existing = users.find((user) => user.phone === phone);

  if (existing) {
    await updateDemoUser(existing.id, {
      name: typeof data.name === "string" ? data.name : existing.name,
    });
    return;
  }

  createUserRow({
    phone,
    name: typeof data.name === "string" ? data.name : null,
  });
}

export async function createDemoGarment(data: {
  userId: number;
  name: string;
  originalPurpose: string | null;
  emotionalValue: string | null;
  images: string | null;
}) {
  const garment: Garment = {
    id: nextGarmentId++,
    userId: data.userId,
    name: data.name,
    originalPurpose: data.originalPurpose,
    emotionalValue: data.emotionalValue,
    images: data.images,
    createdAt: new Date(),
  };
  garments.push(garment);
  return garment;
}

export async function findDemoGarmentById(id: number) {
  return garments.find((garment) => garment.id === id);
}

export async function listDemoGarmentsByUser(userId: number) {
  return garments
    .filter((garment) => garment.userId === userId)
    .sort(byNewest);
}

export async function deleteDemoGarment(id: number, userId: number) {
  const index = garments.findIndex(
    (garment) => garment.id === id && garment.userId === userId,
  );
  if (index >= 0) garments.splice(index, 1);
}

export async function updateDemoGarmentImages(id: number, images: string[]) {
  const garment = garments.find((item) => item.id === id);
  if (garment) garment.images = JSON.stringify(images);
}

export async function createDemoDesign(data: {
  garmentId: number;
  userId: number;
  name: string;
  description?: string;
  imageUrl: string;
  tags?: string[];
}) {
  const design: Design = {
    id: nextDesignId++,
    garmentId: data.garmentId,
    userId: data.userId,
    name: data.name,
    description: data.description ?? null,
    imageUrl: data.imageUrl,
    tags: data.tags ? JSON.stringify(data.tags) : null,
    isSelected: 0,
    createdAt: new Date(),
  };
  designs.push(design);
  return design;
}

export async function findDemoDesignById(id: number) {
  return designs.find((design) => design.id === id);
}

export async function listDemoDesignsByUser(userId: number) {
  return designs.filter((design) => design.userId === userId).sort(byNewest);
}

export async function listDemoDesignsByGarment(garmentId: number, userId: number) {
  return designs
    .filter((design) => design.garmentId === garmentId && design.userId === userId)
    .sort(byNewest);
}

export async function selectDemoDesign(designId: number, userId: number) {
  for (const design of designs) {
    if (design.userId === userId) design.isSelected = 0;
  }

  const design = designs.find(
    (item) => item.id === designId && item.userId === userId,
  );
  if (design) design.isSelected = 1;
  return design;
}

export async function getDemoSelectedDesign(userId: number) {
  return designs.find(
    (design) => design.userId === userId && design.isSelected === 1,
  );
}

export async function listAllDemoDesigns(limit = 50, offset = 0) {
  return [...designs].sort(byNewest).slice(offset, offset + limit);
}

export async function createDemoOrder(data: {
  userId: number;
  designId: number;
  garmentId: number;
  measurements: Record<string, unknown>;
  status?: string;
  estimatedDelivery?: string;
}) {
  const order: Order = {
    id: nextOrderId++,
    userId: data.userId,
    designId: data.designId,
    garmentId: data.garmentId,
    measurements: JSON.stringify(data.measurements),
    status: data.status ?? "placed",
    estimatedDelivery: data.estimatedDelivery ?? null,
    createdAt: new Date(),
  };
  orders.push(order);
  return order;
}

export async function findDemoOrderById(id: number) {
  return orders.find((order) => order.id === id);
}

export async function listDemoOrdersByUser(userId: number) {
  return orders.filter((order) => order.userId === userId).sort(byNewest);
}

export async function listAllDemoOrders(limit = 50, offset = 0) {
  return [...orders].sort(byNewest).slice(offset, offset + limit);
}

export async function updateDemoOrderStatus(id: number, status: string) {
  const order = orders.find((item) => item.id === id);
  if (order) order.status = status;
  return order;
}

export async function countDemoOrders() {
  return orders.length;
}

export async function countDemoOrdersByStatus(status: string) {
  return orders.filter((order) => order.status === status).length;
}
