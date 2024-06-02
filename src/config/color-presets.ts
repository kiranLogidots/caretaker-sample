import { useTheme } from 'next-themes';

export const presetLight = {
  lighter: '#f1f1f1',
  light: '#666666',
  default: '#111111',
  dark: '#000000',
  foreground: '#ffffff',
};

export const presetDark = {
  lighter: '#222222',
  light: '#929292',
  default: '#f1f1f1',
  dark: '#ffffff',
  foreground: '#111111',
};

// defaults from global css line 38
export const DEFAULT_PRESET_COLORS = {
  lighter: '#d7e3fe',
  light: '#608efb',
  default: '#3872fa',
  dark: '#6c5ce7', 
  foreground: '#ffffff',
};

export const DEFAULT_PRESET_COLOR_NAME = 'Blue';

export const usePresets = () => {
  const { theme } = useTheme();

  return [
    {
      name: DEFAULT_PRESET_COLOR_NAME,
      colors: DEFAULT_PRESET_COLORS,
    },
    {
      name: 'Black',
      colors: {
        lighter: theme === 'light' ? presetLight.lighter : presetDark.lighter,
        light: theme === 'light' ? presetLight.light : presetDark.light,
        default: theme === 'light' ? presetLight.default : presetDark.default,
        dark: theme === 'light' ? presetLight.dark : presetDark.dark,
        foreground:
          theme === 'light' ? presetLight.foreground : presetDark.foreground,
      },
    },
    {
      name: 'Red',
      colors: {
        lighter: '#fee2e2', // Red 100
        light: '#fca5a5', // Red 300
        default: '#ef4444', // Red 600
        dark: '#b91c1c', // Red 900
        foreground: '#ffffff',
      },
    },
    {
      name: 'Orange',
      colors: {
        lighter: '#fef3c7', // Orange 100
        light: '#fcd34d', // Orange 300
        default: '#f59e0b', // Orange 600
        dark: '#d97706', // Orange 800
        foreground: '#ffffff',
      },
    },
    {
      name: 'Amber',
      colors: {
        lighter: '#fef3c7', // Amber 100
        light: '#fcd34d', // Amber 300
        default: '#f59e0b', // Amber 600
        dark: '#d97706', // Amber 800
        foreground: '#ffffff',
      },
    },
    {
      name: 'Green',
      colors: {
        lighter: '#d1fae5', // Green 100
        light: '#68d391', // Green 300
        default: '#10b981', // Green 600
        dark: '#047857', // Green 800
        foreground: '#ffffff',
      },
    },
    {
      name: 'Teal',
      colors: {
        lighter: '#6ee7b7', // Teal 100
        light: '#2dd4bf', // Teal 300
        default: '#14b8a6', // Teal 600
        dark: '#047857', // Teal 800
        foreground: '#ffffff',
      },
    },
    {
      name: 'Blue',
      colors: {
        lighter: '#6c5ce7', // Teal 100
        light: '#6c5ce7', // Teal 300
        default: '#6c5ce7', // Teal 600 0d9488
        dark: '#6c5ce7', // Teal 800
        foreground: '#6c5ce7',
      },
    },
    {
      name: 'Violet',
      colors: {
        lighter: '#ede9fe', // Violet 100
        light: '#a5b4fc', // Violet 300
        default: '#7c3aed', // Violet 600
        dark: '#4c1d95', // Violet 900
        foreground: '#ffffff',
      },
    },
    {
      name: 'Rose',
      colors: {
        lighter: '#ffe4e6', // Rose 100
        light: '#fda4af', // Rose 300
        default: '#e11d48', // Rose 600
        dark: '#be123c', // Rose 700
        foreground: '#ffffff',
      },
    },
    {
      name: 'Yellow',
      colors: {
        lighter: '#fef9c3', // Yellow 100
        light: '#fde047', // Yellow 300
        default: '#ca8a04', // Yellow 600
        dark: '#a16207', // Yellow 800
        foreground: '#ffffff',
      },
    },
  ];
};
