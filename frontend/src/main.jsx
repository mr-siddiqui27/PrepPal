import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const initialTheme = localStorage.getItem('preppal_theme') || 'dark';
document.documentElement.setAttribute('data-theme', initialTheme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
