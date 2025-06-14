/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SITE_URL: string
  readonly CONVEX_DEPLOYMENT: string
  readonly VITE_CONVEX_URL: string
  readonly AUTH_GOOGLE_ID: string
  readonly AUTH_GOOGLE_SECRET: string
  readonly JWT_PRIVATE_KEY: string
  readonly JWKS: object
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}