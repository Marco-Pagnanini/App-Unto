import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, fontFamily, fontSize, spacing, lineHeight } from '@/theme';

interface BlockquoteProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Blockquote({ children, style }: BlockquoteProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 2,
    borderLeftColor: colors.accentWarm,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[5],
    marginVertical: spacing[5],
  },
  text: {
    fontFamily: fontFamily.displayItalic,
    fontSize: fontSize.md,
    color: colors.textTertiary,
    lineHeight: fontSize.md * lineHeight.relaxed,
  },
});
