import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Instrument Serif — titoli e display (corsivo incluso)
import {
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
} from "@expo-google-fonts/instrument-serif";

// Geist Sans — corpo testo e UI
import {
    Geist_300Light,
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
} from "@expo-google-fonts/geist";

// Geist Mono — codice e meta
import {
    GeistMono_300Light,
    GeistMono_400Regular,
    GeistMono_500Medium,
} from "@expo-google-fonts/geist-mono";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        // Display / serif
        InstrumentSerif_400Regular,
        InstrumentSerif_400Regular_Italic,

        // Sans
        Geist_300Light,
        Geist_400Regular,
        Geist_500Medium,
        Geist_600SemiBold,

        // Mono
        GeistMono_300Light,
        GeistMono_400Regular,
        GeistMono_500Medium,
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="page/editor" options={{ headerShown: false, presentation: "modal" }} />
            <Stack.Screen name="page/visualization-note" options={{ headerShown: false, presentation: "modal" }} />
            <Stack.Screen name="page/ip" options={{
                headerShown: false, presentation: "formSheet",
                sheetAllowedDetents: [0.25, 0.5, 1],
                sheetInitialDetentIndex: 1,
            }} />
        </Stack>
    );
}
