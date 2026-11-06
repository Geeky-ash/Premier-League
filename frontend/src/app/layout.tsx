import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Premier League Analytics // Next.js & FastAPI Intelligence Suite",
  description: "Unified AI analytics platform integrating Linear Regression, XGBoost, and K-Means for Premier League data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0E14] text-slate-100 flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
