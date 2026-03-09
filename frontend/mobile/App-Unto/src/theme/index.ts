// ============================================
// FOLIO — Theme Index
// Importa da qui: import { colors, spacing, ... } from '@/theme'
// ============================================

export { colors }                                    from './colors';
export type { ColorToken }                           from './colors';

export { fontFamily, fontSize, lineHeight, letterSpacing, textStyles } from './typography';
export type { FontFamilyToken, FontSizeToken }       from './typography';

export { spacing, layout }                           from './spacing';
export type { SpacingToken }                         from './spacing';

export { radius }                                    from './radius';
export type { RadiusToken }                          from './radius';

export { shadows }                                   from './shadows';
export type { ShadowToken }                          from './shadows';

// --- THEME OBJECT (uso con ThemeContext o styled) ---
import { colors }                   from './colors';
import { fontFamily, fontSize, lineHeight, letterSpacing, textStyles } from './typography';
import { spacing, layout }          from './spacing';
import { radius }                   from './radius';
import { shadows }                  from './shadows';

export const theme = {
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  textStyles,
  spacing,
  layout,
  radius,
  shadows,
} as const;

export type Theme = typeof theme;
