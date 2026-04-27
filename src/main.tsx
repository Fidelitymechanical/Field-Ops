import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { db } from './data/db';
import { seedDatabase } from './data/seed';
import App from './App';
import './index.css';

async function initializeApp() {
  await db.open();
  const count = await db.clients.count();
  if (count === 0) {
    await seedDatabase(db);
  }
}

initializeApp().catch(console.error);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
