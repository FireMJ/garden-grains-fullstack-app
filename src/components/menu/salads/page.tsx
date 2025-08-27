import MenuItemCard from "@/components/MenuItemCard"

export default function SaladsPage() {
  return (
    <main className="px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-green-900 mb-6">Salads</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <MenuItemCard name="Millet Salad" price="98" tags={["V"]} />
        <MenuItemCard name="Tabbouleh Salad" price="98" tags={["V"]} />
        <MenuItemCard name="4 Bean Salad" price="115" tags={["V"]} />
        <MenuItemCard name="Free Range Chicken Salad" price="125" />
        <MenuItemCard name="Protein Pack Salad" price="125" />
        <MenuItemCard name="Quinoa Feta Salad" price="122" />
        <MenuItemCard name="Protein Avocado Stack" price="115" tags={["V"]} />
        <MenuItemCard name="Pesto Glow Salad" price="125" />
        <MenuItemCard name="Live off the Land Salad" price="113" />
      </div>
    </main>
  )
}
