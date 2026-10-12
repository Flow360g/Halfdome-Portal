/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** The page a single-file preview opens on, e.g. /calendar. */
  readonly VITE_PREVIEW_ROUTE?: string;
}
