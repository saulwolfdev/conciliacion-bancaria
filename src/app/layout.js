"use client";
import { Inter } from "next/font/google";
import "./ui/globals.css";
import { setupTokenRefresh } from '../utils/auth';
import { useEffect } from 'react';
import Cookies from 'js-cookie';


const inter = Inter({ subsets: ["latin"] });
export const datos_prueba = false;

export const removeAllCookies = () => {
  const allCookies = Cookies.get(); 

  Object.keys(allCookies).forEach(cookieName => {
    Cookies.remove(cookieName);
  });
};

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

