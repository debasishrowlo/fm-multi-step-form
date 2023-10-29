const defaultTheme = require('tailwindcss/defaultTheme')
const globEntries = require('webpack-glob-entries-extended')

const paths = require("./paths.js")

const fontSize = {}
const minFontSize = 12
const maxFontSize = 70
const base = 16
let i = minFontSize
while (i <= maxFontSize) {
  fontSize[i] = `${i / base}rem`
  i += 2
}

const borderRadius = [0, 2, 4, 6, 8, 10, 12, 16, 24].reduce((acc, cur) => {
  acc[cur] = `${cur / base}rem`
  return acc
}, {})
borderRadius["full"] = "9999px"

module.exports = {
  content: Object.values(globEntries(paths.src + "/**/*.{html,js,jsx,ts,tsx}")),
  darkMode: "class",
  theme: {
    container: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "940px",
      },
    },
    extend: {
      borderRadius,
      colors: {
        purple: {
          100: "#928CFF",
          200: "#483EFF",
        },
        red: "#EE374A",
        blue: {
          100: "#BEE2FD",
          200: "#ABBCFF",
          300: "#164A8A",
          400: "#022959",
        },
        gray: {
          100: "#F8F9FF",
          200: "#EFF5FF",
          300: "#D6D9E6",
          400: "#9699AA",
        },
      },
      fontFamily: {
        'ubuntu': ['Ubuntu', ...defaultTheme.fontFamily.sans],
      },
      fontSize,
      spacing: {
        "4.5": (18 / base) + "rem",
      },
      transitionDuration: {
        "DEFAULT": "300ms",
      }
    },
  },
  plugins: [],
}