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
        absoluteWhite: '#FFFFFF',
        absoluteBlack: '#000000',
        gradientStartYellow: '#E8AE48',
        gradientEndPurple: '#C95DDC',
        globalLeaderboardsBackground: '#F4E1C6',
        landingPageBackground: '#DA6DE4',
        loginFormBackground: '#F5E6FA',
        loginFormComponentBorder: '#A90FB8',
        loginButtonColor: '#DA6DE4',
        signupButtonColor: '#F5A623',
        signupPageBackground: '#F5A623',
        signupFormBackground: '#FFF6E5',
        signupFormComponentBorder: '#F5A623',
        nonogramsBackground: '#FBE6C1',
        filledDifficultyStar: '#FFFF00'
      }
    },
  },
  plugins: [],
};
