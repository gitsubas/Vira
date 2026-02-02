/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                viro: {
                    highlight: "#ffffff", // Pure white for highlights/text
                    glass: "rgba(255, 255, 255, 0.08)", // Standard glass background
                    glassDark: "rgba(0, 0, 0, 0.6)", // Darker glass for contrast
                },
            },
            fontFamily: {
                sans: ["Inter", "System"],
            },
        },
    },
    plugins: [],
};
