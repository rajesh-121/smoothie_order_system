import type { MenuItem, Nutrition } from "./menu";
export type Size = "S" | "M" | "L";
export type Sweetness = "控えめ" | "普通" | "甘め";
export type Booster = "なし" | "チアシード" | "プロテイン" | "ビタミン";
export type OrderItem = {
  item: MenuItem;
  size: Size;
  sweetness: Sweetness;
  booster: Booster;
  unitPrice: number;
  nutrition: Nutrition;
};
export type FulfilmentMethod = "pickup" | "delivery";
export type PaymentMethod = "card" | "cash" | "wallet";
export type OrderStatus = "confirmed" | "preparing" | "ready" | "out-for-delivery" | "completed" | "cancelled";
export type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
};
export type SavedOrder = {
  id: string;
  createdAt: string;
  items: OrderItem[];
  customer: CustomerDetails;
  fulfilment: FulfilmentMethod;
  payment: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
};
export const ORDER_HISTORY_KEY = "smoothieOrders";
export const CART_KEY = "smoothieCart";
export const DELIVERY_FEE = 250;
export const TAX_RATE = 0.1;
export const PROMO_CODES: Record<string, number> = { FRESH10: 0.1, PULSE15: 0.15 };
export const sizeExtra: Record<Size, number> = { S: -80, M: 0, L: 120 };
export const boosterExtra: Record<Booster, number> = {
  なし: 0,
  チアシード: 80,
  プロテイン: 150,
  ビタミン: 100,
};
const boosterNutrition: Record<Booster, Nutrition> = {
  なし: { kcal: 0, protein: 0, fiber: 0, vitaminC: 0 },
  チアシード: { kcal: 50, protein: 2, fiber: 4, vitaminC: 0 },
  プロテイン: { kcal: 100, protein: 20, fiber: 1, vitaminC: 0 },
  ビタミン: { kcal: 10, protein: 0, fiber: 0, vitaminC: 60 },
};
const sizeRatio: Record<Size, number> = { S: 0.8, M: 1, L: 1.25 };
const sweetnessKcal: Record<Sweetness, number> = {
  控えめ: -20,
  普通: 0,
  甘め: 35,
};
export const calculateNutrition = (
  item: MenuItem,
  size: Size,
  sweetness: Sweetness,
  booster: Booster,
): Nutrition => {
  const base = item.nutrition;
  const extra = boosterNutrition[booster];
  const ratio = sizeRatio[size];
  return {
    kcal: Math.max(
      0,
      Math.round(base.kcal * ratio + sweetnessKcal[sweetness] + extra.kcal),
    ),
    protein: Number((base.protein * ratio + extra.protein).toFixed(1)),
    fiber: Number((base.fiber * ratio + extra.fiber).toFixed(1)),
    vitaminC: Math.round(base.vitaminC * ratio + extra.vitaminC),
  };
};
export const orderKey = (o: OrderItem) =>
  `${o.item.id}|${o.size}|${o.sweetness}|${o.booster}`;
