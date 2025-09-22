import Image from "next/image";
import { getFavoriteImages } from "@/server/getFavoriteImages";

export default function FavoritesTestPage() {
  const images = getFavoriteImages(); // runs on server

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Favorites Image Test</h1>
      <p className="mb-2">Found {images.length} image(s)</p>
      <ul className="list-disc pl-6 mb-6">
        {images.map((src) => (
          <li key={src} className="break-all">{src}</li>
        ))}
      </ul>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, i) => (
          <div key={src} className="relative w-full h-[220px] rounded-lg overflow-hidden border">
            <Image src={src} alt={`Favorite ${i + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>
    </main>
  );
}
