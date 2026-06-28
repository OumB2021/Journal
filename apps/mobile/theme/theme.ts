import { staticColors, lightColors, darkColors, spacing, radii } from './tokens';

export interface ThemeColors {
  bgBase: string;
  bgElevated: string;
  bgOverlay: string;
  bgSurface: string;
  borderDefault: string;
  borderStrong: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  iconDefault: string;
  iconStrong: string;
  interactiveBg: string;
  interactiveText: string;
  accentPrimarySubtle: string;
  accentDangerSubtle: string;
  accentSuccessSubtle: string;
  accentWarningSubtle: string;
}

export interface StaticColors {
  accentPrimary: string;
  accentDanger: string;
  accentDangerStrong: string;
  accentSuccess: string;
  accentWarning: string;
  textOnAccent: string;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
}

export interface Radii {
  none: number;
  full: number;
  light: { s: number; m: number; l: number };
  dark: { s: number; m: number; l: number };
}

export type ColorScheme = 'light' | 'dark';

export interface Theme {
  scheme: ColorScheme;
  colors: ThemeColors;
  static: StaticColors;
  spacing: Spacing;
  radii: Radii;
}

export const lightTheme: Theme = {
  scheme: 'light',
  colors: lightColors as ThemeColors,
  static: staticColors as StaticColors,
  spacing: spacing as Spacing,
  radii: radii as Radii,
};

export const darkTheme: Theme = {
  scheme: 'dark',
  colors: darkColors as ThemeColors,
  static: staticColors as StaticColors,
  spacing: spacing as Spacing,
  radii: radii as Radii,
};
