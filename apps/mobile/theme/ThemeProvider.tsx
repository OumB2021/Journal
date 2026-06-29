import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, type Theme, type ColorScheme } from './theme';

const STORAGE_KEY = '@journal/color-scheme';

export const ThemeContext = createContext<Theme | null>(null);
const SchemeSetterContext = createContext<((s: ColorScheme) => void) | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<ColorScheme | null>(null);

  // Load persisted preference on mount and apply it to Appearance so NativeWind
  // className colour tokens (which listen to the native Appearance API, not React
  // context) also switch immediately.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') {
        setOverride(stored);
        Appearance.setColorScheme(stored);
      }
    });
  }, []);

  const setScheme = (s: ColorScheme) => {
    setOverride(s);
    Appearance.setColorScheme(s); // propagates to NativeWind className tokens
    AsyncStorage.setItem(STORAGE_KEY, s);
  };

  const effectiveScheme = override ?? systemScheme ?? 'light';
  const theme = useMemo(
    () => (effectiveScheme === 'dark' ? darkTheme : lightTheme),
    [effectiveScheme],
  );

  return (
    <SchemeSetterContext.Provider value={setScheme}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </SchemeSetterContext.Provider>
  );
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (ctx === null) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

export function useSetScheme(): (s: ColorScheme) => void {
  const ctx = useContext(SchemeSetterContext);
  if (ctx === null) throw new Error('useSetScheme must be used inside <ThemeProvider>');
  return ctx;
}
