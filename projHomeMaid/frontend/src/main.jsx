// Adicione o polyfill para `global` antes de qualquer outra coisa
if (typeof window !== 'undefined') {
    window.global = window; // Define `global` no contexto do navegador
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importe o BrowserRouter
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter> {/* Envolva o App com BrowserRouter */}
            <App />
        </BrowserRouter>
    </StrictMode>,
);
