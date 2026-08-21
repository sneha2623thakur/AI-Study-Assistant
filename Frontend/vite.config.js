import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows access from your local network (mobile phone)
    port: 5173,
    allowedHosts: true // Add your custom domain here
  }
})