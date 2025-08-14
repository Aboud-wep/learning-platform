module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Update this path according to your project
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      clipPath: {
        hexagon: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
      },
    },
  },
  plugins: [],
};
