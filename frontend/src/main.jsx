import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'regenerator-runtime/runtime';
import './index.css'
import React from 'react'
import App from './components/App/App.jsx'
import { resolveClassNames } from '@mantine/core'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
  
)


