// ThemeContext.tsx
import { createContext } from 'react';

interface ThemeContextProps {
  isDark: boolean;
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  isDark: false,
  toggleDarkMode: () => {},
});
