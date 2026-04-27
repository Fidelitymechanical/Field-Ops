import React from 'react';
import { NavLink } from 'react-router-dom';

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ClientsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CallsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.4 19.79 19.79 0 0 1 1.64 4.93 2 2 0 0 1 3.62 2.68h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.12 6.12l1.29-1.29a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z" />
  </svg>
);

const EstimatesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const InvoicesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const navItems = [
  { to: '/', label: 'Dashboard', Icon: DashboardIcon },
  { to: '/clients', label: 'Clients', Icon: ClientsIcon },
  { to: '/calls', label: 'Service Calls', Icon: CallsIcon },
  { to: '/estimates', label: 'Estimates', Icon: EstimatesIcon },
  { to: '/invoices', label: 'Invoices', Icon: InvoicesIcon },
];

const Sidebar: React.FC = () => (
  <aside className="w-56 bg-[#161616] border-r border-borderColor flex flex-col flex-shrink-0">
    <div className="p-6 border-b border-borderColor">
      <h2 className="text-xl font-serif font-light text-gold">Field Ops</h2>
      <p className="text-xs font-mono text-gray-500 mt-1 uppercase tracking-widest">HVAC Management</p>
    </div>
    <nav className="flex-1 p-3 space-y-0.5">
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-sans transition-colors ${
              isActive
                ? 'text-gold bg-gold bg-opacity-10 border-l-2 border-gold'
                : 'text-gray-400 hover:text-offWhite hover:bg-white hover:bg-opacity-5'
            }`
          }
        >
          <Icon />
          {label}
        </NavLink>
      ))}
    </nav>
    <div className="p-4 border-t border-borderColor">
      <p className="text-xs font-mono text-gray-600 uppercase tracking-wider">v0.1.0</p>
    </div>
  </aside>
);

export default Sidebar;
