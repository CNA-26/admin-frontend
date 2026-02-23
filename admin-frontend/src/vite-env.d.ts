/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly USER_API_URL: string;
  readonly PRODUCT_API_URL: string;
  readonly INVENTORY_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
