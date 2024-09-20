import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Footer from './Footer.jsx'
import Header from './Header';  

createRoot(document.getElementById('header')).render(<Header />);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <App />
  </StrictMode>,
)

createRoot(document.getElementById('footer')).render(<Footer />);
