import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediLink - Smart Healthcare Appointment System",
  description: "Book and manage healthcare appointments efficiently",
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
