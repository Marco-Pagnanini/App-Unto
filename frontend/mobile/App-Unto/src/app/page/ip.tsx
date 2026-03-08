import storage from "@/services/storage";
import { colors, fontFamily } from "@/theme";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Keys storage ──────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
    SERVER_IP: "folio_server_ip",
    API_KEY: "folio_api_key",
} as const;

// ─── Screen ────────────────────────────────────────────────────────────────

export default function IpModal() {
    const [ip, setIp] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isValid = ip.trim().length > 0 && apiKey.trim().length > 0;

    const handleConfirm = async () => {
        if (!isValid) return;
        setLoading(true);
        setError(null);

        try {
            await storage.set(STORAGE_KEYS.SERVER_IP, ip.trim());
            await storage.set(STORAGE_KEYS.API_KEY, apiKey.trim());
            router.replace("/(tabs)");
        } catch {
            setError("Errore nel salvataggio. Riprova.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Configura il server</Text>
                    <Text style={styles.subtitle}>
                        Inserisci l'indirizzo del tuo server Folio e la chiave API.
                    </Text>
                </View>

                <View style={styles.divider} />

                {/* Fields */}
                <View style={styles.fields}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>INDIRIZZO SERVER</Text>
                        <TextInput
                            style={[styles.input, ip.length > 0 && styles.inputFilled]}
                            placeholder="192.168.1.100:3000"
                            placeholderTextColor={colors.textTertiary}
                            value={ip}
                            onChangeText={setIp}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="url"
                            returnKeyType="next"
                        />
                        <Text style={styles.hint}>Es. 192.168.1.100:3000 oppure mioserver.local</Text>
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>API KEY</Text>
                        <TextInput
                            style={[styles.input, styles.inputMono, apiKey.length > 0 && styles.inputFilled]}
                            placeholder="La chiave generata dal server"
                            placeholderTextColor={colors.textTertiary}
                            value={apiKey}
                            onChangeText={setApiKey}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="done"
                            onSubmitEditing={handleConfirm}
                        />
                    </View>

                    {error && (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}
                </View>

                {/* CTA */}
                <Pressable
                    onPress={handleConfirm}
                    disabled={!isValid || loading}
                    style={({ pressed }) => [
                        styles.ctaBtn,
                        (!isValid || loading) && styles.ctaBtnDisabled,
                        pressed && isValid && styles.ctaBtnPressed,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.bgBase} size="small" />
                    ) : (
                        <Text style={[styles.ctaText, !isValid && styles.ctaTextDisabled]}>
                            Salva e continua
                        </Text>
                    )}
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgBase,
    },
    content: {
        padding: 24,
        gap: 24,
    },

    header: {
        gap: 8,
    },
    title: {
        fontSize: 32,
        color: colors.textPrimary,
        fontFamily: fontFamily.displayItalic,
        fontStyle: "italic",
        letterSpacing: -0.4,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 21,
    },

    divider: {
        height: 1,
        backgroundColor: colors.borderSubtle,
    },

    fields: {
        gap: 20,
    },
    fieldGroup: {
        gap: 6,
    },
    label: {
        fontSize: 10,
        fontWeight: "500",
        color: colors.textTertiary,
        letterSpacing: 0.9,
    },
    input: {
        backgroundColor: colors.bgElevated,
        borderWidth: 1,
        borderColor: colors.borderDefault,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 14,
        color: colors.textPrimary,
    },
    inputMono: {
        fontFamily: fontFamily.mono,
        fontSize: 13,
        letterSpacing: 0.3,
    },
    inputFilled: {
        borderColor: colors.accentWarmMid,
    },
    hint: {
        fontSize: 11,
        color: colors.textTertiary,
    },

    errorBox: {
        backgroundColor: "#9e7a7a18",
        borderWidth: 1,
        borderColor: "#9e7a7a44",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    errorText: {
        fontSize: 13,
        color: colors.accentDust,
    },

    ctaBtn: {
        backgroundColor: colors.accentWarm,
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    ctaBtnDisabled: {
        backgroundColor: colors.bgElevated,
        borderWidth: 1,
        borderColor: colors.borderDefault,
    },
    ctaBtnPressed: {
        opacity: 0.85,
    },
    ctaText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.bgBase,
        letterSpacing: 0.1,
    },
    ctaTextDisabled: {
        color: colors.textTertiary,
    },
});
