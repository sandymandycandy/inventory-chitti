/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                accent: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                dark: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                }
            },
            fontFamily: {
                sans: ['Tahoma', '"MS Sans Serif"', 'Arial', 'system-ui', 'sans-serif'],
                display: ['Tahoma', '"MS Sans Serif"', 'Arial', 'system-ui', 'sans-serif'],
                mono: ['"Courier New"', 'Courier', 'monospace'],
            },
            borderRadius: {
                DEFAULT: '0',
                sm: '0',
                md: '0',
                lg: '0',
                xl: '0',
                '2xl': '0',
                '3xl': '0',
                full: '9999px',
            },
            boxShadow: {
                'soft': '1px 1px 0 #808080',
                'glow': 'none',
                'elegant': '1px 1px 0 #808080',
                'card': '1px 1px 0 #808080',
                'card-hover': '1px 1px 0 #808080',
                'button': '1px 1px 0 #808080',
                'button-hover': '1px 1px 0 #404040',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '100': '25rem',
                '104': '26rem',
                '128': '32rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
}
