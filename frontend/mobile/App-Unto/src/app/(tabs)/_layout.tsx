import { colors } from '@/theme';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
    return (
        <NativeTabs labelStyle={{ selected: { color: colors.accentWarm } }}>
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="settings">
                <NativeTabs.Trigger.Icon sf="gear" md="settings" />
                <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
