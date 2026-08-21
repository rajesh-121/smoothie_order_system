"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { menuItems, type Goal, type MenuItem } from "./data/menu";
import {
  boosterExtra,
  calculateNutrition,
  sizeExtra,
  type Booster,
  type OrderItem,
  type Size,
  type Sweetness,
} from "./data/order";
import s from "./page.module.css";

type Config = { size: Size; sweetness: Sweetness; booster: Booster };
const defaultConfig: Config = { size: "M", sweetness: "普通", booster: "なし" };

export default function Page() {
  const [query, setQuery] = useState("");
  const [goal, setGoal] = useState<"すべて" | Goal>("すべて");
  const [fruit, setFruit] = useState("すべて");
  const [configs, setConfigs] = useState<Record<string, Config>>({});
  const [cart, setCart] = useState<OrderItem[]>([]);
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
  const save = (next: OrderItem[]) => {
    setCart(next);
    localStorage.setItem("smoothieCart", JSON.stringify(next));
  };
  const config = (id: string) => configs[id] || defaultConfig;
  const setConfig = <K extends keyof Config>(
    id: string,
    key: K,
    value: Config[K],
  ) => setConfigs({ ...configs, [id]: { ...config(id), [key]: value } });
  const shown = useMemo(() => {
    const word = query.trim().toLowerCase();
    return menuItems.filter(
      (x) =>
        (goal === "すべて" || x.goal === goal) &&
        (fruit === "すべて" || x.fruit === fruit) &&
        `${x.fruit} ${x.name} ${x.blendType}`.toLowerCase().includes(word),
    );
  }, [query, goal, fruit]);
  const add = (item: MenuItem) => {
    const c = config(item.id);
    save([
      ...cart,
      {
        item,
        ...c,
        unitPrice: item.price + sizeExtra[c.size] + boosterExtra[c.booster],
        nutrition: calculateNutrition(item, c.size, c.sweetness, c.booster),
      },
    ]);
  };
  const removeOne = (id: string) => {
    const index = cart.map((x) => x.item.id).lastIndexOf(id);
    if (index >= 0) save(cart.filter((_, i) => i !== index));
  };
  const count = (id: string) => cart.filter((x) => x.item.id === id).length;
  const total = cart.reduce((sum, x) => sum + x.unitPrice, 0);
  return (
    <>
      <header className={s.hero}>
        <div>
          <small>FRUIT-FIRST SMOOTHIE LAB</small>
          <h1>PULSE</h1>
          <p>6つの主役フルーツ、12種類のブレンド。</p>
        </div>
      </header>
      <main className={s.main}>
        <section className={s.discovery}>
          <label>
            <span>🔎</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="フルーツ名・ブレンド種類で検索"
            />
            {query && (
              <button
                className={s.clearSearch}
                onClick={() => setQuery("")}
                aria-label="検索をクリア"
              >
                ×
              </button>
            )}
          </label>
          <div>
            {(
              ["すべて", "エネルギー", "リフレッシュ", "プロテイン"] as const
            ).map((x) => (
              <button
                key={x}
                className={goal === x ? s.active : ""}
                onClick={() => setGoal(x)}
              >
                #{x}
              </button>
            ))}
          </div>
        </section>
        <div className={s.fruitStrip}>
          {[
            "すべて",
            "マンゴー",
            "ベリー",
            "キウイ",
            "バナナ",
            "パイナップル",
            "オレンジ",
          ].map((f) => (
            <button
              key={f}
              className={fruit === f ? s.fruitActive : ""}
              onClick={() => setFruit(f)}
            >
              {f}
            </button>
          ))}
          {(query || fruit !== "すべて" || goal !== "すべて") && (
            <button
              className={s.resetFilters}
              onClick={() => {
                setQuery("");
                setFruit("すべて");
                setGoal("すべて");
              }}
            >
              条件をクリア
            </button>
          )}
        </div>
        <div className={s.grid}>
          {shown.map((item) => {
            const c = config(item.id);
            const nutrition = calculateNutrition(
              item,
              c.size,
              c.sweetness,
              c.booster,
            );
            return (
              <article key={item.id}>
                <div className={s.pic}>
                  <Image src={item.image.url} alt={item.name} fill />
                  <span>{item.fruit}</span>
                </div>
                <div className={s.cardBody}>
                  <small>
                    {item.blendType} · {item.goal}
                  </small>
                  <h2>{item.name}</h2>
                  <p>{item.comment}</p>
                  <div className={s.options}>
                    <div>
                      <b>サイズ</b>
                      {(["S", "M", "L"] as Size[]).map((x) => (
                        <button
                          key={x}
                          className={c.size === x ? s.on : ""}
                          onClick={() => setConfig(item.id, "size", x)}
                        >
                          {x}
                        </button>
                      ))}
                    </div>
                    <label>
                      <b>甘さ</b>
                      <select
                        value={c.sweetness}
                        onChange={(e) =>
                          setConfig(
                            item.id,
                            "sweetness",
                            e.target.value as Sweetness,
                          )
                        }
                      >
                        <option>控えめ</option>
                        <option>普通</option>
                        <option>甘め</option>
                      </select>
                    </label>
                    <label>
                      <b>ブースター</b>
                      <select
                        value={c.booster}
                        onChange={(e) =>
                          setConfig(
                            item.id,
                            "booster",
                            e.target.value as Booster,
                          )
                        }
                      >
                        <option>なし</option>
                        <option>チアシード</option>
                        <option>プロテイン</option>
                        <option>ビタミン</option>
                      </select>
                    </label>
                  </div>
                  <div className={s.nutrition} aria-live="polite">
                    <span>
                      <small>エネルギー</small>
                      <b>{nutrition.kcal} kcal</b>
                    </span>
                    <span>
                      <small>たんぱく質</small>
                      <b>{nutrition.protein} g</b>
                    </span>
                    <span>
                      <small>食物繊維</small>
                      <b>{nutrition.fiber} g</b>
                    </span>
                    <span>
                      <small>ビタミンC</small>
                      <b>{nutrition.vitaminC} mg</b>
                    </span>
                  </div>
                  <footer>
                    <b>
                      ¥
                      {item.price + sizeExtra[c.size] + boosterExtra[c.booster]}
                    </b>
                    <div className={s.qty}>
                      <button
                        onClick={() => removeOne(item.id)}
                        disabled={!count(item.id)}
                      >
                        −
                      </button>
                      <span>{count(item.id)}個</span>
                      <button onClick={() => add(item)}>＋</button>
                    </div>
                  </footer>
                </div>
              </article>
            );
          })}
        </div>
        {!shown.length && (
          <p className={s.noResult}>該当するブレンドがありません。</p>
        )}
        <section className={s.cartBar}>
          <div>
            <small>CART</small>
            <strong>{cart.length}点</strong>
          </div>
          <div>
            <small>TOTAL</small>
            <strong>¥{total.toLocaleString()}</strong>
          </div>
          <button
            disabled={!cart.length}
            onClick={() => router.push("/checkout")}
          >
            CHECK OUT →
          </button>
        </section>
      </main>
    </>
  );
}
