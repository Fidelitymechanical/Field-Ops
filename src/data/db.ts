import Dexie, { Table } from 'dexie';

export interface Client {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface Call {
  id?: number;
  clientId: number;
  date: string;
  duration: number;
  notes: string;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Canceled';
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Estimate {
  id?: number;
  clientId: number;
  callId?: number;
  date: string;
  items: LineItem[];
  subtotal: number;
  taxRate: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  notes?: string;
}

export interface Invoice {
  id?: number;
  clientId: number;
  estimateId?: number;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Unpaid' | 'Paid' | 'Overdue';
  notes?: string;
}

export class FieldOpsDB extends Dexie {
  clients!: Table<Client>;
  calls!: Table<Call>;
  estimates!: Table<Estimate>;
  invoices!: Table<Invoice>;

  constructor() {
    super('FieldOpsDatabase');
    this.version(1).stores({
      clients: '++id, name, email, phone',
      calls: '++id, clientId, date, status',
      estimates: '++id, clientId, callId, status',
      invoices: '++id, clientId, estimateId, status, dueDate',
    });
  }
}

export const db = new FieldOpsDB();
