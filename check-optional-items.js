const { bowls, commonAddOns, friesUpsell, juiceGroup, bowlDressings, bowlBases } = require('./src/data/bowlsData');

console.log('🔍 DIAGNOSTIC CHECK: Optional Items Display\n');

// Check if data arrays exist and have content
console.log('1. Checking data arrays:');
console.log(`   commonAddOns: ${commonAddOns.length} items`, commonAddOns.length > 0 ? '✅' : '❌');
console.log(`   friesUpsell: ${friesUpsell.length} items`, friesUpsell.length > 0 ? '✅' : '❌');
console.log(`   juiceGroup: ${juiceGroup.length} sizes`, juiceGroup.length > 0 ? '✅' : '❌');
console.log(`   bowlDressings: ${bowlDressings.length} items`, bowlDressings.length > 0 ? '✅' : '❌');
console.log(`   bowlBases: ${bowlBases.length} items`, bowlBases.length > 0 ? '✅' : '❌');

// Check bowl structure
console.log('\n2. Checking bowl structure:');
bowls.forEach((bowl, index) => {
  console.log(`   Bowl ${index + 1}: ${bowl.name}`);
  console.log(`     - Has addOns property: ${bowl.hasOwnProperty('addOns')} ${bowl.addOns ? `(${bowl.addOns.length} items)` : 'undefined'}`);
  console.log(`     - Has friesUpsell property: ${bowl.hasOwnProperty('friesUpsell')} ${bowl.friesUpsell ? `(${bowl.friesUpsell.length} items)` : 'undefined'}`);
  console.log(`     - Has juiceUpsell property: ${bowl.hasOwnProperty('juiceUpsell')} ${bowl.juiceUpsell ? `(${bowl.juiceUpsell.length} sizes)` : 'undefined'}`);
});

// Check if imports are working
console.log('\n3. Checking import structure:');
console.log('   commonAddOns sample:', commonAddOns.slice(0, 2));
console.log('   friesUpsell sample:', friesUpsell.slice(0, 2));
console.log('   juiceGroup structure:', juiceGroup.map(g => ({ size: g.size, options: g.options.length })));

// Check the modal rendering conditions
console.log('\n4. Modal rendering conditions:');
console.log('   Add-ons section should show if: commonAddOns.length > 0');
console.log('   Fries section should show if: friesUpsell.length > 0');
console.log('   Juice section should show if: juiceGroup.length > 0');

// Check for any potential issues
console.log('\n5. Potential issues:');
if (commonAddOns.length === 0) console.log('   ❌ commonAddOns array is empty');
if (friesUpsell.length === 0) console.log('   ❌ friesUpsell array is empty');
if (juiceGroup.length === 0) console.log('   ❌ juiceGroup array is empty');

console.log('\n✅ Diagnostic complete. Check above for any ❌ marks.');
