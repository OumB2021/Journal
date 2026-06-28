/** Single source of truth for all design-system token values. */

const staticColors = {
  accentPrimary:      '#5B8DEF',
  accentDanger:       '#E05A5A',
  accentDangerStrong: '#FF5C33',
  accentSuccess:      '#22C55E',
  accentWarning:      '#F59E0B',
  textOnAccent:       '#FFFFFF',
};

const lightColors = {
  bgBase:              '#F8F7F5',
  bgElevated:          '#F5F5F5',
  bgOverlay:           '#FFFFFF',
  bgSurface:           '#FFFFFF',
  borderDefault:       '#E8E8E8',
  borderStrong:        '#CCCCCC',
  borderSubtle:        '#F0F0F0',
  textPrimary:         '#1A1A1A',
  textSecondary:       '#777777',
  textTertiary:        '#AAAAAA',
  iconDefault:         '#888888',
  iconStrong:          '#555555',
  interactiveBg:       '#1A1A1A',
  interactiveText:     '#FFFFFF',
  accentPrimarySubtle: '#EBF2FF',
  accentDangerSubtle:  '#FFECEC',
  accentSuccessSubtle: '#ECFDF5',
  accentWarningSubtle: '#FFFBEB',
};

const darkColors = {
  bgBase:              '#131313',
  bgElevated:          '#1C1B1B',
  bgOverlay:           '#161616',
  bgSurface:           '#0E0E0E',
  borderDefault:       '#1F1F1F',
  borderStrong:        '#353534',
  borderSubtle:        '#2A2A2A',
  textPrimary:         '#E5E2E1',
  textSecondary:       '#8E9192',
  textTertiary:        '#555555',
  iconDefault:         '#8E9192',
  iconStrong:          '#C4C7C8',
  interactiveBg:       '#FFFFFF',
  interactiveText:     '#131313',
  accentPrimarySubtle: '#1A2A40',
  accentDangerSubtle:  '#3D1A1A',
  accentSuccessSubtle: '#0F2A1A',
  accentWarningSubtle: '#2A1F00',
};

const spacing = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  '2xl': 48,
  '3xl': 64,
};

const radii = {
  none: 0,
  full: 999,
  light: { s: 5,  m: 10, l: 16 },
  dark:  { s: 0,  m: 4,  l: 8  },
};

module.exports = { staticColors, lightColors, darkColors, spacing, radii };
