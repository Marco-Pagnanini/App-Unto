import api from '@/api/api';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/theme';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



// ─── Azioni toolbar ───────────────────────────────────────────────────────────
const TOOLBAR = [
    { label: 'B', symbol: '𝐁', prefix: '**', suffix: '**', wrap: true },
    { label: 'I', symbol: '𝐼', prefix: '_', suffix: '_', wrap: true },
    { label: 'H1', symbol: 'H1', prefix: '# ', suffix: '', wrap: false },
    { label: 'H2', symbol: 'H2', prefix: '## ', suffix: '', wrap: false },
    { label: '`', symbol: '`', prefix: '`', suffix: '`', wrap: true },
    { label: '"', symbol: '❝', prefix: '\n> ', suffix: '', wrap: false },
    { label: '•', symbol: '•', prefix: '\n- ', suffix: '', wrap: false },
    { label: '[]', symbol: '☐', prefix: '\n- [ ] ', suffix: '', wrap: false },
    { label: '---', symbol: '—', prefix: '\n---\n', suffix: '', wrap: false },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export default function EditorScreen() {
    const router = useRouter();
    const contentRef = useRef<TextInput>(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selection, setSelection] = useState({ start: 0, end: 0 });

    // Inserisce o wrappa la sintassi markdown alla posizione del cursore
    const insertFormat = useCallback(
        (prefix: string, suffix: string, wrap: boolean) => {
            const { start, end } = selection;
            const before = content.slice(0, start);
            const selected = content.slice(start, end);
            const after = content.slice(end);

            let newContent: string;

            if (wrap && selected.length > 0) {
                newContent = before + prefix + selected + suffix + after;
            } else if (wrap) {
                newContent = before + prefix + suffix + after;
            } else {
                newContent = before + prefix + after;
            }

            setContent(newContent);
            setTimeout(() => contentRef.current?.focus(), 30);
        },
        [content, selection],
    );

    const handleSave = async () => {
        if (!title.trim()) return;
        try {
            await api.post('/notes', { title, content });
            router.back();
        } catch (e) {
            console.error('Errore creazione nota:', e);
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >

                {/* ── Header ── */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} hitSlop={12} style={styles.headerBtn}>
                        <Text style={styles.backArrow}>←</Text>
                    </Pressable>

                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {title || 'Nuova nota'}
                    </Text>

                    <Pressable onPress={handleSave} style={styles.saveBtn}>
                        <Text style={styles.saveBtnText}>Salva</Text>
                    </Pressable>
                </View>

                {/* ── Editor ── */}
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardDismissMode="none"
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Titolo nota */}
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Titolo"
                        placeholderTextColor={colors.textDisabled}
                        value={title}
                        onChangeText={setTitle}
                        returnKeyType="next"
                        onSubmitEditing={() => contentRef.current?.focus()}
                        blurOnSubmit={false}
                        multiline={false}
                    />

                    <View style={styles.divider} />

                    {/* Corpo — markdown grezzo */}
                    <TextInput
                        ref={contentRef}
                        style={styles.contentInput}
                        placeholder={'Inizia a scrivere...\n\n# Titolo\n**grassetto** _corsivo_ `codice`\n- lista'}
                        placeholderTextColor={colors.textDisabled}
                        value={content}
                        onChangeText={setContent}
                        onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
                        multiline
                        textAlignVertical="top"
                        autoCorrect={false}
                        autoCapitalize="sentences"
                        scrollEnabled={false}   // scroll gestito dallo ScrollView
                    />
                </ScrollView>

                {/* ── Toolbar formatting ── */}
                <View style={styles.toolbar}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.toolbarInner}
                        keyboardShouldPersistTaps="always"
                    >
                        {TOOLBAR.map((action) => (
                            <Pressable
                                key={action.label}
                                onPress={() => insertFormat(action.prefix, action.suffix, action.wrap)}
                                style={({ pressed }) => [
                                    styles.toolbarBtn,
                                    pressed && styles.toolbarBtnActive,
                                ]}
                            >
                                <Text style={styles.toolbarBtnText}>{action.symbol}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.bgBase,
    },
    flex: {
        flex: 1,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        paddingHorizontal: spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
        gap: spacing[3],
    },
    headerBtn: {
        justifyContent: 'center',
    },
    backArrow: {
        color: colors.textSecondary,
        fontSize: fontSize.lg,
        fontFamily: fontFamily.body,
    },
    headerTitle: {
        flex: 1,
        color: colors.textTertiary,
        fontFamily: fontFamily.mono,
        fontSize: fontSize.xs,
        textAlign: 'center',
    },
    saveBtn: {
        paddingVertical: spacing[1],
        paddingHorizontal: spacing[3],
        backgroundColor: colors.accentWarmDim,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.accentWarmMid,
    },
    saveBtnText: {
        color: colors.accentWarm,
        fontFamily: fontFamily.bodyMedium,
        fontSize: fontSize.xs,
    },

    // Scroll area
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing[6],
        paddingTop: spacing[6],
        paddingBottom: spacing[16],
    },

    // Title input — serif italic grande
    titleInput: {
        fontFamily: fontFamily.displayItalic,
        fontSize: fontSize['2xl'],
        color: colors.textPrimary,
        lineHeight: fontSize['2xl'] * lineHeight.tight,
        marginBottom: spacing[4],
        padding: 0,                 // rimuove padding default iOS
    },

    divider: {
        height: 1,
        backgroundColor: colors.borderSubtle,
        marginBottom: spacing[5],
    },

    // Contenuto edit — mono rende la sintassi markdown leggibile
    contentInput: {
        fontFamily: fontFamily.mono,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: fontSize.sm * lineHeight.relaxed,
        minHeight: 400,
        padding: 0,
    },

    // Toolbar
    toolbar: {
        borderTopWidth: 1,
        borderTopColor: colors.borderSubtle,
        backgroundColor: colors.bgSurface,
        paddingBottom: Platform.OS === 'ios' ? 0 : spacing[2],
    },
    toolbarInner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        gap: spacing[1],
    },
    toolbarBtn: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.borderDefault,
        backgroundColor: colors.bgElevated,
    },
    toolbarBtnActive: {
        backgroundColor: colors.accentWarmDim,
        borderColor: colors.accentWarmMid,
    },
    toolbarBtnText: {
        color: colors.textSecondary,
        fontFamily: fontFamily.bodyMedium,
        fontSize: fontSize.xs,
    },
});
