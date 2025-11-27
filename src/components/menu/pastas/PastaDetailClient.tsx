import { Product } from "@/types";
import React from "react";

export default function PastaDetailClient({ item, addOns, optionalExtras }: any) {
  return <div>{item?.name || "Item name"}</div>;
}
