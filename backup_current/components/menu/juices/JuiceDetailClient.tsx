import { Product } from "@/types";
import React from "react";

export default function JuiceDetailClient({ item, addOns, optionalExtras }: any) {
  return <div>{item?.name || "Item name"}</div>;
}
