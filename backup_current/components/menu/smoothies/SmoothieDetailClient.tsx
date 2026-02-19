import { Product } from "@/types";
import React from "react";

export default function SmoothieDetailClient({ item, addOns, optionalExtras }: any) {
  return <div>{item?.name || "Item name"}</div>;
}
