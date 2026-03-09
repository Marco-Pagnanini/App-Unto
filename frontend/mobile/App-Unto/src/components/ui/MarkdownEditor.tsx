import { colors, fontFamily, fontSize, lineHeight } from '@/theme';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface MarkdownEditorProps {
    value: string;
    onChangeText: (text: string) => void;
    onSelectionChange?: (e: any) => void;
    placeholder?: string;
    autoFocus?: boolean;
    inputRef?: React.RefObject<any>;
    scrollEnabled?: boolean;
}

export function MarkdownEditor({
    value,
    onChangeText,
    onSelectionChange,
    placeholder,
    autoFocus = false,
    inputRef,
    scrollEnabled = false,
}: MarkdownEditorProps) {
    return (
        <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            onSelectionChange={onSelectionChange}
            placeholder={placeholder}
            placeholderTextColor={colors.textDisabled}
            multiline
            textAlignVertical="top"
            autoCorrect={false}
            autoCapitalize="sentences"
            scrollEnabled={scrollEnabled}
            autoFocus={autoFocus}
            style={styles.input}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        fontFamily: fontFamily.body,
        fontSize: fontSize.base,
        color: colors.textSecondary,
        lineHeight: fontSize.base * lineHeight.relaxed,
        minHeight: 400,
        padding: 0,
        textAlignVertical: 'top',
    },
});
