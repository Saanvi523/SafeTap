import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
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
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [historyLoaded, setHistoryLoaded] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    // Load only the history belonging to the specified account.
    const loadHistory = useCallback(async (userId: string) => {
        setHistoryLoaded(false);

        try {
            const savedHistory = await AsyncStorage.getItem(
                getHistoryKey(userId)
            );

            const parsedHistory: unknown = savedHistory
                ? JSON.parse(savedHistory)
                : [];

            setHistory(
                Array.isArray(parsedHistory)
                    ? (parsedHistory as HistoryItem[])
                    : []
            );
        } catch (error) {
            console.error("Unable to load check-in history:", error);
            setHistory([]);
        } finally {
            setHistoryLoaded(true);
        }
    }, []);

    // Check the current session and respond to sign-in/sign-out.
    useEffect(() => {
        let active = true;

        const checkCurrentUser = async () => {
            try {
                const {
                    data: { user },
                    error,
                } = await supabase.auth.getUser();

                if (!active) return;

                if (error || !user) {
                    setCurrentUserId(null);
                    setHistory([]);
                    setHistoryLoaded(true);
                    return;
                }

                setCurrentUserId(user.id);
                await loadHistory(user.id);
            } catch (error) {
                if (active) {
                    console.error("Unable to check signed-in user:", error);
                    setCurrentUserId(null);
                    setHistory([]);
                    setHistoryLoaded(true);
                }
            }
        };

        void checkCurrentUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (!active) return;

            if (event === "SIGNED_OUT" || !session?.user) {
                setCurrentUserId(null);
                setHistory([]);
                setHistoryLoaded(true);
                return;
            }

            const userId = session.user.id;

            setCurrentUserId(userId);
            setHistory([]);
            setHistoryLoaded(false);

            // Defer storage work until the authentication callback returns.
            setTimeout(() => {
                if (active) {
                    void loadHistory(userId);
                }
            }, 0);
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, [loadHistory]);

    // Refresh the current user's history whenever this page is opened.
    useFocusEffect(
        useCallback(() => {
            let active = true;

            const refreshHistory = async () => {
                try {
                    const {
                        data: { user },
                        error,
                    } = await supabase.auth.getUser();

                    if (!active) return;

                    if (error || !user) {
                        setCurrentUserId(null);
                        setHistory([]);
                        setHistoryLoaded(true);
                        return;
                    }

                    setCurrentUserId(user.id);
                    await loadHistory(user.id);
                } catch (error) {
                    if (active) {
                        console.error("Unable to refresh history:", error);
                        setHistory([]);
                        setHistoryLoaded(true);
                    }
                }
            };

            void refreshHistory();

            const timeout = setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    y: 0,
                    animated: false,
                });
            }, 100);

            return () => {
                active = false;
                clearTimeout(timeout);
            };
        }, [loadHistory])
    );

    // Navigate to the existing sign-in screen.
    const goToSignIn = () => {
        router.push("/Log_in");
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
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>History</Text>

                        <Text style={styles.subtitle}>
                            Your previous safety check-ins
                        </Text>
                    </View>

                    <View style={styles.headerIcon}>
                        <MaterialIcons
                            name="history"
                            size={40}
                            color="#F59E0B"
                        />
                    </View>
                </View>

                {/* LOADING STATE */}
                {!historyLoaded ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>
                            Loading History...
                        </Text>

                        <Text style={styles.emptyText}>
                            Please wait while your check-ins load.
                        </Text>
                    </View>
                ) : !currentUserId ? (
                    /* SIGN-IN REQUIRED */
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIcon}>
                            <MaterialIcons
                                name="history"
                                size={55}
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
                            onPress={goToSignIn}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="log-in-outline"
                                size={23}
                                color="#FFFFFF"
                            />

                            <Text style={styles.signInButtonText}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : history.length === 0 ? (
                    /* SIGNED IN, BUT NO HISTORY */
                    <View style={styles.emptyCard}>
                        <View style={styles.emptyIcon}>
                            <MaterialIcons
                                name="history"
                                size={55}
                                color="#F59E0B"
                            />
                        </View>

                        <Text style={styles.emptyTitle}>
                            No Check-Ins Yet
                        </Text>

                        <Text style={styles.emptyText}>
                            Your completed safety check-ins{"\n"}
                            will appear here.
                        </Text>
                    </View>
                ) : (
                    /* HISTORY LIST */
                    <View style={styles.historyCard}>
                        <Text style={styles.sectionTitle}>
                            Check-In History
                        </Text>

                        {history.map((item) => (
                            <View
                                key={item.id}
                                style={styles.historyItem}
                            >
                                <View style={styles.successIcon}>
                                    <Ionicons
                                        name="shield-checkmark"
                                        size={28}
                                        color="#08A96D"
                                    />
                                </View>

                                <View style={styles.historyInfo}>
                                    <Text style={styles.historyTitle}>
                                        Check-In Successful
                                    </Text>

                                    <Text style={styles.message}>
                                        {item.message}
                                    </Text>

                                    <Text style={styles.dateTime}>
                                        {item.date} • {item.time}
                                    </Text>

                                    <Text style={styles.duration}>
                                        Duration: {item.duration}
                                    </Text>

                                    {item.reminderEnabled ? (
                                        <View style={styles.reminderRow}>
                                            <Ionicons
                                                name="notifications"
                                                size={16}
                                                color="#08A96D"
                                            />

                                            <Text style={styles.reminder}>
                                                Reminder: On •{" "}
                                                {item.reminderTime ||
                                                    "5 minutes before"}
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={styles.reminderRow}>
                                            <Ionicons
                                                name="notifications-off"
                                                size={16}
                                                color="#7182A5"
                                            />

                                            <Text style={styles.reminderOff}>
                                                Reminder: Off
                                            </Text>
                                        </View>
                                    )}
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
        paddingBottom: 130,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
    },

    headerTextContainer: {
        flex: 1,
        paddingRight: 15,
    },

    title: {
        fontSize: 43,
        fontWeight: "800",
        color: "#173B8F",
    },

    subtitle: {
        fontSize: 17,
        lineHeight: 24,
        color: "#60729E",
        marginTop: 8,
    },

    headerIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#7898D8",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        elevation: 5,
    },

    emptyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        paddingVertical: 45,
        paddingHorizontal: 25,
        alignItems: "center",
        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        elevation: 5,
    },

    emptyIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#FFF5DD",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },

    emptyTitle: {
        fontSize: 25,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 10,
        textAlign: "center",
    },

    emptyText: {
        fontSize: 16,
        lineHeight: 25,
        color: "#60729E",
        textAlign: "center",
    },

    signInButton: {
        minWidth: 180,
        height: 54,
        borderRadius: 16,
        backgroundColor: "#2563E8",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 25,
        marginTop: 24,
    },

    signInButtonText: {
        fontSize: 17,
        fontWeight: "800",
        color: "#FFFFFF",
        marginLeft: 9,
    },

    historyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 10,
        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        elevation: 5,
    },

    sectionTitle: {
        fontSize: 25,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 20,
    },

    historyItem: {
        flexDirection: "row",
        paddingVertical: 18,
        borderTopWidth: 1,
        borderTopColor: "#E3EAF5",
    },

    successIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#E8FFF4",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },

    historyInfo: {
        flex: 1,
    },

    historyTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 5,
    },

    message: {
        fontSize: 14,
        color: "#526487",
        lineHeight: 20,
        marginBottom: 6,
    },

    dateTime: {
        fontSize: 14,
        fontWeight: "700",
        color: "#2563E8",
        marginBottom: 4,
    },

    duration: {
        fontSize: 13,
        color: "#7182A5",
    },

    reminderRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },

    reminder: {
        fontSize: 13,
        fontWeight: "700",
        color: "#08A96D",
        marginLeft: 5,
        flexShrink: 1,
    },

    reminderOff: {
        fontSize: 13,
        fontWeight: "600",
        color: "#7182A5",
        marginLeft: 5,
    },
});
