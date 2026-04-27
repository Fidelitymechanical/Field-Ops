import { FieldOpsDB } from './db';

const seedData = {
  catalog: {
    diagnostic: [
      { id: 1, name: 'Diagnostic Service A', price: 100 },
      { id: 2, name: 'Diagnostic Service B', price: 150 },
    ],
    repair: [
      { id: 3, name: 'Repair Service A', price: 200 },
      { id: 4, name: 'Repair Service B', price: 250 },
    ],
    maintenance: [
      { id: 5, name: 'Maintenance Service A', price: 80 },
      { id: 6, name: 'Maintenance Service B', price: 120 },
    ],
    part: [
      { id: 7, name: 'Part A', price: 50 },
      { id: 8, name: 'Part B', price: 70 },
    ],
    labor: [
      { id: 9, name: 'Labor A', price: 90 },
      { id: 10, name: 'Labor B', price: 110 },
    ],
    equipmentReplacement: [
      { id: 11, name: 'Equipment A', price: 500 },
      { id: 12, name: 'Equipment B', price: 700 },
    ],
  },
  taxRate: 0.07,
};

export default seedData;

export async function seedDatabase(db: FieldOpsDB) {
  const clientIds = (await db.clients.bulkAdd(
    [
      { name: 'Apex Manufacturing', email: 'contact@apexmfg.com', phone: '(555) 201-4433', address: '1200 Industrial Blvd, Houston TX 77001' },
      { name: 'Greenfield Office Park', email: 'facilities@greenfield.com', phone: '(555) 348-9900', address: '450 Commerce Dr, Dallas TX 75201' },
      { name: 'Riverside Medical Center', email: 'maint@riversidemedical.org', phone: '(555) 912-7750', address: '800 Hospital Way, Austin TX 78701' },
    ],
    { allKeys: true }
  )) as number[];

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  await db.calls.bulkAdd([
    { clientId: clientIds[0], date: today, duration: 90, notes: 'Rooftop unit 3 not cooling properly. Refrigerant low.', status: 'InProgress' },
    { clientId: clientIds[1], date: today, duration: 60, notes: 'Annual maintenance visit scheduled.', status: 'Pending' },
    { clientId: clientIds[2], date: yesterday, duration: 120, notes: 'Emergency repair — compressor failure in west wing.', status: 'Completed' },
    { clientId: clientIds[0], date: lastWeek, duration: 45, notes: 'Thermostat replacement and calibration.', status: 'Completed' },
    { clientId: clientIds[1], date: lastWeek, duration: 75, notes: 'Filter replacement and duct inspection.', status: 'Completed' },
  ]);

  const est1Items = [
    { description: 'Refrigerant recharge (R-410A)', quantity: 2, unitPrice: 95 },
    { description: 'Leak detection service', quantity: 1, unitPrice: 150 },
    { description: 'Labor — 3 hrs', quantity: 3, unitPrice: 90 },
  ];
  const est1Sub = est1Items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  const est2Items = [
    { description: 'Compressor replacement (5-ton)', quantity: 1, unitPrice: 680 },
    { description: 'Installation labor — 4 hrs', quantity: 4, unitPrice: 110 },
    { description: 'Refrigerant recharge', quantity: 1, unitPrice: 95 },
  ];
  const est2Sub = est2Items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  await db.estimates.bulkAdd([
    {
      clientId: clientIds[0],
      date: today,
      items: est1Items,
      subtotal: est1Sub,
      taxRate: 0.07,
      total: parseFloat((est1Sub * 1.07).toFixed(2)),
      status: 'Draft',
      notes: 'Pending approval from facility manager.',
    },
    {
      clientId: clientIds[2],
      date: yesterday,
      items: est2Items,
      subtotal: est2Sub,
      taxRate: 0.07,
      total: parseFloat((est2Sub * 1.07).toFixed(2)),
      status: 'Accepted',
      notes: 'Approved — work completed.',
    },
  ]);

  const dueDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  await db.invoices.bulkAdd([
    {
      clientId: clientIds[2],
      date: yesterday,
      dueDate,
      amount: parseFloat((est2Sub * 1.07).toFixed(2)),
      status: 'Unpaid',
      notes: 'Emergency compressor replacement — west wing.',
    },
    {
      clientId: clientIds[1],
      date: lastWeek,
      dueDate: lastWeek,
      amount: 480.0,
      status: 'Paid',
      notes: 'Annual maintenance contract Q1.',
    },
  ]);
}
