const fs = require('fs');
const path = require('path');

const requiredImages = {
  bowls: ['beef_glow.jpg', 'chicken_bowl.jpg', 'vegan_bowl.jpg', 'salmon_bowl.jpg'],
  breakfast: ['oatmeal.jpg', 'smoothie_bowl.jpg', 'avocado_toast.jpg'],
  chicken: ['grilled_chicken.jpg', 'chicken_wrap.jpg', 'chicken_salad.jpg'],
  fries: ['sweet_potato_fries.jpg', 'regular_fries.jpg', 'curly_fries.jpg'],
  juices: ['green_juice.jpg', 'orange_juice.jpg', 'berry_blast.jpg'],
  pastas: ['pesto_pasta.jpg', 'alfredo_pasta.jpg', 'bolognese.jpg'],
  salads: ['caesar_salad.jpg', 'greek_salad.jpg', 'quinoa_salad.jpg'],
  smoothies: ['berry_smoothie.jpg', 'green_smoothie.jpg', 'tropical_smoothie.jpg'],
  soups: ['tomato_soup.jpg', 'pumpkin_soup.jpg', 'lentil_soup.jpg'],
  stirfries: ['vegetable_stirfry.jpg', 'chicken_stirfry.jpg', 'beef_stirfry.jpg'],
  toasties: ['grilled_cheese.jpg', 'ham_cheese.jpg', 'tuna_melt.jpg'],
  wraps: ['chicken_wrap.jpg', 'veggie_wrap.jpg', 'falafel_wrap.jpg']
};

console.log('🔍 Verifying images...\n');

let missingCount = 0;
let totalRequired = 0;

for (const [category, images] of Object.entries(requiredImages)) {
  const categoryPath = path.join(process.cwd(), 'public', 'images', category);
  totalRequired += images.length;
  
  console.log(`📁 ${category.toUpperCase()}:`);
  
  for (const image of images) {
    const imagePath = path.join(categoryPath, image);
    if (fs.existsSync(imagePath)) {
      console.log(`  ✅ ${image}`);
    } else {
      console.log(`  ❌ ${image} - MISSING`);
      missingCount++;
      
      // Create a placeholder for missing images
      const placeholderPath = path.join(categoryPath, image);
      const placeholderDir = path.dirname(placeholderPath);
      
      if (!fs.existsSync(placeholderDir)) {
        fs.mkdirSync(placeholderDir, { recursive: true });
      }
      
      // Create a simple placeholder image using base64
      const svgContent = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#2F5D50"/>
        <text x="200" y="150" font-family="Arial" font-size="20" fill="white" text-anchor="middle">${image.replace('.jpg', '').replace(/_/g, ' ')}</text>
        <text x="200" y="180" font-family="Arial" font-size="14" fill="#ccc" text-anchor="middle">Garden & Grains</text>
      </svg>`;
      
      // Save as SVG (since we can't easily create JPGs)
      const svgPath = imagePath.replace('.jpg', '.svg');
      fs.writeFileSync(svgPath, svgContent);
      console.log(`  📝 Created placeholder: ${path.basename(svgPath)}`);
    }
  }
  console.log('');
}

console.log(`\n📊 Summary:`);
console.log(`  Total images required: ${totalRequired}`);
console.log(`  Missing images: ${missingCount}`);
console.log(`  Placeholders created: ${missingCount}`);
console.log(`\n✅ Image verification complete!`);
