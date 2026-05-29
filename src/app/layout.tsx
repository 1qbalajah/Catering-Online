import type { Metadata } from "next";
import SessionWatcher from "@/components/SessionWatcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catering Online",
  description: "Role-based catering dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <SessionWatcher />
        {children}
      </body>
    </html>
  );
}
