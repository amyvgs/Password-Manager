import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './hooks/AuthProvider.jsx';
import { CategoryProvider } from './hooks/CategoryProvider.jsx';

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <StrictMode>
      <AuthProvider>
        <CategoryProvider>
          <App />
        </CategoryProvider>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>,
)
