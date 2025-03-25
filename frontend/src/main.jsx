import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'
import bad from './Assests/bad.mp4'
import App from './components/App/App.jsx'
import { resolveClassNames } from '@mantine/core'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
      
  </StrictMode>,
  
)


