import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-br from-green-700 to-emerald-900 text-white py-20 px-6 text-center">
      <div className="max-w-none">
        {/* Logo + Brand Name */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <img src="/your-logo-file.png" alt="Garden & Grains Logo" className="w-20 h-auto object-contain" />
          <h1 className="text-7xl font-extrabold tracking-tight drop-shadow-xl bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent animate-shimmer">
            Garden &amp; Grains
          </h1>
        </div>


        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <Link href="/menu">
            <button className="bg-white text-green-800 font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition">
              View Menu
            </button>
          </Link>
          <Link href="/catering">
            <button className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full shadow-md hover:bg-yellow-500 transition">
              Book Catering
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
