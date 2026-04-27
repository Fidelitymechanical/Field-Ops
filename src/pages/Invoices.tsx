import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Invoice } from '../data/db';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

type StatusFilter = 'All' | Invoice['status'];

const statusColors: Record<Invoice['status'], string> = {
  Unpaid: 'bg-yellow-900 text-yellow-300',
  Paid: 'bg-green-900 text-green-300',
  Overdue: 'bg-red-900 text-red-400',
};

const filterTabs: StatusFilter[] = ['All', 'Unpaid', 'Paid', 'Overdue'];

type FormState = { clientId: string; amount: string; dueDate: string; notes: string };

const Invoices: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>({ clientId: '', amount: '', dueDate: '', notes: '' });

  const clients = useLiveQuery(() => db.clients.orderBy('name').toArray(), []);
  const invoices = useLiveQuery(() => db.invoices.orderBy('date').reverse().toArray(), []);

  const getClientName = (id: number) => clients?.find(c => c.id === id)?.name ?? 'Unknown';
  const filtered = invoices?.filter(inv => statusFilter === 'All' || inv.status === statusFilter);

  const outstanding = invoices?.filter(inv => inv.status === 'Unpaid').reduce((sum, inv) => sum + inv.amount, 0) ?? 0;
  const unpaidCount = invoices?.filter(inv => inv.status === 'Unpaid').length ?? 0;

  const markPaid = async (id: number) => {
    await db.invoices.update(id, { status: 'Paid' });
  };

  const markOverdue = async (id: number) => {
    await db.invoices.update(id, { status: 'Overdue' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this invoice?')) {
      await db.invoices.delete(id);
    }
  };

  const openAdd = () => {
    const dueDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    setForm({ clientId: clients?.[0]?.id?.toString() ?? '', amount: '', dueDate, notes: '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.clientId || !form.amount) return;
    await db.invoices.add({
      clientId: parseInt(form.clientId),
      date: new Date().toISOString().split('T')[0],
      dueDate: form.dueDate,
      amount: parseFloat(form.amount),
      status: 'Unpaid',
      notes: form.notes,
    });
    setShowModal(false);
  };

  const selectClass = 'w-full bg-[#1f1f1f] text-offWhite font-sans font-light border border-borderColor rounded px-4 py-2 focus:outline-none focus:border-gold transition-colors';
  const labelClass = 'block text-offWhite font-sans font-light mb-2 text-sm';

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-light text-gold">Invoices</h1>
          <p className="text-gray-500 text-sm mt-1 font-sans">
            {invoices?.length ?? 0} total ·{' '}
            <span className="text-yellow-400">${outstanding.toFixed(2)} outstanding</span>
            {unpaidCount > 0 && <span className="text-gray-600"> ({unpaidCount} unpaid)</span>}
          </p>
        </div>
        <Button onClick={openAdd}>+ New Invoice</Button>
      </div>

      <div className="flex gap-2 mb-5">
        {filterTabs.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 text-sm font-sans rounded transition-colors ${
              statusFilter === s
                ? 'bg-gold text-nearBlack font-medium'
                : 'bg-white bg-opacity-5 text-gray-400 hover:text-offWhite'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-[#1a1a1a] border border-borderColor rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-borderColor">
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-6 py-4">Client</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Invoice Date</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Due Date</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Amount</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Status</th>
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map(inv => (
              <tr key={inv.id} className="border-b border-borderColor hover:bg-white hover:bg-opacity-[0.03] transition-colors">
                <td className="px-6 py-4 text-offWhite font-sans text-sm font-medium">{getClientName(inv.clientId)}</td>
                <td className="px-4 py-4 text-gray-400 font-sans text-sm">{inv.date}</td>
                <td className="px-4 py-4 text-gray-400 font-sans text-sm">{inv.dueDate}</td>
                <td className="px-4 py-4 text-gold font-mono text-sm">${inv.amount.toFixed(2)}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${statusColors[inv.status]}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {inv.status === 'Unpaid' && (
                    <>
                      <button onClick={() => markPaid(inv.id!)} className="text-green-400 hover:text-green-300 text-sm transition-colors mr-4">
                        Mark Paid
                      </button>
                      <button onClick={() => markOverdue(inv.id!)} className="text-red-500 hover:text-red-300 text-sm transition-colors mr-4">
                        Overdue
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(inv.id!)} className="text-gray-600 hover:text-red-400 text-sm transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {filtered?.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-600 font-sans text-sm">
                  {statusFilter === 'All' ? 'No invoices yet' : `No ${statusFilter} invoices`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Invoice">
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Client</label>
            <select value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} className={selectClass}>
              {clients?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Amount ($)</label>
            <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" min="0" step="0.01" className={selectClass} />
          </div>
          <div>
            <label className={labelClass}>Due Date</label>
            <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className={selectClass} />
          </div>
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full bg-[#1f1f1f] text-offWhite font-sans font-light border border-borderColor rounded px-4 py-2 focus:outline-none focus:border-gold h-20 resize-none transition-colors"
              placeholder="Invoice notes..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave}>Create Invoice</Button>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Invoices;
