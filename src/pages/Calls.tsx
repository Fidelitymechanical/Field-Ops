import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Call } from '../data/db';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

type StatusFilter = 'All' | Call['status'];

const statusColors: Record<Call['status'], string> = {
  Pending: 'bg-yellow-900 text-yellow-300',
  InProgress: 'bg-blue-900 text-blue-300',
  Completed: 'bg-green-900 text-green-300',
  Canceled: 'bg-gray-800 text-gray-400',
};

const statusLabels: Record<Call['status'], string> = {
  Pending: 'Pending',
  InProgress: 'In Progress',
  Completed: 'Completed',
  Canceled: 'Canceled',
};

const filterTabs: StatusFilter[] = ['All', 'Pending', 'InProgress', 'Completed', 'Canceled'];

type FormState = {
  clientId: string;
  date: string;
  duration: string;
  notes: string;
  status: Call['status'];
};

const Calls: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Call | null>(null);
  const [form, setForm] = useState<FormState>({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    duration: '60',
    notes: '',
    status: 'Pending',
  });

  const clients = useLiveQuery(() => db.clients.orderBy('name').toArray(), []);
  const calls = useLiveQuery(() => db.calls.orderBy('date').reverse().toArray(), []);

  const filtered = calls?.filter(c => statusFilter === 'All' || c.status === statusFilter);
  const getClientName = (id: number) => clients?.find(c => c.id === id)?.name ?? 'Unknown';

  const openAdd = () => {
    setEditing(null);
    setForm({
      clientId: clients?.[0]?.id?.toString() ?? '',
      date: new Date().toISOString().split('T')[0],
      duration: '60',
      notes: '',
      status: 'Pending',
    });
    setShowModal(true);
  };

  const openEdit = (call: Call) => {
    setEditing(call);
    setForm({
      clientId: call.clientId.toString(),
      date: call.date,
      duration: call.duration.toString(),
      notes: call.notes,
      status: call.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.clientId) return;
    const data = {
      clientId: parseInt(form.clientId),
      date: form.date,
      duration: parseInt(form.duration) || 0,
      notes: form.notes,
      status: form.status,
    };
    if (editing?.id) {
      await db.calls.update(editing.id, data);
    } else {
      await db.calls.add(data);
    }
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this call?')) {
      await db.calls.delete(id);
    }
  };

  const selectClass = 'w-full bg-[#1f1f1f] text-offWhite font-sans font-light border border-borderColor rounded px-4 py-2 focus:outline-none focus:border-gold transition-colors';
  const textareaClass = 'w-full bg-[#1f1f1f] text-offWhite font-sans font-light border border-borderColor rounded px-4 py-2 focus:outline-none focus:border-gold h-24 resize-none transition-colors';
  const labelClass = 'block text-offWhite font-sans font-light mb-2 text-sm';

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-light text-gold">Service Calls</h1>
          <p className="text-gray-500 text-sm mt-1 font-sans">{calls?.length ?? 0} total</p>
        </div>
        <Button onClick={openAdd}>+ New Call</Button>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
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
            {s === 'All' ? 'All' : statusLabels[s as Call['status']]}
          </button>
        ))}
      </div>

      <div className="bg-[#1a1a1a] border border-borderColor rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-borderColor">
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-6 py-4">Client</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Date</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Duration</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Status</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Notes</th>
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map(call => (
              <tr key={call.id} className="border-b border-borderColor hover:bg-white hover:bg-opacity-[0.03] transition-colors">
                <td className="px-6 py-4 text-offWhite font-sans text-sm font-medium">{getClientName(call.clientId)}</td>
                <td className="px-4 py-4 text-gray-400 font-sans text-sm">{call.date}</td>
                <td className="px-4 py-4 text-gray-400 font-sans text-sm">{call.duration} min</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${statusColors[call.status]}`}>
                    {statusLabels[call.status]}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-500 font-sans text-sm max-w-xs truncate">{call.notes}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(call)} className="text-gold hover:text-offWhite text-sm transition-colors mr-4">Edit</button>
                  <button onClick={() => handleDelete(call.id!)} className="text-red-500 hover:text-red-300 text-sm transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {filtered?.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-600 font-sans text-sm">
                  {statusFilter === 'All' ? 'No calls yet' : `No ${statusLabels[statusFilter as Call['status']]} calls`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Call' : 'New Service Call'}>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Client</label>
            <select value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} className={selectClass}>
              {clients?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={selectClass} />
          </div>
          <div>
            <label className={labelClass}>Duration (minutes)</label>
            <input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className={selectClass} min="0" />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Call['status'] }))} className={selectClass}>
              <option value="Pending">Pending</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={textareaClass} placeholder="Call notes..." />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave}>{editing ? 'Save Changes' : 'Add Call'}</Button>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Calls;
