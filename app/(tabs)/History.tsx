import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import BottomNavigation from "../../components/Bottom_Navigation";
import { supabase } from "../../lib/supabase";

type HistoryItem = {
    id: string;
    date: string;
    time: string;
    duration: string;
    reminderEnabled?: boolean;
    reminderTime?: string;
    message: string;
};

const getHistoryKey = (userId: string) =>
    `@safetap_history_${userId}`;

export default function History() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [authLoaded, setAuthLoaded] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);

    const scrollViewRef = useRef<ScrollView | null>(null);
    const currentUserIdRef = useRef<string | null>(null);

    // Load history belonging only to the selected account.
    const loadHistory = useCallback(async (id: string) => {
        setHistoryLoaded(false);

        try {
            const stored = await AsyncStorage.getItem(
                getHistoryKey(id)
            );

            const parsed: unknown = stored
                ? JSON.parse(stored)
                : [];

            // Ignore results if the account changes while loading.
            if (currentUserIdRef.current !== id) return;

            setHistory(
                Array.isArray(parsed)
                    ? (parsed as HistoryItem[])
                    : []
            );
        } catch (error) {
            console.error("Error loading history:", error);

            if (currentUserIdRef.current === id) {
                setHistory([]);
            }
        } finally {
            if (currentUserIdRef.current === id) {
                setHistoryLoaded(true);
            }
        }
    }, []);

    // Initialise the current session and handle sign-in/sign-out.
    useEffect(() => {
        let active = true;

        const applySession = async (id: string | null) => {
            if (!active) return;

            currentUserIdRef.current = id;
            setUserId(id);
            setHistory([]);
            setHistoryLoaded(false);

            if (!id) {
                setHistoryLoaded(true);
                setAuthLoaded(true);
                return;
            }

            await loadHistory(id);

            if (active) {
                setAuthLoaded(true);
            }
        };

        const initialise = async () => {
            try {
                const { data, error } =
                    await supabase.auth.getSession();

                if (!active) return;

                if (error) {
                    await applySession(null);
                    return;
                }

                await applySession(
                    data.session?.user.id ?? null
                );
            } catch (error) {
                console.error("Error checking session:", error);

                if (active) {
                    await applySession(null);
                }
            }
        };

        void initialise();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                // Defer storage operations until the auth callback ends.
                void Promise.resolve().then(() => {
                    if (active) {
                        void applySession(
                            session?.user.id ?? null
                        );
                    }
                });
            }
        );

        return () => {
            active = false;
            currentUserIdRef.current = null;
            subscription.unsubscribe();
        };
    }, [loadHistory]);

    // Refresh history whenever the page comes into focus.
    useFocusEffect(
        useCallback(() => {
            let active = true;

            const refreshHistory = async () => {
                try {
                    const { data, error } =
                        await supabase.auth.getSession();

                    if (!active) return;

                    if (error) {
                        currentUserIdRef.current = null;
                        setUserId(null);
                        setHistory([]);
                        setHistoryLoaded(true);
                        setAuthLoaded(true);
                        return;
                    }

                    const id = data.session?.user.id ?? null;

                    if (currentUserIdRef.current !== id) {
                        currentUserIdRef.current = id;
                        setUserId(id);
                        setHistory([]);
                    }

                    setAuthLoaded(true);

                    if (id) {
                        await loadHistory(id);
                    } else {
                        setHistory([]);
                        setHistoryLoaded(true);
                    }
                } catch (error) {
                    console.error("Error refreshing history:", error);

                    if (active) {
                        setHistory([]);
                        setHistoryLoaded(true);
                    }
                }
            };

            void refreshHistory();

            const timer = setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    y: 0,
                    animated: false,
                });
            }, 100);

            return () => {
                active = false;
                clearTimeout(timer);
            };
        }, [loadHistory])
    );

    const goToSignIn = () => {
        router.push("/(tabs)/Log_in");
    };

    const goToSignUp = () => {
        router.push("/(tabs)/Sign_up");
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.title}>History</Text>

                        <Text style={styles.subtitle}>
                            Your previous safety check-ins
                        </Text>
                    </View>

                    <View style={styles.headerIcon}>
                        <MaterialIcons
                            name="history"
                            size={38}
                            color="#F59E0B"
                        />
                    </View>
                </View>

                {/* CHECKING AUTHENTICATION */}
                {!authLoaded ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>
                            Checking Sign In...
                        </Text>

                        <Text style={styles.emptyText}>
                            Please wait while we check your account.
                        </Text>
                    </View>
                ) : !userId ? (
                    /* SIGN-IN REQUIRED */
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIcon}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={40}
                                color="#F59E0B"
                            />
                        </View>

                        <Text style={styles.emptyTitle}>
                            Sign In to View History
                        </Text>

                        <Text style={styles.emptyText}>
                            Sign in to view your saved safety check-ins.
                            Your history is kept separately for each account.
                        </Text>

                        <TouchableOpacity
                            style={styles.signInButton}
                            activeOpacity={0.8}
                            onPress={goToSignIn}
                        >
                            <Ionicons
                                name="log-in-outline"
                                size={22}
                                color="#FFFFFF"
                            />

                            <Text style={styles.signInButtonText}>
                                Sign In
                            </Text>

                            <Ionicons
                                name="arrow-forward"
                                size={18}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.signUpButton}
                            activeOpacity={0.8}
                            onPress={goToSignUp}
                        >
                            <Text style={styles.signUpButtonText}>
                                Don't have an account? Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : !historyLoaded ? (
                    /* LOADING HISTORY */
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIcon}>
                            <MaterialIcons
                                name="history"
                                size={40}
                                color="#F59E0B"
                            />
                        </View>

                        <Text style={styles.emptyTitle}>
                            Loading History...
                        </Text>

                        <Text style={styles.emptyText}>
                            Please wait while your check-ins load.
                        </Text>
                    </View>
                ) : history.length === 0 ? (
                    /* NO CHECK-INS */
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIcon}>
                            <MaterialIcons
                                name="history"
                                size={40}
                                color="#F59E0B"
                            />
                        </View>

                        <Text style={styles.emptyTitle}>
                            No Check-Ins Yet
                        </Text>

                        <Text style={styles.emptyText}>
                            Your completed safety check-ins will
                            appear here.
                        </Text>
                    </View>
                ) : (
                    /* HISTORY LIST */
                    <View style={styles.historyCard}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>
                                Check-In History
                            </Text>

                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>
                                    {history.length}
                                </Text>
                            </View>
                        </View>

                        {history.map((item, index) => (
                            <View
                                key={item.id}
                                style={[
                                    styles.historyItem,
                                    index !== history.length - 1 &&
                                        styles.historyDivider,
                                ]}
                            >
                                <View style={styles.successIcon}>
                                    <Ionicons
                                        name="shield-checkmark"
                                        size={27}
                                        color="#08A96D"
                                    />
                                </View>

                                <View style={styles.historyInfo}>
                                    <View style={styles.successBadge}>
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={15}
                                            color="#08A96D"
                                        />

                                        <Text style={styles.successBadgeText}>
                                            Successful
                                        </Text>
                                    </View>

                                    <Text style={styles.historyTitle}>
                                        Check-In Complete
                                    </Text>

                                    <Text style={styles.message}>
                                        {item.message}
                                    </Text>

                                    <View style={styles.detailRow}>
                                        <Ionicons
                                            name="calendar-outline"
                                            size={16}
                                            color="#2563E8"
                                        />

                                        <Text style={styles.dateTime}>
                                            {item.date} • {item.time}
                                        </Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Ionicons
                                            name="time-outline"
                                            size={16}
                                            color="#60729E"
                                        />

                                        <Text style={styles.duration}>
                                            Duration: {item.duration}
                                        </Text>
                                    </View>

                                    <View style={styles.reminderRow}>
                                        <Ionicons
                                            name={
                                                item.reminderEnabled
                                                    ? "notifications"
                                                    : "notifications-off"
                                            }
                                            size={16}
                                            color={
                                                item.reminderEnabled
                                                    ? "#08A96D"
                                                    : "#7182A5"
                                            }
                                        />

                                        <Text
                                            style={
                                                item.reminderEnabled
                                                    ? styles.reminder
                                                    : styles.reminderOff
                                            }
                                        >
                                            {item.reminderEnabled
                                                ? `Reminder: On • ${
                                                    item.reminderTime ||
                                                    "5 minutes before"
                                                }`
                                                : "Reminder: Off"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            <BottomNavigation activeTab="History" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F8FF",
    },

    scrollContainer: {
        paddingHorizontal: 22,
        paddingTop: 20,
        paddingBottom: 180,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
    },

    headerText: {
        flex: 1,
        paddingRight: 12,
    },

    title: {
        fontSize: 36,
        fontWeight: "800",
        color: "#173B8F",
    },

    subtitle: {
        fontSize: 16,
        lineHeight: 23,
        color: "#60729E",
        marginTop: 7,
    },

    headerIcon: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: "#FFF5DD",
        alignItems: "center",
        justifyContent: "center",
    },

    emptyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        padding: 28,
        alignItems: "center",
        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
    },

    emptyIcon: {
        width: 75,
        height: 75,
        borderRadius: 38,
        backgroundColor: "#FFF5DD",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },

    emptyTitle: {
        fontSize: 21,
        fontWeight: "800",
        color: "#173B8F",
        textAlign: "center",
    },

    emptyText: {
        fontSize: 15,
        lineHeight: 23,
        textAlign: "center",
        color: "#60729E",
        marginTop: 8,
    },

    signInButton: {
        minHeight: 54,
        width: "100%",
        backgroundColor: "#2563E8",
        borderRadius: 15,
        paddingHorizontal: 20,
        marginTop: 22,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    signInButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "800",
    },

    signUpButton: {
        padding: 14,
        marginTop: 4,
    },

    signUpButtonText: {
        color: "#2563E8",
        fontSize: 14,
        fontWeight: "700",
        textAlign: "center",
    },

    historyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 8,
        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    sectionTitle: {
        fontSize: 23,
        fontWeight: "800",
        color: "#173B8F",
        flex: 1,
    },

    countBadge: {
        minWidth: 32,
        height: 32,
        paddingHorizontal: 8,
        borderRadius: 16,
        backgroundColor: "#FFF5DD",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
    },

    countText: {
        fontSize: 13,
        fontWeight: "800",
        color: "#B77900",
    },

    historyItem: {
        flexDirection: "row",
        paddingVertical: 20,
    },

    historyDivider: {
        borderBottomWidth: 1,
        borderBottomColor: "#E5EBF4",
    },

    successIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#E2FAEF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
    },

    historyInfo: {
        flex: 1,
    },

    successBadge: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E2FAEF",
        borderRadius: 12,
        paddingHorizontal: 9,
        paddingVertical: 5,
        marginBottom: 8,
    },

    successBadgeText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#08A96D",
        marginLeft: 4,
    },

    historyTitle: {
        fontSize: 17,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 5,
    },

    message: {
        fontSize: 14,
        color: "#526487",
        lineHeight: 20,
        marginBottom: 10,
    },

    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },

    dateTime: {
        fontSize: 13,
        fontWeight: "700",
        color: "#2563E8",
        marginLeft: 6,
        flexShrink: 1,
    },

    duration: {
        fontSize: 13,
        color: "#7182A5",
        marginLeft: 6,
        flexShrink: 1,
    },

    reminderRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 3,
    },

    reminder: {
        flex: 1,
        fontSize: 13,
        fontWeight: "700",
        color: "#08A96D",
        marginLeft: 6,
    },

    reminderOff: {
        flex: 1,
        fontSize: 13,
        fontWeight: "600",
        color: "#7182A5",
        marginLeft: 6,
    },
});
