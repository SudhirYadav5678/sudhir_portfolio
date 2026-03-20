import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sudhir Yadav | Software Developer",
  description:
    "Portfolio of Sudhir Yadav — FullStack Developer & App Developer based in Delhi.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
