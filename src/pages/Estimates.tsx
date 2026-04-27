import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Estimate, LineItem } from '../data/db';
import seedData from '../data/seed';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const TAX_RATE = seedData.taxRate;

const allCatalogItems = [
  ...seedData.catalog.diagnostic,
  ...seedData.catalog.repair,
  ...seedData.catalog.maintenance,
  ...seedData.catalog.part,
  ...seedData.catalog.labor,
  ...seedData.catalog.equipmentReplacement,
];

const statusColors: Record<Estimate['status'], string> = {
  Draft: 'bg-gray-800 text-gray-400',
  Sent: 'bg-blue-900 text-blue-300',
  Accepted: 'bg-green-900 text-green-300',
  Rejected: 'bg-red-900 text-red-400',
};

const Estimates: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Estimate | null>(null);
  const [clientId, setClientId] = useState('');
  const [items, setItems] = useState<LineItem[]>([]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Estimate['status']>('Draft');

  const clients = useLiveQuery(() => db.clients.orderBy('name').toArray(), []);
  const estimates = useLiveQuery(() => db.estimates.orderBy('date').reverse().toArray(), []);

  const getClientName = (id: number) => clients?.find(c => c.id === id)?.name ?? 'Unknown';

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const openAdd = () => {
    setEditing(null);
    setClientId(clients?.[0]?.id?.toString() ?? '');
    setItems([]);
    setNotes('');
    setStatus('Draft');
    setShowModal(true);
  };

  const openEdit = (est: Estimate) => {
    setEditing(est);
    setClientId(est.clientId.toString());
    setItems(est.items);
    setNotes(est.notes ?? '');
    setStatus(est.status);
    setShowModal(true);
  };

  const addCatalogItem = (item: { name: string; price: number }) => {
    setItems(prev => [...prev, { description: item.name, quantity: 1, unitPrice: item.price }]);
  };

  const addBlankItem = () => {
    setItems(prev => [...prev, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const updateItem = (idx: number, field: keyof LineItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const removeItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!clientId) return;
    const sub = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const data: Omit<Estimate, 'id'> = {
      clientId: parseInt(clientId),
      date: new Date().toISOString().split('T')[0],
      items,
      subtotal: sub,
      taxRate: TAX_RATE,
      total: parseFloat((sub * (1 + TAX_RATE)).toFixed(2)),
      status,
      notes,
    };
    if (editing?.id) {
      await db.estimates.update(editing.id, data);
    } else {
      await db.estimates.add(data);
    }
    setShowModal(false);
  };

  const createInvoice = async (est: Estimate) => {
    const dueDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    await db.invoices.add({
      clientId: est.clientId,
      estimateId: est.id!,
      date: new Date().toISOString().split('T')[0],
      dueDate,
      amount: est.total,
      status: 'Unpaid',
      notes: `From estimate #${est.id}`,
    });
    await db.estimates.update(est.id!, { status: 'Accepted' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this estimate?')) {
      await db.estimates.delete(id);
    }
  };

  const selectClass = 'w-full bg-[#1f1f1f] text-offWhite font-sans font-light border border-borderColor rounded px-4 py-2 focus:outline-none focus:border-gold transition-colors';
  const labelClass = 'block text-offWhite font-sans font-light mb-2 text-sm';
  const inputClass = 'bg-[#1f1f1f] text-offWhite font-sans font-light border border-borderColor rounded px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors';

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-light text-gold">Estimates</h1>
          <p className="text-gray-500 text-sm mt-1 font-sans">{estimates?.length ?? 0} total</p>
        </div>
        <Button onClick={openAdd}>+ New Estimate</Button>
      </div>

      <div className="bg-[#1a1a1a] border border-borderColor rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-borderColor">
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-6 py-4">Client</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Date</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Items</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Total</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Status</th>
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody>
            {estimates?.map(est => (
              <tr key={est.id} className="border-b border-borderColor hover:bg-white hover:bg-opacity-[0.03] transition-colors">
                <td className="px-6 py-4 text-offWhite font-sans text-sm font-medium">{getClientName(est.clientId)}</td>
                <td className="px-4 py-4 text-gray-400 font-sans text-sm">{est.date}</td>
                <td className="px-4 py-4 text-gray-400 font-sans text-sm">{est.items.length} item{est.items.length !== 1 ? 's' : ''}</td>
                <td className="px-4 py-4 text-gold font-mono text-sm">${est.total.toFixed(2)}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${statusColors[est.status]}`}>
                    {est.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {(est.status === 'Draft' || est.status === 'Sent') && (
                    <button onClick={() => createInvoice(est)} className="text-green-400 hover:text-green-300 text-sm transition-colors mr-4">
                      → Invoice
                    </button>
                  )}
                  <button onClick={() => openEdit(est)} className="text-gold hover:text-offWhite text-sm transition-colors mr-4">Edit</button>
                  <button onClick={() => handleDelete(est.id!)} className="text-red-500 hover:text-red-300 text-sm transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {estimates?.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-600 font-sans text-sm">No estimates yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Estimate' : 'New Estimate'} maxWidth="max-w-2xl">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Client</label>
              <select value={clientId} onChange={e => setClientId(e.target.value)} className={selectClass}>
                {clients?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as Estimate['status'])} className={selectClass}>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Quick Add from Catalog</label>
            <div className="flex flex-wrap gap-2">
              {allCatalogItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => addCatalogItem(item)}
                  className="px-3 py-1.5 text-xs font-sans bg-white bg-opacity-5 text-gray-300 hover:text-gold hover:bg-opacity-10 rounded border border-borderColor transition-colors"
                >
                  {item.name} · ${item.price}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className={`${labelClass} mb-0`}>Line Items</label>
              <button onClick={addBlankItem} className="text-gold text-sm hover:text-offWhite transition-colors">+ Add Row</button>
            </div>
            {items.length === 0 && (
              <p className="text-gray-600 text-sm font-sans py-4 text-center border border-dashed border-borderColor rounded">
                No items — add from catalog or click + Add Row
              </p>
            )}
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    value={item.description}
                    onChange={e => updateItem(idx, 'description', e.target.value)}
                    placeholder="Description"
                    className={`${inputClass} flex-1`}
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    className={`${inputClass} w-16`}
                    placeholder="Qty"
                    min="0"
                  />
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={e => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className={`${inputClass} w-24`}
                    placeholder="$/unit"
                    min="0"
                  />
                  <span className="text-gray-500 font-mono text-xs w-20 text-right">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </span>
                  <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-300 transition-colors text-sm">✕</button>
                </div>
              ))}
            </div>
          </div>

          {items.length > 0 && (
            <div className="border-t border-borderColor pt-4 space-y-1.5">
              <div className="flex justify-between text-sm font-sans text-gray-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-sans text-gray-400">
                <span>Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-mono text-gold font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-[#1f1f1f] text-offWhite font-sans font-light border border-borderColor rounded px-4 py-2 focus:outline-none focus:border-gold h-20 resize-none transition-colors"
              placeholder="Estimate notes..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave}>{editing ? 'Save Changes' : 'Create Estimate'}</Button>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Estimates;
