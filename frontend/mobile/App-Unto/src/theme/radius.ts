// ============================================
// FOLIO — Border Radius Tokens
// Source: design-system.html
// ============================================

export const radius = {
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
