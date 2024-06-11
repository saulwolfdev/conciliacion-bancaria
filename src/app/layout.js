"use client";
import { Inter } from "next/font/google";
import "./ui/globals.css";
import { setupTokenRefresh } from '../utils/auth';
import { useEffect } from 'react';


const inter = Inter({ subsets: ["latin"] });
export const datos_prueba = false;


export default function RootLayout({ children }) {
  useEffect(() => {
    setupTokenRefresh();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

