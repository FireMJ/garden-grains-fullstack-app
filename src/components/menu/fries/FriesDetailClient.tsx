import { Product } from "@/types";
import React from "react";

export default function FriesDetailClient({ item, addOns, optionalExtras }: any) {
  return <div>{item?.name || "Item name"}</div>;
}
