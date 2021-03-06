module.exports = {
  purge: [
    './index.html', //
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  important: '#app',
  theme: {
    container: {
      center: true,
    },
    extend: {
      height: {
        'full-content': 'calc(100% - 72px)',
      },
    },
  },
};
