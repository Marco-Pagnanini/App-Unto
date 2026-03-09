// ============================================
// FOLIO — Typography Tokens
// Source: design-system.html
//
// Installati: @expo-google-fonts/instrument-serif  @expo-google-fonts/geist
// Opzionale:  npx expo install @expo-google-fonts/geist-mono
//             → poi sostituisci 'monospace' con 'GeistMono_400Regular' ecc.
// ============================================

export const fontFamily = {
  display:      'InstrumentSerif_400Regular',
  displayItalic:'InstrumentSerif_400Regular_Italic',
  body:         'Geist_400Regular',
  bodyMedium:   'Geist_500Medium',
  bodySemiBold: 'Geist_600SemiBold',
  bodyLight:    'Geist_300Light',
  mono: 'GeistMono_400Regular',
  monoMedium: 'GeistMono_500Medium',
  monoLight: 'GeistMono_300Light'

} as const;

// --- SCALE TIPOGRAFICA (px) ---
export const fontSize = {
  xs:   11,
  sm:   13,
  base: 15,
  md:   17,
  lg:   20,
  xl:   24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 56,
} as const;

// --- LINE HEIGHT (moltiplicatori) ---
export const lineHeight = {
  tight:   1.2,
  snug:    1.4,
  normal:  1.6,
  relaxed: 1.75,
} as const;

// --- LETTER SPACING ---
export const letterSpacing = {
  tight:  -0.02,
  normal: 0,
  wide:   0.06,
  wider:  0.08,
  widest: 0.1,
} as const;

// --- STILI PRONTI ALL'USO ---
import { TextStyle } from 'react-native';

export const textStyles = {
  // Titolo nota (grande, serif)
  noteTitle: {
    fontFamily: fontFamily.displayItalic,
    fontSize:   fontSize['4xl'],
    lineHeight: fontSize['4xl'] * lineHeight.tight,
    letterSpacing: letterSpacing.tight * fontSize['4xl'],
    color: undefined, // usa colors.textPrimary
  } satisfies TextStyle,

  // H1 nel corpo nota (serif)
  h1: {
    fontFamily: fontFamily.display,
    fontSize:   fontSize['2xl'],
    lineHeight: fontSize['2xl'] * lineHeight.tight,
    letterSpacing: letterSpacing.tight * fontSize['2xl'],
  } satisfies TextStyle,

  // H2 sezione (sans bold)
  h2: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize:   fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.snug,
  } satisfies TextStyle,

  // H3 sotto-sezione
  h3: {
    fontFamily: fontFamily.bodyMedium,
    fontSize:   fontSize.md,
    lineHeight: fontSize.md * lineHeight.snug,
  } satisfies TextStyle,

  // Corpo testo note
  body: {
    fontFamily: fontFamily.body,
    fontSize:   fontSize.base,
    lineHeight: fontSize.base * lineHeight.relaxed,
  } satisfies TextStyle,

  // Label sidebar, UI labels
  labelSm: {
    fontFamily: fontFamily.body,
    fontSize:   fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
  } satisfies TextStyle,

  // Label sezione UPPERCASE
  sectionLabel: {
    fontFamily: fontFamily.body,
    fontSize:   fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
    letterSpacing: letterSpacing.wider * fontSize.xs,
    textTransform: 'uppercase',
  } satisfies TextStyle,

  // Codice inline / mono
  mono: {
    fontFamily: fontFamily.mono,
    fontSize:   fontSize.sm,
    lineHeight: fontSize.sm * 1.7,
  } satisfies TextStyle,

  // Timestamp / meta
  meta: {
    fontFamily: fontFamily.mono,
    fontSize:   fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
  } satisfies TextStyle,

  // Blockquote
  blockquote: {
    fontFamily: fontFamily.displayItalic,
    fontSize:   fontSize.md,
    lineHeight: fontSize.md * lineHeight.relaxed,
  } satisfies TextStyle,
} as const;

export type FontFamilyToken = keyof typeof fontFamily;
export type FontSizeToken   = keyof typeof fontSize;
