import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/gruvbox.css'
import './index.css'
import App from './App.tsx'

document.body.classList.add('theme-gruvbox')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
