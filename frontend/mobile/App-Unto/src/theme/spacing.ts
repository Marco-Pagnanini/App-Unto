// ============================================
// FOLIO — Spacing Tokens
// Source: design-system.html
// ============================================

export const spacing = {
  1:  4,   // gap icona/testo, offset bordo
  2:  8,   // padding sidebar item, gap tag
  3:  12,  // padding sidebar item orizzontale
  4:  16,  // gap standard, padding card
  5:  20,
  6:  24,  // padding sezione sidebar
  8:  32,  // gap tra blocchi editor
  10: 40,
  12: 48,
  16: 64,  // padding editor laterale
} as const;

// --- LAYOUT COSTANTI ---
export const layout = {
  sidebarWidth:  240,
  topbarHeight:  48,
  editorMaxWidth: 720,
} as const;

export type SpacingToken = keyof typeof spacing;
