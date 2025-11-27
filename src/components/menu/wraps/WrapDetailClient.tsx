import { Product } from "@/types";
import React from "react";

export default function WrapDetailClient({ item, addOns, optionalExtras }: any) {
  return <div>{item?.name || "Item name"}</div>;
}
