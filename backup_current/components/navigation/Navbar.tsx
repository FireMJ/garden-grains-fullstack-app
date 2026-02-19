import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-emerald-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-2xl font-bold">Garden & Grains</Link>
      <div className="space-x-6 text-sm font-medium">
        <Link href="/menu">Menu</Link>
        <Link href="/schedule">Schedule an Order</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  )
}

