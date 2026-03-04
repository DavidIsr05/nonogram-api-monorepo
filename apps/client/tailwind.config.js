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
        gameSelectorBackground: '#FBE6C1',
        loginFormBackground: '#F5E6FA',
        loginFormComponentBorder: '#A90FB8',
        signupFormBackground: '#FFF6E5',
        nonogramsBackground: '#FBE6C1',
        filledDifficultyStar: '#FFFF00',
        buttonTextGray: '#4B5563',
        buttonGreen: '#22C55E',
        buttonHoverGreen: '#16A34A',
        loginPagePurple: '#DA6DE4',
        signupPageOrange: '#F5A623',
        simpleGray: '#F9FAFB',
        firstPlaceGoldBackground: '#FFF564',
        secondPlaceSilverBackground: '#909090',
        thirdPlaceBronzeBackground: '#CC8B00',
        dividorGray: '#9CA3AF',
      }
    },
  },
  plugins: [],
};
