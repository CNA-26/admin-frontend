import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  envPrefix: ['USER_', 'PRODUCT_', 'INVENTORY_'],
  plugins: [
    react(),
    tailwindcss(),
  ],
})
