export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentMode: 'light' | 'dark'; // The actual resolved mode
}
