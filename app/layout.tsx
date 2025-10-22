import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bill & Subscription Tracker",
  description: "A simple, clean web app for tracking recurring bills and subscriptions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
