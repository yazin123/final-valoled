/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
   darkMode: 'class',
   theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h3: {
              fontWeight: '600',
              marginBottom: '0px'
            },
            p: {
              marginTop: '0px',
              marginBottom: '0px'
            },
            'p:empty': {
              display: 'none'
            }
          }
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.white'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-links': theme('colors.white'),
          }
        }
      })
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};
