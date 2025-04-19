import defaultTheme from 'tailwindcss/defaultTheme';

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// This keeps gray and other defaults intact
				...defaultTheme.colors,

				primary: {
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B',
				},
			},
			screens: {
				xs: '320px',
			},
			inset: {
				21: '5.25rem',
			},
		},
	},
	plugins: [require('tailwind-scrollbar-hide')],
};
