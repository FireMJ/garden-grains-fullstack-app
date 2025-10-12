const SimpleMenuItemCard = ({ name, price, tags, image, className }) => {
  const [showAddOns, setShowAddOns] = useState(false);
  const addOns = ["Extra Avocado", "Protein Boost", "Gluten-Free Bread"];
  
  // Store which add-ons are selected
  const [selectedAddOns, setSelectedAddOns] = useState(
    () => addOns.reduce((acc, addon) => ({ ...acc, [addon]: false }), {})
  );

  const toggleAddOn = (addon) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [addon]: !prev[addon],
    }));
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="relative h-48 w-full">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <p className="text-[#F4A261] font-bold">R{price}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {tags?.map((tag, index) => (
            <span key={index} className="bg-[#6C7B58] text-white text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => setShowAddOns((prev) => !prev)}
          className="mt-3 px-3 py-1 bg-[#F4A261] text-white rounded hover:bg-[#e68e42] transition text-xs sm:text-sm"
        >
          Customize Your Order
        </button>

        {showAddOns && (
          <div className="mt-2 flex flex-col gap-2">
            {addOns.map((addon) => (
              <label key={addon} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-[#F4A261]"
                  checked={selectedAddOns[addon]}
                  onChange={() => toggleAddOn(addon)}
                />
                {addon}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
