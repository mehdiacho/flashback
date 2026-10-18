// Theme options
export const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Get system theme preference
export const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Set theme
export const setTheme = (theme) => {
  const root = document.documentElement;
  const actualTheme = theme === THEME_OPTIONS.SYSTEM ? getSystemTheme() : theme;
  
  root.setAttribute('data-bs-theme', actualTheme);
  localStorage.setItem('theme', theme);
};

// Initialize theme
export const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme') || THEME_OPTIONS.SYSTEM;
  setTheme(savedTheme);
  
  // Listen for system theme changes
  if (savedTheme === THEME_OPTIONS.SYSTEM) {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        setTheme(THEME_OPTIONS.SYSTEM);
      });
  }
}; 