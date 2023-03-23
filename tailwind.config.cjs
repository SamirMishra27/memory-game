/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            screens: {
                xs: '320px',
                // => @media (min-width: 320px) { ... }
                tall: { raw: '(min-height: 624px)' },
                // => @media (min-height: 800px) { ... }
            },
        },
    },
    plugins: [],
}
