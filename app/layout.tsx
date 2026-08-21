import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  title: "PULSE | Smoothie Bar",
  description: "スムージーのカスタム注文アプリ",
};
