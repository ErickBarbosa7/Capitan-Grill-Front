import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Importando las fuentes locales (Fontsource)
import '@fontsource/bricolage-grotesque/600.css';
import '@fontsource/bricolage-grotesque/800.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/playfair-display/700.css';

import './i18n/i18n';
import './styles/global.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);