module.exports = {
  content: [
    '../../packages/react-ui/**/*.{js,ts,jsx,tsx}',
    './src/App.{js,ts,jsx,tsx,vue}',
    './src/**/*.{js,ts,jsx,tsx,vue}',
    './pages/**/*.{js,ts,jsx,tsx,vue}',
    './components/**/*.{js,ts,jsx,tsx,vue}',
    './index.html',
  ],
  theme: {
    extend: {
      animation: {
        'rotate-center': 'rotate-center 0.8s linear infinite',
      },
      keyframes: {
        'rotate-center': {
          '0%': {
            transform: 'rotate(0)',
          },
          'to': {
            transform: 'rotate(360deg)',
          },
        },
      },
    },
  },
  plugins: [],
}
