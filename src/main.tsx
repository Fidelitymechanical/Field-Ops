import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Dexie from 'dexie';
import App from './App';

// Initialize Dexie database
class MyDatabase extends Dexie {
    constructor() {
        super('myDatabase');
        this.version(1).stores({
            friends: '++id,name,age'
        });
    }
}

const db = new MyDatabase();

// Bootstrap the React application
ReactDOM.render(
    <Router>
        <App db={db} />
    </Router>,
    document.getElementById('root')
);
