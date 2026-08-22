import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
export const SUBJECT_ICONS = {
  Mathematics: '📐',
  Physics: '⚛️',
  Biology: '🔬',
  Geology: '⛰️',
  Psychology: '🧠',
  Chemistry: '🧪',
  Literature: '📖',
  History: '🏛️',
  Programming: '💻',
};
