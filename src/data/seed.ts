// src/data/seed.ts

const seedData = {
  catalog: {
    diagnostic: [
      { id: 1, name: 'Diagnostic Service A', price: 100 },
      { id: 2, name: 'Diagnostic Service B', price: 150 }
    ],
    repair: [
      { id: 3, name: 'Repair Service A', price: 200 },
      { id: 4, name: 'Repair Service B', price: 250 }
    ],
    maintenance: [
      { id: 5, name: 'Maintenance Service A', price: 80 },
      { id: 6, name: 'Maintenance Service B', price: 120 }
    ],
    part: [
      { id: 7, name: 'Part A', price: 50 },
      { id: 8, name: 'Part B', price: 70 }
    ],
    labor: [
      { id: 9, name: 'Labor A', price: 90 },
      { id: 10, name: 'Labor B', price: 110 }
    ],
    equipmentReplacement: [
      { id: 11, name: 'Equipment A', price: 500 },
      { id: 12, name: 'Equipment B', price: 700 }
    ]
  },
  defaultPackages: [
    { id: 1, name: 'Standard Package', price: 500 },
    { id: 2, name: 'Premium Package', price: 1000 }
  ],
  taxRate: 0.07 // example tax rate
};

export default seedData;