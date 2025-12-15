import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { DemoProvider } from '@/context/DemoContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <DemoProvider>
                <App />
            </DemoProvider>
        </ThemeProvider>
    </React.StrictMode>,
)
