const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        absoluteWhite: '#ffffff',
        absoluteBlack: '#000000',
        gradientStartYellow: '#e8ae48',
        gradientEndPurple: '#c95ddc',
        globalLeaderboardsBackground: '#F4E1C6',
        landingPageBackground: '#DA6DE4',
        loginFormBackground: '#F5E6FA',
        loginFormComponentBorder: '#A90FB8',
        loginButtonColor: '#DA6DE4',
        signupButtonColor: '#F5A623',
        signupPageBackground: '#F5A623',
        signupFormBackground: '#FFF6E5',
        signupFormComponentBorder: '#F5A623',
        nonogramsBackground: '#FBE6C1'
      }
    },
  },
  plugins: [],
};
