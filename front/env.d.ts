interface ImportMetaEnv {
    readonly VITE_API_BASE_URI: string;
    readonly VITE_FRONT_URI: string;
    readonly VITE_GITHUB_REPOSITORY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
