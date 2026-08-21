"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateNutrition, CART_KEY, DELIVERY_FEE, ORDER_HISTORY_KEY, orderKey, PROMO_CODES, TAX_RATE, type CustomerDetails, type FulfilmentMethod, type OrderItem, type PaymentMethod, type SavedOrder } from "../data/order";
import { menuItems } from "../data/menu";
import s from "./page.module.css";

const emptyCustomer: CustomerDetails = { name: "", email: "", phone: "", address: "", notes: "" };

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customer, setCustomer] = useState<CustomerDetails>(emptyCustomer);
  const [fulfilment, setFulfilment] = useState<FulfilmentMethod>("pickup");
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [promo, setPromo] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [placed, setPlaced] = useState<SavedOrder | null>(null);
  useEffect(() => {
    try {
      const saved: OrderItem[] = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      setCart(saved.map((order) => { const item = menuItems.find((candidate) => candidate.id === order.item.id) || order.item; return { ...order, item, nutrition: calculateNutrition(item, order.size, order.sweetness, order.booster) }; }));
      const savedCustomer = localStorage.getItem("smoothieCustomer");
      if (savedCustomer) setCustomer({ ...emptyCustomer, ...JSON.parse(savedCustomer) });
    } catch { localStorage.removeItem(CART_KEY); }
  }, []);
  const saveCart = (items: OrderItem[]) => { setCart(items); localStorage.setItem(CART_KEY, JSON.stringify(items)); };
  const groups = useMemo(() => cart.reduce<Array<{ item: OrderItem; qty: number }>>((all, item) => { const group = all.find((candidate) => orderKey(candidate.item) === orderKey(item)); group ? group.qty += 1 : all.push({ item, qty: 1 }); return all; }, []), [cart]);
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice, 0);
  const discountRate = PROMO_CODES[promo.trim().toUpperCase()] || 0;
  const discount = Math.round(subtotal * discountRate);
  const deliveryFee = fulfilment === "delivery" ? DELIVERY_FEE : 0;
  const tax = Math.round((subtotal - discount + deliveryFee) * TAX_RATE);
  const total = subtotal - discount + deliveryFee + tax;
  const updateCustomer = (key: keyof CustomerDetails, value: string) => setCustomer((current) => ({ ...current, [key]: value }));
  const changeQty = (item: OrderItem, direction: 1 | -1) => { if (direction === 1) return saveCart([...cart, item]); const index = cart.findIndex((candidate) => orderKey(candidate) === orderKey(item)); if (index >= 0) saveCart(cart.filter((_, i) => i !== index)); };
  const applyPromo = () => setPromoMessage(discountRate ? `${Math.round(discountRate * 100)}% discount applied.` : "Enter FRESH10 or PULSE15 to apply a discount.");
  const placeOrder = () => {
    if (!cart.length || !customer.name || !customer.email || (fulfilment === "delivery" && !customer.address)) return;
    const order: SavedOrder = { id: `PULSE-${Date.now().toString().slice(-6)}`, createdAt: new Date().toISOString(), items: cart, customer, fulfilment, payment, status: "confirmed", subtotal, discount, deliveryFee, tax, total };
    const history: SavedOrder[] = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || "[]");
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify([order, ...history])); localStorage.setItem("smoothieCustomer", JSON.stringify(customer)); localStorage.removeItem(CART_KEY); setCart([]); setPlaced(order);
  };
  if (placed) return <main className={s.done}><span>✓</span><p className={s.eyebrow}>ORDER CONFIRMED</p><h1>Thanks, {placed.customer.name}!</h1><p>Your order number is</p><strong>{placed.id}</strong><p>{placed.fulfilment === "delivery" ? "We will deliver it to your address shortly." : "We will have it ready for pickup in about 10–15 minutes."}</p><div className={s.doneActions}><button onClick={() => router.push("/orders")}>Track my order</button><button className={s.secondary} onClick={() => window.print()}>Print receipt</button><button className={s.secondary} onClick={() => router.push("/")}>Order more</button></div></main>;
  return <main className={s.page}><section className={s.card}><header><div><small>FINAL CHECK</small><h1>Complete your order</h1></div><button onClick={() => router.push("/")}>← Back to menu</button></header><div className={s.layout}><div><section className={s.list}>{groups.map(({ item, qty }) => <article key={orderKey(item)}><Image src={item.item.image.url} alt={item.item.name} width={92} height={72}/><div><h2>{item.item.name}</h2><p>{item.size} / sweetness {item.sweetness} / {item.booster}</p><small>{item.item.blendType}</small></div><b>¥{(item.unitPrice * qty).toLocaleString()}</b><div className={s.qty}><button onClick={() => changeQty(item, -1)} aria-label="Remove one">−</button><span>{qty}</span><button onClick={() => changeQty(item, 1)} aria-label="Add one">+</button></div></article>)}</section>{!cart.length && <p className={s.empty}>Your cart is empty. Add a smoothie before checking out.</p>}{!!cart.length && <section className={s.form}><h2>Customer and fulfilment</h2><div className={s.fields}><input value={customer.name} onChange={(e) => updateCustomer("name", e.target.value)} placeholder="Full name *"/><input type="email" value={customer.email} onChange={(e) => updateCustomer("email", e.target.value)} placeholder="Email *"/><input value={customer.phone} onChange={(e) => updateCustomer("phone", e.target.value)} placeholder="Phone number"/></div><div className={s.choices}><label><input type="radio" checked={fulfilment === "pickup"} onChange={() => setFulfilment("pickup")}/> Pickup (10–15 min)</label><label><input type="radio" checked={fulfilment === "delivery"} onChange={() => setFulfilment("delivery")}/> Delivery (+¥{DELIVERY_FEE})</label></div>{fulfilment === "delivery" && <input value={customer.address} onChange={(e) => updateCustomer("address", e.target.value)} placeholder="Delivery address *"/>}<textarea value={customer.notes} onChange={(e) => updateCustomer("notes", e.target.value)} placeholder="Order notes (optional)"/><div className={s.choices}><label><input type="radio" checked={payment === "card"} onChange={() => setPayment("card")}/> Card</label><label><input type="radio" checked={payment === "wallet"} onChange={() => setPayment("wallet")}/> Digital wallet</label><label><input type="radio" checked={payment === "cash"} onChange={() => setPayment("cash")}/> Pay on pickup</label></div></section>}</div><aside className={s.summary}><h2>Order summary</h2><div className={s.promo}><input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code"/><button onClick={applyPromo}>Apply</button></div>{promoMessage && <p className={s.promoMessage}>{promoMessage}</p>}<p><span>Subtotal</span><b>¥{subtotal.toLocaleString()}</b></p>{discount > 0 && <p><span>Discount</span><b>−¥{discount.toLocaleString()}</b></p>}<p><span>Delivery</span><b>{deliveryFee ? `¥${deliveryFee}` : "Free"}</b></p><p><span>Tax</span><b>¥{tax.toLocaleString()}</b></p><p className={s.total}><span>Total</span><strong>¥{total.toLocaleString()}</strong></p><button className={s.place} disabled={!cart.length || !customer.name || !customer.email || (fulfilment === "delivery" && !customer.address)} onClick={placeOrder}>Place secure order</button><button className={s.clear} disabled={!cart.length} onClick={() => saveCart([])}>Clear cart</button></aside></div></section></main>;
}
