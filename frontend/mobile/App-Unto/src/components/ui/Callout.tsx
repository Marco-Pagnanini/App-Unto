import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing, lineHeight } from '@/theme';

interface CalloutProps {
  icon?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Callout({ icon = '💡', children, style }: CalloutProps) {
  return (
    <View style={[styles.container, style]}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing[3],
    padding: spacing[4],
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderLeftWidth: 3,
    borderLeftColor: colors.accentWarm,
  },
  icon: {
    fontSize: 18,
    flexShrink: 0,
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.relaxed,
  },
});
