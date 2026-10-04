import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type TabName =
    | "Home"
    | "Check In"
    | "Contacts"
    | "History"
    | "Settings";

interface BottomNavigationProps {
    activeTab: TabName;
    onHomePress?: () => void;
}

export default function BottomNavigation({
    activeTab,
    onHomePress,
}: BottomNavigationProps) {
    const handleHomePress = () => {
        if (onHomePress) {
            onHomePress();
        } else {
            router.push("/(tabs)/Home");
        }
    };

    const isActive = (tab: TabName) => activeTab === tab;

    return (
        <View style={styles.bottomNav}>
            {/* HOME */}
            <TouchableOpacity
                style={styles.navItem}
                onPress={handleHomePress}
                activeOpacity={0.7}
            >
                {isActive("Home") && <View style={styles.activeLine} />}

                <Ionicons
                    name="home"
                    size={32}
                    color={isActive("Home") ? "#2563E8" : "#526487"}
                />

                <Text
                    style={[
                        styles.navText,
                        isActive("Home") && styles.activeText,
                    ]}
                >
                    Home
                </Text>
            </TouchableOpacity>

            {/* CHECK IN */}
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => router.push("/(tabs)/Check_In")}
                activeOpacity={0.7}
            >
                {isActive("Check In") && (
                    <View style={styles.activeLine} />
                )}

                <Ionicons
                    name="shield-checkmark"
                    size={32}
                    color={
                        isActive("Check In")
                            ? "#2563E8"
                            : "#526487"
                    }
                />

                <Text
                    style={[
                        styles.navText,
                        isActive("Check In") && styles.activeText,
                    ]}
                >
                    Check In
                </Text>
            </TouchableOpacity>

            {/* CONTACTS */}
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => router.push("/(tabs)/Contacts")}
                activeOpacity={0.7}
            >
                {isActive("Contacts") && (
                    <View style={styles.activeLine} />
                )}

                <Ionicons
                    name="people"
                    size={32}
                    color={
                        isActive("Contacts")
                            ? "#2563E8"
                            : "#08B88A"
                    }
                />

                <Text
                    style={[
                        styles.navText,
                        isActive("Contacts") && styles.activeText,
                    ]}
                >
                    Contacts
                </Text>
            </TouchableOpacity>

            {/* HISTORY */}
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => router.push("/(tabs)/History")}
                activeOpacity={0.7}
            >
                {isActive("History") && (
                    <View style={styles.activeLine} />
                )}

                <MaterialIcons
                    name="history"
                    size={34}
                    color={
                        isActive("History")
                            ? "#2563E8"
                            : "#F59E0B"
                    }
                />

                <Text
                    style={[
                        styles.navText,
                        isActive("History") && styles.activeText,
                    ]}
                >
                    History
                </Text>
            </TouchableOpacity>

            {/* SETTINGS */}
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => router.push("/(tabs)/Settings")}
                activeOpacity={0.7}
            >
                {isActive("Settings") && (
                    <View style={styles.activeLine} />
                )}

                <Ionicons
                    name="settings"
                    size={32}
                    color={
                        isActive("Settings")
                            ? "#2563E8"
                            : "#7C3AED"
                    }
                />

                <Text
                    style={[
                        styles.navText,
                        isActive("Settings") && styles.activeText,
                    ]}
                >
                    Settings
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
        position: "absolute",
        bottom: 10,
        left: 15,
        right: 15,
        height: 94,
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        shadowColor: "#7898DB",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 6,
    },

    navItem: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    navText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#526487",
        marginTop: 5,
    },

    activeText: {
        color: "#2563E8",
        fontWeight: "800",
    },

    activeLine: {
        position: "absolute",
        top: 0,
        width: 55,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#2563E8",
    },
});

