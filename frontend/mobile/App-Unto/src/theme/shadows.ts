// ============================================
// FOLIO — Shadow Tokens
// React Native: iOS usa shadowColor/offset/opacity/radius
//               Android usa elevation
// Source: design-system.html
// ============================================

import { Platform, ViewStyle } from 'react-native';

type Shadow = Pick<ViewStyle, 'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'>;

export const shadows = {
  sm: Platform.select<Shadow>({
    ios: {
      shadowColor:   '#000000',
      shadowOffset:  { width: 0, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius:  3,
    },
    android: { elevation: 2 },
    default: {},
  })!,

  md: Platform.select<Shadow>({
    ios: {
      shadowColor:   '#000000',
      shadowOffset:  { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius:  16,
    },
    android: { elevation: 6 },
    default: {},
  })!,

  lg: Platform.select<Shadow>({
    ios: {
      shadowColor:   '#000000',
      shadowOffset:  { width: 0, height: 12 },
      shadowOpacity: 0.6,
      shadowRadius:  40,
    },
    android: { elevation: 12 },
    default: {},
  })!,

  // Glow oro — usa con accentWarm
  glow: Platform.select<Shadow>({
    ios: {
      shadowColor:   '#c9a96e',
      shadowOffset:  { width: 0, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius:  20,
    },
    android: { elevation: 4 },
    default: {},
  })!,
} as const;

export type ShadowToken = keyof typeof shadows;
