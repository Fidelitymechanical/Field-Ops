import React from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-900 text-yellow-300',
  InProgress: 'bg-blue-900 text-blue-300',
  Completed: 'bg-green-900 text-green-300',
  Canceled: 'bg-gray-800 text-gray-400',
};

interface StatCardProps {
  label: string;
  value: number | string;
  sub: string;
  to: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, to }) => (
  <Link to={to}>
    <div className="bg-[#1a1a1a] border border-borderColor rounded-lg p-6 hover:border-gold transition-colors">
      <p className="text-xs font-mono text-gold uppercase tracking-wider mb-3">{label}</p>
      <p className="text-4xl font-serif font-light text-offWhite">{value}</p>
      <p className="text-sm font-sans text-gray-500 mt-1">{sub}</p>
    </div>
  </Link>
);

const Dashboard: React.FC = () => {
  const clientCount = useLiveQuery(() => db.clients.count(), []);
  const activeCalls = useLiveQuery(() => db.calls.where('status').anyOf(['Pending', 'InProgress']).count(), []);
  const openEstimates = useLiveQuery(() => db.estimates.where('status').anyOf(['Draft', 'Sent']).count(), []);
  const unpaidInvoices = useLiveQuery(() => db.invoices.where('status').equals('Unpaid').toArray(), []);
  const recentCalls = useLiveQuery(() => db.calls.orderBy('date').reverse().limit(5).toArray(), []);
  const clients = useLiveQuery(() => db.clients.toArray(), []);

  const outstanding = unpaidInvoices?.reduce((sum, inv) => sum + inv.amount, 0) ?? 0;
  const getClientName = (id: number) => clients?.find(c => c.id === id)?.name ?? 'Unknown';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-light text-gold">Field Operations</h1>
        <p className="text-gray-500 text-sm mt-1 font-sans">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Clients" value={clientCount ?? 0} sub="Total registered" to="/clients" />
        <StatCard label="Active Calls" value={activeCalls ?? 0} sub="Pending & in progress" to="/calls" />
        <StatCard label="Open Estimates" value={openEstimates ?? 0} sub="Draft & sent" to="/estimates" />
        <StatCard
          label="Outstanding"
          value={`$${outstanding.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          sub={`${unpaidInvoices?.length ?? 0} unpaid invoice${unpaidInvoices?.length !== 1 ? 's' : ''}`}
          to="/invoices"
        />
      </div>

      <div className="bg-[#1a1a1a] border border-borderColor rounded-lg p-6">
        <h3 className="text-lg font-serif font-light text-offWhite mb-5">Recent Service Calls</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-borderColor">
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider py-3 pr-4">Client</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider py-3 pr-4">Date</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider py-3 pr-4">Duration</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider py-3 pr-4">Status</th>
              <th className="text-left text-xs font-mono text-gold uppercase tracking-wider py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {recentCalls?.map(call => (
              <tr key={call.id} className="border-b border-borderColor last:border-0">
                <td className="py-3 pr-4 text-offWhite font-sans text-sm">{getClientName(call.clientId)}</td>
                <td className="py-3 pr-4 text-gray-400 font-sans text-sm">{call.date}</td>
                <td className="py-3 pr-4 text-gray-400 font-sans text-sm">{call.duration} min</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${statusColors[call.status]}`}>
                    {call.status}
                  </span>
                </td>
                <td className="py-3 text-gray-500 font-sans text-sm max-w-xs truncate">{call.notes}</td>
              </tr>
            ))}
            {(!recentCalls || recentCalls.length === 0) && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-600 font-sans text-sm">No calls recorded yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
