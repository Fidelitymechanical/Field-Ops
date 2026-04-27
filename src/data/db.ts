import Dexie from 'dexie';

export class FieldOpsDB extends Dexie {
    clients: Dexie.Table<Client, number>; // clients table
    calls: Dexie.Table<Call, number>; // calls table
    lineItems: Dexie.Table<LineItem, number>; // lineItems table
    packages: Dexie.Table<Package, number>; // packages table
    estimates: Dexie.Table<Estimate, number>; // estimates table
    invoices: Dexie.Table<Invoice, number>; // invoices table

    constructor() {
        super('FieldOpsDatabase');
        this.version(1).stores({
            clients: '++id,name,email,phone', // primary key and indexed fields
            calls: '++id,clientId,date,duration,notes',
            lineItems: '++id,estimateId,description,amount',
            packages: '++id,name,description,price',
            estimates: '++id,clientId,lines,total',
            invoices: '++id,clientId,estimateId,amount,dueDate'
        });

        this.clients = this.table('clients');
        this.calls = this.table('calls');
        this.lineItems = this.table('lineItems');
        this.packages = this.table('packages');
        this.estimates = this.table('estimates');
        this.invoices = this.table('invoices');
    }
}

export interface Client {
    id?: number;
    name: string;
    email: string;
    phone: string;
}

export interface Call {
    id?: number;
    clientId: number;
    date: Date;
    duration: number; // duration in minutes
    notes: string;
}

export interface LineItem {
    id?: number;
    estimateId: number;
    description: string;
    amount: number;
}

export interface Package {
    id?: number;
    name: string;
    description: string;
    price: number;
}

export interface Estimate {
    id?: number;
    clientId: number;
    lines: LineItem[];
    total: number;
}

export interface Invoice {
    id?: number;
    clientId: number;
    estimateId: number;
    amount: number;
    dueDate: Date;
}