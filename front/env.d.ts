interface ImportMetaEnv {
    readonly VITE_PORT: number; // injected by Docker
    readonly VITE_FRONT_URI: string; // injected by Docker
    readonly VITE_API_BASE_URI: string; // injected by Docker
    readonly VITE_GITHUB_REPOSITORY: string; // injected by Docker
    readonly VITE_DEFAULT_IMAGE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
