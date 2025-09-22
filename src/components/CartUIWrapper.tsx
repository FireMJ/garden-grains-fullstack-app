"use client";

import React from "react";
import FloatingCartButton from "./FloatingCartButton";
import CartDrawer from "./CartDrawer";

export default function CartUIWrapper() {
  return (
    <>
      <FloatingCartButton />
      <CartDrawer />
    </>
  );
}
