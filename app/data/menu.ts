export type Goal = "エネルギー" | "リフレッシュ" | "プロテイン";
export type Nutrition = {
  kcal: number;
  protein: number;
  fiber: number;
  vitaminC: number;
};
export type MenuItem = {
  id: string;
  fruit: string;
  name: string;
  blendType: string;
  price: number;
  comment: string;
  goal: Goal;
  nutrition: Nutrition;
  image: { url: string; width: number; height: number };
};
const img = (name: string) => ({
  url: `/menu/${name}-main.png`,
  width: 1536,
  height: 1024,
});
export const menuItems: MenuItem[] = [
  {
    id: "mango-sun",
    fruit: "マンゴー",
    name: "マンゴーサンライズ",
    blendType: "ヨーグルトブレンド",
    price: 650,
    comment: "完熟マンゴーとヨーグルト",
    goal: "エネルギー",
    nutrition: { kcal: 218, protein: 6.2, fiber: 3.1, vitaminC: 42 },
    image: img("mango"),
  },
  {
    id: "mango-lassi",
    fruit: "マンゴー",
    name: "マンゴーラッシー",
    blendType: "ミルクブレンド",
    price: 680,
    comment: "カルダモン香る濃厚ラッシー",
    goal: "プロテイン",
    nutrition: { kcal: 246, protein: 8.4, fiber: 2.8, vitaminC: 38 },
    image: img("mango"),
  },
  {
    id: "berry-boost",
    fruit: "ベリー",
    name: "ベリーブースト",
    blendType: "ヨーグルトブレンド",
    price: 690,
    comment: "苺・ブルーベリー・ラズベリー",
    goal: "リフレッシュ",
    nutrition: { kcal: 184, protein: 5.8, fiber: 5.4, vitaminC: 48 },
    image: img("berry"),
  },
  {
    id: "berry-protein",
    fruit: "ベリー",
    name: "ベリープロテイン",
    blendType: "プロテインブレンド",
    price: 760,
    comment: "ベリーと植物性プロテイン",
    goal: "プロテイン",
    nutrition: { kcal: 232, protein: 18.6, fiber: 6.2, vitaminC: 44 },
    image: img("berry"),
  },
  {
    id: "kiwi-mint",
    fruit: "キウイ",
    name: "キウイミント",
    blendType: "ウォーターブレンド",
    price: 620,
    comment: "キウイとミントの爽快感",
    goal: "リフレッシュ",
    nutrition: { kcal: 142, protein: 2.4, fiber: 4.2, vitaminC: 82 },
    image: img("kiwi"),
  },
  {
    id: "kiwi-green",
    fruit: "キウイ",
    name: "グリーンキウイ",
    blendType: "ベジタブルブレンド",
    price: 680,
    comment: "キウイ・ほうれん草・りんご",
    goal: "エネルギー",
    nutrition: { kcal: 176, protein: 4.1, fiber: 5.8, vitaminC: 76 },
    image: img("kiwi"),
  },
  {
    id: "banana-oat",
    fruit: "バナナ",
    name: "バナナオーツ",
    blendType: "オーツミルクブレンド",
    price: 640,
    comment: "バナナと香ばしいオーツ",
    goal: "エネルギー",
    nutrition: { kcal: 264, protein: 7.2, fiber: 5.1, vitaminC: 14 },
    image: img("banana"),
  },
  {
    id: "banana-protein",
    fruit: "バナナ",
    name: "バナナプロテイン",
    blendType: "プロテインブレンド",
    price: 740,
    comment: "運動後におすすめの一杯",
    goal: "プロテイン",
    nutrition: { kcal: 298, protein: 21.4, fiber: 4.8, vitaminC: 12 },
    image: img("banana"),
  },
  {
    id: "pine-coco",
    fruit: "パイナップル",
    name: "パインココナッツ",
    blendType: "ココナッツブレンド",
    price: 700,
    comment: "南国らしい爽やかな甘さ",
    goal: "リフレッシュ",
    nutrition: { kcal: 226, protein: 3.6, fiber: 4.0, vitaminC: 58 },
    image: img("pineapple"),
  },
  {
    id: "pine-ginger",
    fruit: "パイナップル",
    name: "パインジンジャー",
    blendType: "ウォーターブレンド",
    price: 660,
    comment: "生姜が香るすっきりブレンド",
    goal: "エネルギー",
    nutrition: { kcal: 158, protein: 2.1, fiber: 3.5, vitaminC: 61 },
    image: img("pineapple"),
  },
  {
    id: "orange-peach",
    fruit: "オレンジ",
    name: "オレンジピーチ",
    blendType: "ジュースブレンド",
    price: 650,
    comment: "オレンジと桃のジューシー感",
    goal: "リフレッシュ",
    nutrition: { kcal: 196, protein: 2.8, fiber: 3.8, vitaminC: 74 },
    image: img("orange"),
  },
  {
    id: "orange-carrot",
    fruit: "オレンジ",
    name: "オレンジキャロット",
    blendType: "ベジタブルブレンド",
    price: 630,
    comment: "人参と柑橘の自然な甘さ",
    goal: "エネルギー",
    nutrition: { kcal: 168, protein: 3.2, fiber: 5.2, vitaminC: 86 },
    image: img("orange"),
  },
];
