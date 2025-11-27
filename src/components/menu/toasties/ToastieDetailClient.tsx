import { Product } from "@/types";
import React from "react";

export default function ToastieDetailClient({ item, addOns, optionalExtras }: any) {
  return <div>{item?.name || "Item name"}</div>;
}
