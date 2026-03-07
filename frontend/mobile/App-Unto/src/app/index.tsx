import { colors } from "@/theme";
import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Index() {
    return (
        <View style={styles.container}>
            <Text>Edit src/app/index.tsx to edit this screen.</Text>
            <Button title="Press me" onPress={() => router.push("/(tabs)")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.bgBase,
    },
});
