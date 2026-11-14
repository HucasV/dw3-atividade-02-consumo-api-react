import "./globals.css";

export const metadata = {
  title: "Astral Archive | Honkai: Star Rail",
  description: "Um arquivo interativo de personagens de Honkai: Star Rail."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
