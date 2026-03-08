import api from '@/api/api';
import { MarkdownView } from '@/components/ui';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/theme';
import { Note } from '@/types/note';
import { AxiosResponse } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
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


const TOOLBAR = [
    { label: 'B', prefix: '**', suffix: '**', wrap: true },
    { label: '𝐼', prefix: '_', suffix: '_', wrap: true },
    { label: 'H1', prefix: '# ', suffix: '', wrap: false },
    { label: 'H2', prefix: '## ', suffix: '', wrap: false },
    { label: '`', prefix: '`', suffix: '`', wrap: true },
    { label: '❝', prefix: '\n> ', suffix: '', wrap: false },
    { label: '•', prefix: '\n- ', suffix: '', wrap: false },
    { label: '☐', prefix: '\n- [ ] ', suffix: '', wrap: false },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export default function VisualizationNote() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const contentRef = useRef<TextInput>(null);

    const [note, setNote] = useState<Note | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // ── Fetch nota ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res: AxiosResponse<Note> = await api.get<Note>(`/notes/${id}`);
                const data: Note = res.data;
                setNote(data);
                setTitle(data.title);
                setContent(data.content);
            } catch (e) {
                console.error('Errore fetch nota:', e);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    // ── Dirty tracking ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!note) return;
        setDirty(title !== note.title || content !== note.content);
    }, [title, content, note]);

    // ── Salva ─────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!id || !dirty) return;
        setSaving(true);
        try {
            const res: AxiosResponse<Note> = await api.put(`/notes/${id}`, { title, content });
            setNote((prev) => prev ? { ...prev, title, content } : prev);
            setDirty(false);
            setEditMode(false);
        } catch (e) {
            console.error('Errore salvataggio:', e);
        } finally {
            setSaving(false);
        }
    };

    // ── Toolbar insert ────────────────────────────────────────────────────────
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

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView style={styles.safe}>
                <ActivityIndicator color={colors.accentWarm} style={{ marginTop: 80 }} />
            </SafeAreaView>
        );
    }

    // ── UI ────────────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >

                {/* ── Header ── */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} hitSlop={12}>
                        <Text style={styles.backArrow}>←</Text>
                    </Pressable>

                    <Text style={styles.headerMeta}>
                        {note ? new Date(note.updatedAt).toLocaleDateString('it-IT', {
                            day: '2-digit', month: 'short', year: 'numeric',
                        }) : ''}
                    </Text>

                    {!editMode ? (
                        <Pressable onPress={() => setEditMode(true)} style={styles.actionBtn}>
                            <Text style={styles.actionBtnText}>Modifica</Text>
                        </Pressable>
                    ) : (
                        <Pressable
                            onPress={handleSave}
                            style={[styles.actionBtn, dirty && styles.actionBtnActive]}
                            disabled={saving}
                        >
                            <Text style={[styles.actionBtnText, dirty && styles.actionBtnTextActive]}>
                                {saving ? '...' : 'Salva'}
                            </Text>
                        </Pressable>
                    )}
                </View>

                {/* ── Contenuto ── */}
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardDismissMode="none"
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Titolo: Text in read, TextInput in edit */}
                    {editMode ? (
                        <TextInput
                            style={styles.titleInput}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Titolo"
                            placeholderTextColor={colors.textDisabled}
                            multiline={false}
                            returnKeyType="next"
                            onSubmitEditing={() => contentRef.current?.focus()}
                            blurOnSubmit={false}
                        />
                    ) : (
                        <Text style={styles.titleText}>{title}</Text>
                    )}

                    <View style={styles.divider} />

                    {/* Corpo: Markdown in read, TextInput in edit */}
                    {editMode ? (
                        <TextInput
                            ref={contentRef}
                            style={styles.contentInput}
                            value={content}
                            onChangeText={setContent}
                            placeholder="Contenuto della nota..."
                            placeholderTextColor={colors.textDisabled}
                            multiline
                            textAlignVertical="top"
                            autoCorrect={false}
                            autoCapitalize="sentences"
                            scrollEnabled={false}
                            onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
                            autoFocus
                        />
                    ) : (
                        <MarkdownView>{content || ''}</MarkdownView>
                    )}
                </ScrollView>

                {/* ── Toolbar (solo edit mode) ── */}
                {editMode && (
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
                                    <Text style={styles.toolbarBtnText}>{action.label}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                )}

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ─── Layout styles ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bgBase },
    flex: { flex: 1 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        paddingHorizontal: spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
        gap: spacing[3],
    },
    backArrow: {
        color: colors.textSecondary,
        fontSize: fontSize.lg,
        fontFamily: fontFamily.body,
    },
    headerMeta: {
        flex: 1,
        textAlign: 'center',
        fontFamily: fontFamily.mono,
        fontSize: fontSize.xs,
        color: colors.textDisabled,
    },
    actionBtn: {
        paddingVertical: spacing[1],
        paddingHorizontal: spacing[3],
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.borderDefault,
        backgroundColor: colors.bgElevated,
    },
    actionBtnActive: {
        backgroundColor: colors.accentWarmDim,
        borderColor: colors.accentWarmMid,
    },
    actionBtnText: {
        fontFamily: fontFamily.bodyMedium,
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    actionBtnTextActive: {
        color: colors.accentWarm,
    },

    scroll: { flex: 1 },
    scrollContent: {
        paddingHorizontal: spacing[6],
        paddingTop: spacing[6],
        paddingBottom: spacing[16],
    },

    // Titolo read
    titleText: {
        fontFamily: fontFamily.displayItalic,
        fontSize: fontSize['2xl'],
        color: colors.textPrimary,
        lineHeight: fontSize['2xl'] * lineHeight.tight,
        marginBottom: spacing[4],
    },
    // Titolo edit
    titleInput: {
        fontFamily: fontFamily.displayItalic,
        fontSize: fontSize['2xl'],
        color: colors.textPrimary,
        lineHeight: fontSize['2xl'] * lineHeight.tight,
        marginBottom: spacing[4],
        padding: 0,
    },

    divider: {
        height: 1,
        backgroundColor: colors.borderSubtle,
        marginBottom: spacing[5],
    },

    // Contenuto edit
    contentInput: {
        fontFamily: fontFamily.body,
        fontSize: fontSize.base,
        color: colors.textSecondary,
        lineHeight: fontSize.base * lineHeight.relaxed,
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
