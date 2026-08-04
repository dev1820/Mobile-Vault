/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ORIGIN: string;
  readonly VITE_WHATSAPP_NUMBER: string;
  readonly VITE_PHONE_NUMBER: string;
  readonly VITE_INSTAGRAM_HANDLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
