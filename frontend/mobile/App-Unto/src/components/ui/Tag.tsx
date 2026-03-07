import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/theme';

export type TagVariant = 'warm' | 'sage' | 'dust' | 'slate';

const variantStyles: Record<TagVariant, { bg: string; text: string; border: string }> = {
  warm:  { bg: colors.accentWarmDim, text: colors.accentWarm,  border: colors.accentWarmMid },
  sage:  { bg: colors.accentSageDim, text: colors.accentSage,  border: colors.accentSageMid },
  dust:  { bg: colors.accentDustDim, text: colors.accentDust,  border: colors.accentDustMid },
  slate: { bg: colors.accentSlateDim,text: colors.accentSlate, border: colors.accentSlateMid },
};

interface TagProps {
  label: string;
  variant?: TagVariant;
  style?: ViewStyle;
}

export function Tag({ label, variant = 'warm', style }: TagProps) {
  const v = variantStyles[variant];

  return (
    <View style={[styles.base, { backgroundColor: v.bg, borderColor: v.border }, style]}>
      <Text style={[styles.text, { color: v.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: spacing[2],
    borderRadius: radius.full,
    borderWidth: 1,
  },
  text: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.xs,
  },
});
