import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, type Theme, type ColorScheme } from './theme';

const STORAGE_KEY = '@journal/color-scheme';

// ── Module-level bootstrap ────────────────────────────────────────────────────
// Starting the read here (at module evaluation time, before any component
// renders) means the promise almost always settles before ThemeProvider mounts.
// AsyncStorage resolves in < 5 ms; the JS module loads well before the first
// layout pass, and _layout.tsx already delays the tree until fonts are ready
// (100+ ms). The cached values let ThemeProvider initialise its useState with
// the correct scheme on the very first render — no re-render, no flash.
let _cachedScheme: ColorScheme | null = null;
let _bootstrapped = false;

const _bootstrap = AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
  _cachedScheme = stored === 'light' || stored === 'dark' ? stored : null;
  _bootstrapped = true;
  if (_cachedScheme) Appearance.setColorScheme(_cachedScheme);
});

// ── Contexts ──────────────────────────────────────────────────────────────────
export const ThemeContext = createContext<Theme | null>(null);
const SchemeSetterContext = createContext<((s: ColorScheme) => void) | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();

  // Seed directly from the module-level cache (populated before mount in
  // virtually every real-device scenario).
  const [override, setOverride] = useState<ColorScheme | null>(_cachedScheme);
  const [ready, setReady] = useState(_bootstrapped);

  // Fallback: bootstrap hasn't settled yet — wait for it and patch state.
  // In practice this path is never taken; it's a correctness safety-net.
  useEffect(() => {
    if (_bootstrapped) return;
    _bootstrap.then(() => {
      setOverride(_cachedScheme);
      setReady(true);
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

  // Hold children until the stored scheme is known. Covered by the splash
  // screen in practice; the null path is never visible to users.
  if (!ready) return null;

  return (
    <SchemeSetterContext.Provider value={setScheme}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </SchemeSetterContext.Provider>
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────────
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
