import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Client } from '../data/db';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

type FormState = { name: string; email: string; phone: string; address: string };
const emptyForm: FormState = { name: '', email: '', phone: '', address: '' };

const Clients: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const clients = useLiveQuery(() => db.clients.orderBy('name').toArray(), []);

  const filtered = clients?.filter(c => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
  });

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (client: Client) => {
    setEditing(client);
    setForm({ name: client.name, email: client.email, phone: client.phone, address: client.address ?? '' });
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editing?.id) {
      await db.clients.update(editing.id, form);
    } else {
      await db.clients.add(form);
    }
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this client? This cannot be undone.')) {
      await db.clients.delete(id);
    }
  };

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setErrors(err => ({ ...err, [field]: undefined }));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-light text-gold">Clients</h1>
          <p className="text-gray-500 text-sm mt-1 font-sans">{clients?.length ?? 0} total</p>
        </div>
        <Button onClick={openAdd}>+ Add Client</Button>
      </div>

      <div className="mb-5">
        <Input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-[#1a1a1a] border border-borderColor rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-borderColor">
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-6 py-4">Name</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Email</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Phone</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider px-4 py-4">Address</th>
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map(client => (
              <tr key={client.id} className="border-b border-borderColor hover:bg-white hover:bg-opacity-[0.03] transition-colors">
                <td className="px-6 py-4 text-offWhite font-sans font-medium text-sm">{client.name}</td>
                <td className="px-4 py-4 text-gray-400 font-sans text-sm">{client.email}</td>
                <td className="px-4 py-4 text-gray-400 font-sans text-sm">{client.phone}</td>
                <td className="px-4 py-4 text-gray-500 font-sans text-sm">{client.address}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(client)} className="text-gold hover:text-offWhite text-sm transition-colors mr-4">Edit</button>
                  <button onClick={() => handleDelete(client.id!)} className="text-red-500 hover:text-red-300 text-sm transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {filtered?.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-600 font-sans text-sm">
                  {search ? 'No clients match your search' : 'No clients yet — add your first client'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Client' : 'New Client'}>
        <div className="space-y-4">
          <Input label="Name *" value={form.name} onChange={set('name')} placeholder="Company or full name" error={errors.name} />
          <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="contact@company.com" />
          <Input label="Phone *" value={form.phone} onChange={set('phone')} placeholder="(555) 000-0000" error={errors.phone} />
          <Input label="Address" value={form.address} onChange={set('address')} placeholder="123 Main St, City, State" />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave}>{editing ? 'Save Changes' : 'Add Client'}</Button>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Clients;
