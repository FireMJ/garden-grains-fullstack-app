"use client"
import { useState } from "react"
import FilterBar from "@/components/FilterBar"
import MenuItemCard from "@/components/MenuItemCard"

const menuItems = [/* your sample data */]

export default function MenuPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const toggleFilter = (tag: string) => {
    setActiveFilters(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const filteredItems = activeFilters.length
    ? menuItems.filter(item =>
        item.tags?.some(tag => activeFilters.includes(tag))
      )
    : menuItems

  return (
    <section className="px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Our Menu</h1>
      <FilterBar activeFilters={activeFilters} onToggleFilter={toggleFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => (
          <MenuItemCard key={item.name} {...item} />
        ))}
      </div>
    </section>
  )
}
