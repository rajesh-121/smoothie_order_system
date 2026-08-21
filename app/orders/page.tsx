"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ORDER_HISTORY_KEY,
  type OrderStatus,
  type SavedOrder,
} from "../data/order";
import s from "./page.module.css";
const labels: Record<OrderStatus, string> = {
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready for pickup",
  "out-for-delivery": "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};
export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    try {
      setOrders(JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || "[]"));
    } catch {
      setOrders([]);
    }
  }, []);
  const shown = useMemo(
    () =>
      orders.filter((order) =>
        `${order.id} ${order.customer.email} ${order.customer.name}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [orders, query],
  );
  return (
    <main className={s.page}>
      <section className={s.card}>
        <header>
          <div>
            <small>ORDER HISTORY</small>
            <h1>Track your orders</h1>
          </div>
          <button onClick={() => router.push("/")}>← Menu</button>
        </header>
        <input
          className={s.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search order number or email"
        />
        {!shown.length ? (
          <p className={s.empty}>No matching orders yet.</p>
        ) : (
          <div className={s.list}>
            {shown.map((order) => (
              <article key={order.id}>
                <div>
                  <span className={`${s.status} ${s[order.status]}`}>
                    {labels[order.status]}
                  </span>
                  <h2>{order.id}</h2>
                  <p>
                    {new Date(order.createdAt).toLocaleString()} ·{" "}
                    {order.fulfilment}
                  </p>
                  <small>
                    {order.items.length} item(s) · {order.customer.email}
                  </small>
                </div>
                <strong>¥{order.total.toLocaleString()}</strong>
              </article>
            ))}
          </div>
        )}
        <p className={s.note}>
          Order status is saved on this device. Staff can update it from the
          admin dashboard.
        </p>
        
      </section>
    </main>
  );
}
