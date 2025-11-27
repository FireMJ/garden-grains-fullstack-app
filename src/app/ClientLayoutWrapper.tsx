"use client";

import React from "react";
import ClientProviders from "./ClientProviders";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <ClientProviders>
          {children}
        </ClientProviders>
      </CartProvider>
    </AuthProvider>
  );
}
