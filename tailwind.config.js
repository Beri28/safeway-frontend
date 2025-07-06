/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#3b82f6',   // blue-500
          dark: '#1e40af',    // blue-800
        },
        accent: {
          DEFAULT: '#06b6d4', // cyan-500
          light: '#67e8f9',   // cyan-300
          dark: '#0e7490',    // cyan-700
        },
        surface: {
          DEFAULT: '#f8fafc', // slate-50
          dark: '#1e293b',    // slate-800
        },
        muted: '#64748b',     // slate-500
        success: '#22c55e',   // green-500
        warning: '#f59e42',   // orange-400
        danger: '#ef4444',    // red-500
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'soft': '0 4px 24px 0 rgba(37, 99, 235, 0.08)',
        'modal': '0 8px 32px 0 rgba(30, 64, 175, 0.16)',
      },
    },
  },
  plugins: [],
};
