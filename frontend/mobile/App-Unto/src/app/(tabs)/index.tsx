import { NoteCard } from '@/components/ui';
import { colors, fontFamily, radius, spacing } from '@/theme';
import { Note } from '@/types/note';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
    const [notes, setNotes] = useState<Note[]>([]);

    const fetchNotes = async () => {
        try {
            const response = await fetch('http://89.167.41.90:8082/api/v1/notes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 1fe7d5ec6b4b9ed46c015e8a09a1c85cfe4b075e96d4e705871683fbf20ecd34'
                }
            });
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    useEffect(() => { fetchNotes(); }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Note</Text>
                <Pressable
                    style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
                    onPress={() => router.push('/page/editor')}
                >
                    <Text style={styles.addBtnText}>+</Text>
                </Pressable>
            </View>

            {/* Lista note */}
            <FlatList
                data={notes}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <NoteCard
                        title={item.title}
                        preview={item.content}
                        date={new Date(item.createdAt).toLocaleDateString('it-IT')}
                        onPress={() => router.push(`/page/visualization-note?id=${item.id}`)}
                    />
                )}
            />
        </SafeAreaView>
    );
}

export default index

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bgBase,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[6],
        paddingTop: spacing[4],
        paddingBottom: spacing[2],
    },
    title: {
        color: colors.textPrimary,
        fontSize: 40,
        fontFamily: fontFamily.displayItalic,
    },
    addBtn: {
        width: 36,
        height: 36,
        borderRadius: radius.full,
        backgroundColor: colors.accentWarmDim,
        borderWidth: 1,
        borderColor: colors.accentWarmMid,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBtnPressed: {
        backgroundColor: colors.accentWarmMid,
    },
    addBtnText: {
        color: colors.accentWarm,
        fontSize: 22,
        fontFamily: fontFamily.bodyLight,
        lineHeight: 26,
    },
    list: {
        paddingHorizontal: spacing[4],
        paddingTop: spacing[2],
    },
})
