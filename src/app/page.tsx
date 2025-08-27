"use client";
import Link from "next/link";
import MenuItemCard from "@/components/MenuItemCard";
import "@/styles/homepage.css";
import AddOnCard from "@/components/AddOnCard";
import PageWrapper from "@/components/layout/PageWrapper";
import FeatureCard from "@/components/ui/FeatureCard";

export default function HomePage() {
  return (
    <PageWrapper>
      <main className="min-h-screen w-screen overflow-x-hidden">
        {/* 🌿 Sticky Header */}
        <header className="bg-[#FAF7F2] text-[#2F5D50] px-6 sm:px-12 py-4 sticky top-0 z-50 shadow-sm">
  <div className="flex items-center justify-between">
    {/* Logo + Tagline */}
    <div className="flex items-center gap-4">
      <img src="/logo.png" alt="Garden & Grains Logo" className="h-14 sm:h-16 w-auto object-contain" />
      <div className="flex flex-col">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2F5D50]">
          Garden &amp; Grains
        </h1>
      </div>
    </div>

    {/* Navigation */}
    <div className="flex flex-wrap items-center gap-3">
      <Link href="/admin"><button className="nav-btn">Admin</button></Link>
      <Link href="/signin"><button className="nav-btn">Sign In</button></Link>
      <Link href="/signup"><button className="nav-btn">Sign Up</button></Link>
      <Link href="/cart">
        <button className="cart-icon">
          🛒
          <span className="cart-badge">2</span>
        </button>
      </Link>
    </div>
  </div>
</header>


        {/* 🌟 Why Choose + Explore Menu Section */}
      <section className="section-padding bg-gradient-to-b from-[#FAF7F2] to-[#F3F5F0] rounded-xl shadow-inner">
  <div className="section-container text-center">
    <h3 className="text-4xl font-extrabold text-[#2F5D50] mb-6">Explore Our Menu</h3>
    <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
      Fresh, wholesome dishes designed to nourish and delight — discover your next favorite.
    </p>
    <div className="flex flex-wrap justify-center gap-4">
      {[
        { name: "Salads", href: "/menu/salads" },
        { name: "Stir Fry", href: "/menu/stir-fry" },
        { name: "Bowls", href: "/menu/bowls" },
        { name: "Toasties", href: "/menu/toasties" },
        { name: "Wraps", href: "/menu/wraps" },
        { name: "Soups", href: "/menu/soups" },
        { name: "Pastas", href: "/menu/pastas" },
        { name: "Breakfast", href: "/menu/breakfast" },
        { name: "Smoothies", href: "/menu/smoothies" },
        { name: "Juices", href: "/menu/juices" },
      ].map(({ name, href }) => (
        <Link
          key={name}
          href={href}
          className="px-5 py-2 rounded-full bg-[#F4A261] text-white font-medium hover:bg-[#e68e42] transition"
        >
          {name}
        </Link>
      ))}
    </div>
  </div>
</section>



        {/* ❤️ Customer Favorites */}
        <section className="section-padding">
          <h2 className="section-title">Customer Favorites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="menu-card">
              <MenuItemCard name="Protein Pack Salad" price="125" tags={["Popular"]} />
            </div>
            <div className="menu-card">
              <MenuItemCard name="Chicken Avo Wrap" price="115" tags={["Customer Favorite", "New"]} />
            </div>
            <div className="menu-card">
              <MenuItemCard name="Avocado Protein Stack Salad" price="115" tags={["Vegetarian"]} />
            </div>
          </div>
        </section>

        {/* ➕ Add-Ons */}
        <section className="section-padding">
          <h2 className="section-title">Add-Ons & Extras</h2>
          <p className="text-gray-600 mb-4 text-center">Customize your meal with sauces, sides, and drinks.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <AddOnCard name="Poached Egg" price={10} />
            <AddOnCard name="Feta Cheese" price={8} />
            <AddOnCard name="Tahini Sauce" price={6} />
            <AddOnCard name="Avocado Slices" price={12} />
          </div>
        </section>

        {/* 🎉 Catering Promo */}
        <section className="bg-yellow-50 p-8 rounded-lg text-center mb-16 mx-4">
          <h2 className="text-3xl font-bold text-yellow-800 mb-2">Hosting a Gathering?</h2>
          <p className="text-gray-700 mb-4">Let us cater your next event with wholesome, crowd-pleasing dishes.</p>
          <Link href="/catering" className="btn-secondary">Explore Catering Options</Link>
        </section>

        {/* 💰 Promo Badge */}
        <section className="text-center mb-16">
          <div className="promo-badge">R30 OFF Your First Order</div>
          <p className="mt-2 text-gray-600">Available for self-collection, takeaway, and delivery.</p>
        </section>

        <section className="bg-[#F3F5F0] text-[#2F5D50] py-12 px-6 sm:px-12 text-center">
  <div className="max-w-3xl mx-auto">
    <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
    <p className="text-lg text-[#4A665E] leading-relaxed">
      A cozy, modern neighborhood spot where clean eating meets community. Fresh, flavorful, and halaal-friendly — made for locals, remote workers, students, health enthusiasts and anyone craving wholesome food.
    </p>
  </div>
</section>


        {/* 🔗 Footer */}
        <footer className="text-center text-sm text-gray-500 mt-12 px-4">
          <p>© 2025 Garden & Grains • Halaal Friendly • Follow us @garden.and.grains</p>
        </footer>
      </main>
    </PageWrapper>
  );
}
