import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@fontsource/dm-sans";

import 'primereact/resources/themes/saga-blue/theme.css';//tema da lib

import { GoogleOAuthProvider } from '@react-oauth/google';
createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="SEU_CLIENT_ID_AQUI">
    <App />
  </GoogleOAuthProvider>
)
