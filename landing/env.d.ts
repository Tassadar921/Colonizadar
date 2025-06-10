interface ImportMetaEnv {
    readonly VITE_PORT: number; // injected by Docker
    readonly VITE_LANDING_URI: string; // injected by Docker
    readonly VITE_API_BASE_URI: string; // injected by Docker
    readonly VITE_GITHUB_REPOSITORY: string; // injected by Docker
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
