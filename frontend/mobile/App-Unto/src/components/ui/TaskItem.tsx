import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing, lineHeight } from '@/theme';

interface TaskItemProps {
  label: string;
  done?: boolean;
  onToggle?: () => void;
}

export function TaskItem({ label, done = false, onToggle }: TaskItemProps) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onToggle}
        style={[styles.check, done && styles.checkDone]}
        hitSlop={8}
      >
        {done && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>
      <Text style={[styles.label, done && styles.labelDone]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    paddingVertical: spacing[2],
  },
  check: {
    width: 16,
    height: 16,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.transparent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  checkDone: {
    backgroundColor: colors.accentWarm,
    borderColor: colors.accentWarm,
  },
  checkmark: {
    color: colors.bgBase,
    fontSize: 10,
    fontFamily: fontFamily.bodyMedium,
  },
  label: {
    flex: 1,
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  labelDone: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
});
