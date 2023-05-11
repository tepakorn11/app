module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.html', './src/**/*.js'],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('tailwindcss'),
  ],
};
