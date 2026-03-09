// ============================================
// FOLIO — Color Tokens
// Source: design-system.html
// ============================================

export const colors = {
  // --- BACKGROUND ---
  bgBase:     '#0f0f0f',
  bgSurface:  '#161616',
  bgElevated: '#1c1c1c',
  bgOverlay:  '#222222',
  bgHover:    '#2a2a2a',
  bgActive:   '#303030',

  // --- BORDERS ---
  borderSubtle:  '#1f1f1f',
  borderDefault: '#2c2c2c',
  borderStrong:  '#3d3d3d',

  // --- TEXT ---
  textPrimary:   '#f0ede8',
  textSecondary: '#9a9491',
  textTertiary:  '#5a5654',
  textDisabled:  '#3d3b3a',
  textInverse:   '#0f0f0f',

  // --- ACCENTS ---
  accentWarm:    '#c9a96e',           // oro caldo — colore firma
  accentWarmDim: 'rgba(201,169,110,0.13)',
  accentWarmMid: 'rgba(201,169,110,0.33)',
  accentSage:    '#7a9e7e',           // verde salvia
  accentDust:    '#9e7a7a',           // rosso polvere
  accentSlate:   '#7a8a9e',           // blu ardesia

  // --- ACCENT TINTED BACKGROUNDS ---
  accentSageDim:  'rgba(122,158,126,0.09)',
  accentSageMid:  'rgba(122,158,126,0.27)',
  accentDustDim:  'rgba(158,122,122,0.09)',
  accentDustMid:  'rgba(158,122,122,0.27)',
  accentSlateDim: 'rgba(122,138,158,0.09)',
  accentSlateMid: 'rgba(122,138,158,0.27)',

  // --- TRANSPARENT ---
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
