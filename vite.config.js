import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  //temporary server exposure settings
  server: {
    //host: true,
    //port: 5173,
    //allowedHosts: true
  },
})
