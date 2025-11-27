import { Product } from "@/types";
"use client";

import React from "react";
import { smoothies } from "@/data/smoothiesData";
import AddOnsData from "@/data/addOns";
import OptionalExtrasData from "@/data/optionalExtras";

export default function SmoothiesDetailClient({ item, addOns, optionalExtras }: any) {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">{item.name}</h1>
      {item.image && (
        <img src={item.image} alt={item.name} className="w-full max-w-md rounded-lg" />
      )}
      <p className="text-gray-700">{item.description}</p>
      <p className="font-semibold">Price: {item.price}</p>

      {addOns && addOns.length > 0 && (
        <div>
          <h2 className="font-semibold mt-4">Add-Ons</h2>
          <ul className="list-disc list-inside">
            {addOns.map((a: any) => (
              <li key={a.id}>{a.name} (+{a.price})</li>
            ))}
          </ul>
        </div>
      )}

      {optionalExtras && optionalExtras.length > 0 && (
        <div>
          <h2 className="font-semibold mt-4">Optional Extras</h2>
          <ul className="list-disc list-inside">
            {optionalExtras.map((o: any) => (
              <li key={o.id}>{o.name} (+{o.price})</li>
            ))}
          </ul>
        </div>
      )}

      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Add to Cart
      </button>
    </div>
  );
}
