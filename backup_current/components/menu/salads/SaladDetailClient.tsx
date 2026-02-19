import { Product } from "@/types";
import React from "react";

export default function SaladDetailClient({ item, addOns, optionalExtras }: any) {
  return <div>{item?.name || "Item name"}</div>;
}
