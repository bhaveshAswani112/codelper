"use client"


import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react";





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body >
        <SessionProvider>
              {children}
              <Toaster />
          </SessionProvider>
        </body>
    </html>
  );
}
