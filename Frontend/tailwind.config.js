/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			primary: '#098bf5',
  			secondary: '#f1c53b',
  			'background-light': '#ecf7f4',
  			'accent-blue': '#71b0de',
  			'text-muted': '#6c8494',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			// The existing primary/secondary/muted/accent are HSL based, keep them.
  			// DEFAULT for primary/secondary/muted/accent are already there.
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/aspect-ratio')],
}

module.exports = {
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.4s ease-out forwards",
        slideUp: "slideUp 0.4s ease-out forwards",
        popUp: "popUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        shake: "shake 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { opacity: 0, transform: "translateY(30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        popUp: {
          "0%": { opacity: 0, transform: "scale(0.7) translateY(20px)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-8px)" },
          "75%": { transform: "translateX(8px)" },
        },
      },
    },
  },
};
