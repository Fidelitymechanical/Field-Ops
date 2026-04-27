// Enums
enum CallStatus {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Canceled = 'Canceled'
}

enum LineItemType {
    Service = 'Service',
    Product = 'Product'
}

// Interfaces for entity types
interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface Call {
    id: string;
    clientId: string; // Reference to Client
    date: Date;
    status: CallStatus;
}

interface LineItem {
    id: string;
    callId: string; // Reference to Call
    description: string;
    type: LineItemType;
    quantity: number;
    unitPrice: number;
}

interface Package {
    id: string;
    name: string;
    lineItems: LineItem[]; // Array of LineItem
}

interface Estimate {
    id: string;
    callId: string; // Reference to Call
    totalAmount: number;
    package: Package; // Reference to Package
}

interface Invoice {
    id: string;
    estimateId: string; // Reference to Estimate
    invoiceDate: Date;
    dueDate: Date;
    totalAmount: number;
}