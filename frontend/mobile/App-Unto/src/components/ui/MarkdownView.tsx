import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// ─── Inline parser: **bold**, _italic_, `code` ────────────────────────────────
// I testi plain NON hanno stile proprio: ereditano colore e font dal parent <Text>
function parseInline(raw: string, keyPrefix: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|__(.+?)__|_(.+?)_|\*(.+?)\*|`(.+?)`)/g;
    let last = 0;
    let chunk = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(raw)) !== null) {
        if (match.index > last) {
            // plain text — nessuno stile, eredita dal parent
            parts.push(raw.slice(last, match.index));
        }
        const [, , bold1, bold2, em1, em2, code] = match;

        if (bold1 || bold2) {
            parts.push(<Text key={`${keyPrefix}-b${chunk++}`} style={s.bold}>{bold1 ?? bold2}</Text>);
        } else if (em1 || em2) {
            parts.push(<Text key={`${keyPrefix}-e${chunk++}`} style={s.italic}>{em1 ?? em2}</Text>);
        } else if (code) {
            parts.push(<Text key={`${keyPrefix}-c${chunk++}`} style={s.inlineCode}>{code}</Text>);
        }
        last = match.index + match[0].length;
    }
    if (last < raw.length) {
        parts.push(raw.slice(last));
    }
    // Se nessuna formattazione trovata, ritorna la stringa diretta
    return parts.length ? parts : raw;
}

// ─── Componente principale ────────────────────────────────────────────────────
interface MarkdownViewProps {
    children: string;
}

export function MarkdownView({ children }: MarkdownViewProps) {
    const lines = children.split('\n');
    const nodes: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const key = `md-${i}`;

        // Linea vuota → spazio verticale
        if (line.trim() === '') {
            nodes.push(<View key={key} style={s.spacer} />);
            i++;
            continue;
        }

        // ── Blocco codice ─────────────────────────────────────────────────────
        if (line.startsWith('```')) {
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            nodes.push(
                <View key={key} style={s.codeBlock}>
                    <Text style={s.codeText}>{codeLines.join('\n')}</Text>
                </View>,
            );
            i++;
            continue;
        }

        // ── Headings — accetta sia "# Testo" che "#Testo" ────────────────────
        if (/^#{3}\s?/.test(line)) {
            nodes.push(<Text key={key} style={s.h3}>{parseInline(line.replace(/^#{3}\s?/, ''), key)}</Text>);
        } else if (/^#{2}\s?/.test(line)) {
            nodes.push(<Text key={key} style={s.h2}>{parseInline(line.replace(/^#{2}\s?/, ''), key)}</Text>);
        } else if (/^#{1}\s?/.test(line)) {
            nodes.push(<Text key={key} style={s.h1}>{parseInline(line.replace(/^#{1}\s?/, ''), key)}</Text>);

            // ── HR ────────────────────────────────────────────────────────────────
        } else if (/^[-*_]{3,}$/.test(line.trim())) {
            nodes.push(<View key={key} style={s.hr} />);

            // ── Blockquote ────────────────────────────────────────────────────────
        } else if (line.startsWith('> ')) {
            nodes.push(
                <View key={key} style={s.blockquote}>
                    <Text style={s.blockquoteText}>{parseInline(line.slice(2), key)}</Text>
                </View>,
            );

            // ── Task list - [ ] / - [x] ───────────────────────────────────────────
        } else if (/^[-*] \[[ xX]\] /.test(line)) {
            const done = /^[-*] \[[xX]\] /.test(line);
            const text = line.replace(/^[-*] \[[ xX]\] /, '');
            nodes.push(
                <View key={key} style={s.listItem}>
                    <View style={[s.checkbox, done && s.checkboxDone]}>
                        {done && <Text style={s.checkmark}>✓</Text>}
                    </View>
                    <Text style={[s.listText, done && s.listTextDone]}>
                        {parseInline(text, key)}
                    </Text>
                </View>,
            );

            // ── Lista non ordinata ────────────────────────────────────────────────
        } else if (/^[-*] /.test(line)) {
            nodes.push(
                <View key={key} style={s.listItem}>
                    <Text style={s.bullet}>{'•'}</Text>
                    <Text style={s.listText}>{parseInline(line.slice(2), key)}</Text>
                </View>,
            );

            // ── Paragrafo ─────────────────────────────────────────────────────────
        } else {
            nodes.push(
                <Text key={key} style={s.paragraph}>
                    {parseInline(line, key)}
                </Text>,
            );
        }

        i++;
    }

    return <View style={s.root}>{nodes}</View>;
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    root: { flex: 1 },
    spacer: { height: spacing[2] },

    // Testo base
    body: {
        fontFamily: fontFamily.body,
        fontSize: fontSize.base,
        color: colors.textSecondary,
    },
    paragraph: {
        fontFamily: fontFamily.body,
        fontSize: fontSize.base,
        color: colors.textSecondary,
        lineHeight: fontSize.base * lineHeight.relaxed,
        marginBottom: spacing[3],
    },

    // Headings
    h1: {
        fontFamily: fontFamily.display,
        fontSize: fontSize['2xl'],
        color: colors.textPrimary,
        lineHeight: fontSize['2xl'] * lineHeight.tight,
        marginTop: spacing[6],
        marginBottom: spacing[3],
    },
    h2: {
        fontFamily: fontFamily.bodySemiBold,
        fontSize: fontSize.lg,
        color: colors.textPrimary,
        lineHeight: fontSize.lg * lineHeight.snug,
        marginTop: spacing[5],
        marginBottom: spacing[2],
    },
    h3: {
        fontFamily: fontFamily.bodyMedium,
        fontSize: fontSize.md,
        color: colors.textPrimary,
        lineHeight: fontSize.md * lineHeight.snug,
        marginTop: spacing[4],
        marginBottom: spacing[2],
    },

    // Inline
    bold: {
        fontFamily: fontFamily.bodySemiBold,
        color: colors.textPrimary,
    },
    italic: {
        fontFamily: fontFamily.displayItalic,
        color: colors.textSecondary,
    },
    inlineCode: {
        fontFamily: fontFamily.mono,
        fontSize: fontSize.sm,
        color: colors.accentWarm,
        backgroundColor: colors.accentWarmDim,
        borderRadius: radius.sm,
    },

    // Blocco codice
    codeBlock: {
        backgroundColor: colors.bgElevated,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.borderDefault,
        padding: spacing[4],
        marginBottom: spacing[4],
    },
    codeText: {
        fontFamily: fontFamily.mono,
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: fontSize.sm * 1.7,
    },

    // Blockquote
    blockquote: {
        borderLeftWidth: 2,
        borderLeftColor: colors.accentWarm,
        paddingLeft: spacing[4],
        marginBottom: spacing[4],
    },
    blockquoteText: {
        fontFamily: fontFamily.displayItalic,
        fontSize: fontSize.md,
        color: colors.textTertiary,
        lineHeight: fontSize.md * lineHeight.relaxed,
    },

    // HR
    hr: {
        height: 1,
        backgroundColor: colors.borderDefault,
        marginVertical: spacing[5],
    },

    // Lista
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing[2],
        gap: spacing[2],
    },
    bullet: {
        color: colors.accentWarm,
        fontFamily: fontFamily.body,
        fontSize: fontSize.base,
        lineHeight: fontSize.base * lineHeight.relaxed,
    },
    listText: {
        flex: 1,
        fontFamily: fontFamily.body,
        fontSize: fontSize.base,
        color: colors.textSecondary,
        lineHeight: fontSize.base * lineHeight.relaxed,
    },

    // Task list
    checkbox: {
        width: 16,
        height: 16,
        borderRadius: radius.sm,
        borderWidth: 1.5,
        borderColor: colors.borderStrong,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 3,
        flexShrink: 0,
    },
    checkboxDone: {
        backgroundColor: colors.accentWarm,
        borderColor: colors.accentWarm,
    },
    checkmark: {
        color: colors.bgBase,
        fontSize: 9,
        fontFamily: fontFamily.bodyMedium,
    },
    listTextDone: {
        textDecorationLine: 'line-through',
        color: colors.textDisabled,
    },
});
