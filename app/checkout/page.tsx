"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateNutrition, orderKey, type OrderItem } from "../data/order";
import { menuItems } from "../data/menu";
import s from "./page.module.css";
export default function Checkout() {
  const [cart, setCart] = useState<OrderItem[]>([]),
    [done, setDone] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const saved: OrderItem[] = JSON.parse(
      localStorage.getItem("smoothieCart") || "[]",
    );
    setCart(
      saved.map((order) => {
        const current =
          menuItems.find((item) => item.id === order.item.id) || order.item;
        return {
          ...order,
          item: current,
          nutrition: calculateNutrition(
            current,
            order.size,
            order.sweetness,
            order.booster,
          ),
        };
      }),
    );
  }, []);
  const save = (x: OrderItem[]) => {
    setCart(x);
    localStorage.setItem("smoothieCart", JSON.stringify(x));
  };
  const groups = useMemo(
    () =>
      cart.reduce<Array<{ item: OrderItem; qty: number }>>((a, x) => {
        const f = a.find((g) => orderKey(g.item) === orderKey(x));
        f ? f.qty++ : a.push({ item: x, qty: 1 });
        return a;
      }, []),
    [cart],
  );
  const total = cart.reduce((a, x) => a + x.unitPrice, 0);
  const nutritionTotal = cart.reduce(
    (sum, order) => ({
      kcal: sum.kcal + order.nutrition.kcal,
      protein: sum.protein + order.nutrition.protein,
      fiber: sum.fiber + order.nutrition.fiber,
      vitaminC: sum.vitaminC + order.nutrition.vitaminC,
    }),
    { kcal: 0, protein: 0, fiber: 0, vitaminC: 0 },
  );
  const removeOne = (x: OrderItem) => {
    const i = cart.findIndex((y) => orderKey(y) === orderKey(x));
    save(cart.filter((_, n) => n !== i));
  };
  const ticket = useMemo(() => Math.floor(100 + Math.random() * 900), []);
  if (done)
    return (
      <main className={s.done}>
        <span>🥤</span>
        <h1>注文完了</h1>
        <p>チケット番号</p>
        <strong>#{ticket}</strong>
        <p>約10〜15分で出来上がります。</p>
        <button onClick={() => router.push("/")}>メニューへ戻る</button>
      </main>
    );
  return (
    <main className={s.page}>
      <section className={s.card}>
        <header>
          <div>
            <small>FINAL CHECK</small>
            <h1>注文内容の確認</h1>
          </div>
          <button onClick={() => router.push("/")}>← メニューに戻る</button>
        </header>
        <div className={s.list}>
          {groups.map(({ item, qty }) => (
            <article key={orderKey(item)}>
              <Image src={item.item.image.url} alt="" width={92} height={72} />
              <div>
                <h2>{item.item.name}</h2>
                <p>
                  {item.size} / 甘さ{item.sweetness} / {item.booster}
                </p>
                <small>{item.item.blendType}</small>
                <div className={s.itemNutrition}>
                  {item.nutrition.kcal} kcal · P {item.nutrition.protein}g ·
                  食物繊維 {item.nutrition.fiber}g · ビタミンC{" "}
                  {item.nutrition.vitaminC}mg
                </div>
              </div>
              <b>¥{(item.unitPrice * qty).toLocaleString()}</b>
              <div className={s.qty}>
                <button onClick={() => removeOne(item)}>−</button>
                <span>{qty}</span>
                <button onClick={() => save([...cart, item])}>＋</button>
              </div>
            </article>
          ))}
        </div>
        {!cart.length && <p className={s.empty}>カートは空です。</p>}
        {!!cart.length && (
          <section className={s.nutritionTotal}>
            <h3>カートの栄養合計</h3>
            <div>
              <span>
                エネルギー<b>{nutritionTotal.kcal} kcal</b>
              </span>
              <span>
                たんぱく質<b>{nutritionTotal.protein.toFixed(1)} g</b>
              </span>
              <span>
                食物繊維<b>{nutritionTotal.fiber.toFixed(1)} g</b>
              </span>
              <span>
                ビタミンC<b>{nutritionTotal.vitaminC} mg</b>
              </span>
            </div>
          </section>
        )}
        <footer>
          <button
            className={s.cancel}
            onClick={() => save([])}
            disabled={!cart.length}
          >
            全てキャンセル
          </button>
          <div>
            <span>合計（税込）</span>
            <strong>¥{total.toLocaleString()}</strong>
            <button
              disabled={!cart.length}
              onClick={() => {
                localStorage.removeItem("smoothieCart");
                setDone(true);
              }}
            >
              注文を確定
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}
