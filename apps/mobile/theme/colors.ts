import { staticColors, lightColors, darkColors } from './tokens';

export const colors = {
  accentPrimary:      staticColors.accentPrimary,
  accentDanger:       staticColors.accentDanger,
  accentDangerStrong: staticColors.accentDangerStrong,
  accentSuccess:      staticColors.accentSuccess,
  accentWarning:      staticColors.accentWarning,
  textOnAccent:       staticColors.textOnAccent,
  light:              lightColors,
  dark:               darkColors,
} as const;
