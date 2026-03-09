import { colors, fontFamily, fontSize, lineHeight, radius, shadows, spacing } from '@/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

interface NoteCardProps {
    title: string;
    preview?: string;
    date?: string;
    featured?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
}

export function NoteCard({ title, preview, date, featured = false, onPress, style }: NoteCardProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                featured && styles.cardFeatured,
                pressed && styles.cardPressed,
                style,
            ]}
        >
            <Text style={[styles.title, featured && styles.titleFeatured]} numberOfLines={1}>
                {title}
            </Text>
            {preview ? (
                <Text style={styles.preview} numberOfLines={2}>
                    {preview}
                </Text>
            ) : null}
            {date ? (
                <Text style={styles.date}>{date}</Text>
            ) : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.bgSurface,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        borderRadius: radius.md,
        padding: spacing[3],
        marginBottom: spacing[2],
        ...shadows.sm,
    },
    cardFeatured: {
        borderColor: colors.accentWarmMid,
        backgroundColor: colors.accentWarmDim,
        ...shadows.glow,
    },
    cardPressed: {
        backgroundColor: colors.bgHover,
    },
    title: {
        fontFamily: fontFamily.bodyMedium,
        fontSize: fontSize.md,
        color: colors.textPrimary,
        marginBottom: 6,
    },
    titleFeatured: {
        color: colors.accentWarm,
    },
    preview: {
        fontFamily: fontFamily.body,
        fontSize: 11,
        color: colors.textTertiary,
        lineHeight: 10 * lineHeight.snug,
    },
    date: {
        fontFamily: fontFamily.mono,
        fontSize: 9,
        color: colors.textDisabled,
        marginTop: spacing[2],
    },
});
