/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly PACKAGE_VERSION: string
  readonly BASE_API_URL: string
  readonly GOOGLE_CLIENT_ID: string | null
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
