import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  envPrefix: ['USER_', 'PRODUCT_', 'INVENTORY_', 'WISHLIST_'],
  plugins: [
    react(),
    tailwindcss(),
  ],
})
