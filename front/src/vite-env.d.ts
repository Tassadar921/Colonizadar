interface ImportMetaEnv {
	readonly VITE_API_BASE_URL: string;
	readonly VITE_FRONT_URI: string;
	readonly VITE_GITHUB_REPOSITORY: string;
	readonly VITE_DEFAULT_IMAGE: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
