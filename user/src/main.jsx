import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Footer from './Footer.jsx';  

// Render App with AuthProvider
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>
);

// Render Footer
createRoot(document.getElementById('footer')).render(<Footer />);
