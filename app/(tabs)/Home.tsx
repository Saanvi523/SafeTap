import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import BottomNavigation from "../../components/Bottom_Navigation";

export default function Home() {
    const scrollViewRef = useRef<ScrollView>(null);
    const isFocused = useIsFocused();

    /*
     * AUTOMATICALLY SCROLL TO TOP
     *
     * Whenever the Home page becomes active,
     * the page automatically returns to the top.
     */
    useEffect(() => {
        if (!isFocused) return;

        /*
         * Reset the scroll position several times
         * to make sure the page returns to the top
         * after navigation and layout finish.
         */
        const timer1 = setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                x: 0,
                y: 0,
                animated: false,
            });
        }, 0);

        const timer2 = setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                x: 0,
                y: 0,
                animated: false,
            });
        }, 100);

        const timer3 = setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                x: 0,
                y: 0,
                animated: false,
            });
        }, 300);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [isFocused]);

    /*
     * HOME BUTTON
     *
     * Pressing Home scrolls the page
     * back to the very top.
     */
    const goHome = () => {
        scrollViewRef.current?.scrollTo({
            x: 0,
            y: 0,
            animated: true,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                scrollEventThrottle={16}
            >
                {/* HEADER */}

                <View style={styles.header}>
                    <View>
                        <Text style={styles.smallGreeting}>
                            Good to see you
                        </Text>

                        <Text style={styles.title}>
                            SafeTap
                        </Text>
                    </View>

                    <View style={styles.shieldContainer}>
                        <Ionicons
                            name="shield-checkmark"
                            size={38}
                            color="#2563E8"
                        />
                    </View>
                </View>

                {/* SAFETY STATUS */}

                <View style={styles.safetyCard}>
                    <View style={styles.safetyHeader}>
                        <View style={styles.safeIcon}>
                            <Ionicons
                                name="shield-checkmark"
                                size={42}
                                color="#08A96D"
                            />
                        </View>

                        <View style={styles.safeTextContainer}>
                            <Text style={styles.safeTitle}>
                                You're Safe
                            </Text>

                            <Text style={styles.safeSubtitle}>
                                No active check-in
                            </Text>
                        </View>
                    </View>

                    <View style={styles.statusDivider} />

                    <Text style={styles.safetyDescription}>
                        Start a check-in whenever you want
                        someone to know you're safe.
                    </Text>

                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() =>
                            router.push("/(tabs)/Check_In")
                        }
                    >
                        <Ionicons
                            name="shield-checkmark-outline"
                            size={28}
                            color="#FFFFFF"
                        />

                        <Text style={styles.startButtonText}>
                            Start Check-In
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* YOUR SAFETY */}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Your Safety
                    </Text>

                    <Text style={styles.sectionSubtitle}>
                        Quick access to your SafeTap features
                    </Text>
                </View>

                {/* CONTACTS */}

                <TouchableOpacity
                    style={styles.horizontalCard}
                    onPress={() =>
                        router.push("/(tabs)/Contacts")
                    }
                >
                    <View style={styles.contactsIcon}>
                        <Ionicons
                            name="people"
                            size={32}
                            color="#2563E8"
                        />
                    </View>

                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>
                            Trusted Contacts
                        </Text>

                        <Text style={styles.cardDescription}>
                            Manage the people who can be
                            alerted if you miss a check-in.
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={27}
                        color="#526487"
                    />
                </TouchableOpacity>

                {/* HISTORY */}

                <TouchableOpacity
                    style={styles.horizontalCard}
                    onPress={() =>
                        router.push("/(tabs)/History")
                    }
                >
                    <View style={styles.historyIcon}>
                        <MaterialIcons
                            name="history"
                            size={34}
                            color="#F59E0B"
                        />
                    </View>

                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>
                            Check-In History
                        </Text>

                        <Text style={styles.cardDescription}>
                            View your previous successful
                            and completed check-ins.
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={27}
                        color="#526487"
                    />
                </TouchableOpacity>

                {/* CHECK IN */}

                <TouchableOpacity
                    style={styles.horizontalCard}
                    onPress={() =>
                        router.push("/(tabs)/Check_In")
                    }
                >
                    <View style={styles.checkIcon}>
                        <Ionicons
                            name="time"
                            size={32}
                            color="#08A96D"
                        />
                    </View>

                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>
                            Check-In
                        </Text>

                        <Text style={styles.cardDescription}>
                            Set a time and start your
                            safety check-in.
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={27}
                        color="#526487"
                    />
                </TouchableOpacity>

                {/* SETTINGS */}

                <TouchableOpacity
                    style={styles.horizontalCard}
                    onPress={() =>
                        router.push("/(tabs)/Settings")
                    }
                >
                    <View style={styles.settingsIcon}>
                        <Ionicons
                            name="settings"
                            size={32}
                            color="#7C3AED"
                        />
                    </View>

                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>
                            Settings
                        </Text>

                        <Text style={styles.cardDescription}>
                            Manage reminders and
                            app preferences.
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={27}
                        color="#526487"
                    />
                </TouchableOpacity>

                {/* SAFETY TIP */}

                <View style={styles.tipCard}>
                    <View style={styles.tipIcon}>
                        <Ionicons
                            name="bulb"
                            size={28}
                            color="#2563E8"
                        />
                    </View>

                    <View style={styles.tipTextContainer}>
                        <Text style={styles.tipTitle}>
                            Safety Tip
                        </Text>

                        <Text style={styles.tipText}>
                            Remember to start a check-in
                            before travelling alone.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <BottomNavigation
                activeTab="Home"
                onHomePress={goHome}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    /* MAIN SCREEN */

    container: {
        flex: 1,
        backgroundColor: "#F5F8FF",
    },

    scrollContainer: {
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 125,
    },

    /* HEADER */

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
    },

    smallGreeting: {
        fontSize: 16,
        fontWeight: "600",
        color: "#60729E",
        marginBottom: 3,
    },

    title: {
        fontSize: 43,
        fontWeight: "800",
        color: "#173B8F",
    },

    shieldContainer: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#7898D8",
        shadowOpacity: 0.14,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 5,
    },

    /* SAFETY CARD */

    safetyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 27,
        padding: 23,
        marginBottom: 28,
        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        elevation: 5,
    },

    safetyHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    safeIcon: {
        width: 75,
        height: 75,
        borderRadius: 38,
        backgroundColor: "#E8FFF4",
        justifyContent: "center",
        alignItems: "center",
    },

    safeTextContainer: {
        marginLeft: 16,
    },

    safeTitle: {
        fontSize: 27,
        fontWeight: "800",
        color: "#08A96D",
    },

    safeSubtitle: {
        fontSize: 16,
        color: "#60729E",
        marginTop: 4,
    },

    statusDivider: {
        height: 1,
        backgroundColor: "#E1E8F3",
        marginVertical: 20,
    },

    safetyDescription: {
        fontSize: 16,
        lineHeight: 24,
        color: "#526487",
        marginBottom: 18,
    },

    startButton: {
        height: 62,
        borderRadius: 19,
        backgroundColor: "#2563E8",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#2563E8",
        shadowOpacity: 0.22,
        shadowRadius: 9,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 4,
    },

    startButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "800",
        marginLeft: 9,
    },

    /* SECTION */

    sectionHeader: {
        marginBottom: 15,
    },

    sectionTitle: {
        fontSize: 26,
        fontWeight: "800",
        color: "#173B8F",
    },

    sectionSubtitle: {
        fontSize: 15,
        color: "#60729E",
        marginTop: 4,
    },

    /* CARDS */

    horizontalCard: {
        minHeight: 100,
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 13,
        shadowColor: "#7898D8",
        shadowOpacity: 0.09,
        shadowRadius: 9,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 4,
    },

    contactsIcon: {
        width: 62,
        height: 62,
        borderRadius: 20,
        backgroundColor: "#E7F0FF",
        justifyContent: "center",
        alignItems: "center",
    },

    historyIcon: {
        width: 62,
        height: 62,
        borderRadius: 20,
        backgroundColor: "#FFF3D8",
        justifyContent: "center",
        alignItems: "center",
    },

    checkIcon: {
        width: 62,
        height: 62,
        borderRadius: 20,
        backgroundColor: "#E2FAEF",
        justifyContent: "center",
        alignItems: "center",
    },

    settingsIcon: {
        width: 62,
        height: 62,
        borderRadius: 20,
        backgroundColor: "#F0E5FF",
        justifyContent: "center",
        alignItems: "center",
    },

    cardTextContainer: {
        flex: 1,
        marginHorizontal: 15,
    },

    cardTitle: {
        fontSize: 19,
        fontWeight: "800",
        color: "#173B8F",
    },

    cardDescription: {
        fontSize: 13,
        lineHeight: 19,
        color: "#60729E",
        marginTop: 4,
    },

    /* SAFETY TIP */

    tipCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#D7E5FF",
    },

    tipIcon: {
        width: 55,
        height: 55,
        borderRadius: 18,
        backgroundColor: "#E7F0FF",
        justifyContent: "center",
        alignItems: "center",
    },

    tipTextContainer: {
        flex: 1,
        marginLeft: 14,
    },

    tipTitle: {
        fontSize: 17,
        fontWeight: "800",
        color: "#173B8F",
    },

    tipText: {
        fontSize: 14,
        lineHeight: 20,
        color: "#60729E",
        marginTop: 3,
    },
});