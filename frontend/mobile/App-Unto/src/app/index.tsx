import storage from "@/services/storage";
import { colors, fontFamily } from "@/theme";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewToken,
} from "react-native";
import { STORAGE_KEYS } from "./page/ip";

// ─── Slides ────────────────────────────────────────────────────────────────

const SLIDES = [
    {
        id: "1",
        tag: "SCRIVI",
        tagColor: colors.accentWarm,
        tagBg: colors.accentWarmDim,
        icon: "✦",
        iconColor: colors.accentWarm,
        title: "Pensieri,\nnon cartelle",
        body: "App-Unto organizza le tue note attorno alle idee, non alle gerarchie. Scrivi liberamente, il resto viene da sé.",
        accentLine: colors.accentWarm,
    },
    {
        id: "2",
        tag: "COLLEGA",
        tagColor: colors.accentSlate,
        tagBg: "#7a8a9e22",
        icon: "⬡",
        iconColor: colors.accentSlate,
        title: "Le idee\nsi trovano",
        body: "Ogni nota può essere collegata ad un'altra. Costruisci una rete di conoscenza che cresce con te.",
        accentLine: colors.accentSlate,
    },
    {
        id: "3",
        tag: "ORGANIZZA",
        tagColor: colors.accentSage,
        tagBg: "#7a9e7e22",
        icon: "◈",
        iconColor: colors.accentSage,
        title: "Task, blocchi\ne struttura",
        body: "Checklist, codice, citazioni. Ogni tipo di contenuto ha il suo blocco, ogni blocco ha il suo posto.",
        accentLine: colors.accentSage,
    },
    {
        id: "4",
        tag: "INIZIA",
        tagColor: colors.accentWarm,
        tagBg: colors.accentWarmDim,
        icon: "◐",
        iconColor: colors.accentWarm,
        title: "Il tuo\nspazio privato",
        body: "Self-hosted, offline-first, tuo. Nessuna cloud obbligatoria, nessun abbonamento. Solo le tue note.",
        accentLine: colors.accentWarm,
        isLast: true,
    },
];

const { width: W, height: H } = Dimensions.get("window");
const CARD_WIDTH = W - 48;
const CARD_MARGIN = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN * 2;

// ─── Slide component ───────────────────────────────────────────────────────

function Slide({
    item,
    index,
    scrollX,
}: {
    item: (typeof SLIDES)[0];
    index: number;
    scrollX: Animated.Value;
}) {
    const inputRange = [
        (index - 1) * SNAP_INTERVAL,
        index * SNAP_INTERVAL,
        (index + 1) * SNAP_INTERVAL,
    ];

    const scale = scrollX.interpolate({ inputRange, outputRange: [0.92, 1, 0.92], extrapolate: "clamp" });
    const opacity = scrollX.interpolate({ inputRange, outputRange: [0.45, 1, 0.45], extrapolate: "clamp" });
    const iconTranslateX = scrollX.interpolate({ inputRange, outputRange: [W * 0.12, 0, -W * 0.12], extrapolate: "clamp" });
    const textTranslateY = scrollX.interpolate({ inputRange, outputRange: [24, 0, 24], extrapolate: "clamp" });
    const textOpacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: "clamp" });

    return (
        <View style={styles.slideOuter}>
            <Animated.View style={[styles.card, { transform: [{ scale }], opacity, borderColor: item.accentLine + "33" }]}>
                <View style={[styles.cardTopLine, { backgroundColor: item.accentLine }]} />

                <Animated.View style={[styles.tagRow, { opacity: textOpacity, transform: [{ translateY: textTranslateY }] }]}>
                    <View style={[styles.tag, { backgroundColor: item.tagBg, borderColor: item.tagColor + "55" }]}>
                        <Text style={[styles.tagText, { color: item.tagColor }]}>{item.tag}</Text>
                    </View>
                </Animated.View>

                <Animated.Text style={[styles.decorIcon, { color: item.iconColor, transform: [{ translateX: iconTranslateX }] }]}>
                    {item.icon}
                </Animated.Text>

                <Animated.View style={[styles.textBlock, { opacity: textOpacity, transform: [{ translateY: textTranslateY }] }]}>
                    <View style={[styles.titleDivider, { backgroundColor: item.accentLine }]} />
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.body}>{item.body}</Text>
                </Animated.View>

                <View style={[styles.cornerTR, { borderColor: item.accentLine + "30" }]} />
                <View style={[styles.cornerBL, { borderColor: item.accentLine + "20" }]} />
            </Animated.View>
        </View>
    );
}

// ─── Dot indicator ─────────────────────────────────────────────────────────

function Dots({ count, scrollX }: { count: number; scrollX: Animated.Value }) {
    return (
        <View style={styles.dotsRow}>
            {Array.from({ length: count }).map((_, i) => {
                const dotOpacity = scrollX.interpolate({
                    inputRange: [(i - 1) * SNAP_INTERVAL, i * SNAP_INTERVAL, (i + 1) * SNAP_INTERVAL],
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: "clamp",
                });
                const dotWidth = scrollX.interpolate({
                    inputRange: [(i - 1) * SNAP_INTERVAL, i * SNAP_INTERVAL, (i + 1) * SNAP_INTERVAL],
                    outputRange: [6, 20, 6],
                    extrapolate: "clamp",
                });
                return <Animated.View key={i} style={[styles.dot, { opacity: dotOpacity, width: dotWidth }]} />;
            })}
        </View>
    );
}

// ─── Screen ────────────────────────────────────────────────────────────────

export default function Index() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [checking, setChecking] = useState(true);

    // ── Check configurazione esistente all'avvio ────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                const [ip, key] = await Promise.all([
                    storage.get(STORAGE_KEYS.SERVER_IP),
                    storage.get(STORAGE_KEYS.API_KEY),
                ]);
                if (ip && key) {
                    router.replace("/(tabs)");
                    return;
                }
            } finally {
                setChecking(false);
            }
        })();
    }, []);

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems[0]?.index != null) setActiveIndex(viewableItems[0].index);
        }
    ).current;

    const isLast = activeIndex === SLIDES.length - 1;

    const handleNext = () => {
        if (!isLast) {
            flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
        } else {
            router.push("/page/ip");
        }
    };

    // Evita flash dell'onboarding prima del redirect
    if (checking) return null;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logoItalic}>
                    App-Unto<Text style={styles.logoDot}>.</Text>
                </Text>
                {/* "salta" porta direttamente al modal */}
                <Pressable onPress={() => router.push("/page/ip")} style={styles.skipBtn}>
                    <Text style={styles.skipText}>salta</Text>
                </Pressable>
            </View>

            {/* FlatList orizzontale */}
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled={false}
                snapToInterval={SNAP_INTERVAL}
                snapToAlignment="center"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => (
                    <Slide item={item} index={index} scrollX={scrollX} />
                )}
            />

            {/* Bottom: dots + CTA */}
            <View style={styles.bottom}>
                <Dots count={SLIDES.length} scrollX={scrollX} />
                <Pressable
                    onPress={handleNext}
                    style={({ pressed }) => [styles.ctaBtn, pressed && styles.ctaBtnPressed]}
                >
                    <Text style={styles.ctaText}>{isLast ? "Inizia a scrivere" : "Avanti"}</Text>
                    {!isLast && <Text style={styles.ctaArrow}> →</Text>}
                </Pressable>
            </View>
        </View>
    );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bgBase },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 8,
    },
    logoItalic: {
        fontStyle: "italic",
        fontFamily: fontFamily.displayItalic,
        fontSize: 32,
        color: colors.textPrimary,
    },
    logoDot: { color: colors.accentWarm, fontStyle: "normal" },
    skipBtn: { paddingVertical: 6, paddingHorizontal: 12 },
    skipText: {
        fontSize: 13,
        color: colors.textTertiary,
        fontFamily: fontFamily.mono,
        letterSpacing: 0.3,
    },

    listContent: { paddingHorizontal: 12, paddingVertical: 16, alignItems: "center" },
    slideOuter: {
        width: CARD_WIDTH + CARD_MARGIN * 2,
        paddingHorizontal: CARD_MARGIN,
        alignItems: "center",
        justifyContent: "center",
    },

    card: {
        width: CARD_WIDTH,
        height: H * 0.58,
        backgroundColor: colors.bgSurface,
        borderRadius: 16,
        borderWidth: 1,
        overflow: "hidden",
        padding: 28,
        justifyContent: "flex-end",
    },
    cardTopLine: { position: "absolute", top: 0, left: 0, right: 0, height: 1.5 },

    tagRow: { marginBottom: 20 },
    tag: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
    tagText: { fontSize: 10, fontWeight: "500", letterSpacing: 0.9 },

    decorIcon: { position: "absolute", top: "20%", right: 28, fontSize: 140, opacity: 0.06, lineHeight: 160 },

    textBlock: { gap: 12 },
    titleDivider: { width: 28, height: 1.5, marginBottom: 4 },
    title: {
        fontSize: 34,
        color: colors.textPrimary,
        fontStyle: "italic",
        fontFamily: fontFamily.displayItalic,
        lineHeight: 40,
        letterSpacing: -0.6,
    },
    body: { fontSize: 14, color: colors.textSecondary, lineHeight: 22, letterSpacing: 0.1 },

    cornerTR: { position: "absolute", top: 16, right: 16, width: 20, height: 20, borderTopWidth: 1, borderRightWidth: 1, borderRadius: 2 },
    cornerBL: { position: "absolute", bottom: 16, left: 16, width: 16, height: 16, borderBottomWidth: 1, borderLeftWidth: 1, borderRadius: 2 },

    bottom: { paddingHorizontal: 24, paddingBottom: 48, paddingTop: 8, gap: 24, alignItems: "center" },
    dotsRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    dot: { height: 4, borderRadius: 2, backgroundColor: colors.accentWarm },

    ctaBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.accentWarm,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 32,
        width: "100%",
    },
    ctaBtnPressed: { opacity: 0.85 },
    ctaText: { fontSize: 15, fontWeight: "600", color: colors.bgBase, letterSpacing: 0.1 },
    ctaArrow: { fontSize: 15, fontWeight: "600", color: colors.bgBase },
});
