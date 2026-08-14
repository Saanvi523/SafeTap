import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    router,
    useFocusEffect,
    useLocalSearchParams,
} from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const HISTORY_KEY = "@safetap_history";

export default function ActualCheckIn() {
    const { duration } =
        useLocalSearchParams<{ duration?: string }>();

    const selectedDuration =
        typeof duration === "string"
            ? duration
            : "30 min";

    // Store a reference to the ScrollView.
    const scrollViewRef = useRef<ScrollView>(null);

    // Convert the selected duration into seconds.
    const getDurationInSeconds = (value: string) => {
        const numberMatch = value.match(/\d+/);

        const number = numberMatch
            ? parseInt(numberMatch[0], 10)
            : 30;

        const lowerValue = value.toLowerCase();

        if (lowerValue.includes("week")) {
            return number * 7 * 24 * 60 * 60;
        }

        if (lowerValue.includes("day")) {
            return number * 24 * 60 * 60;
        }

        if (
            lowerValue.includes("hour") ||
            lowerValue.includes("hr")
        ) {
            return number * 60 * 60;
        }

        return number * 60;
    };

    const currentDurationSeconds =
        getDurationInSeconds(selectedDuration);

    const [totalSeconds, setTotalSeconds] =
        useState(currentDurationSeconds);

    const [timeRemaining, setTimeRemaining] =
        useState(currentDurationSeconds);

    const [isActive, setIsActive] =
        useState(true);

    // Automatically scroll to the top when the page becomes active.
    useFocusEffect(
        useCallback(() => {
            const timer = setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    y: 0,
                    animated: false,
                });
            }, 50);

            return () => clearTimeout(timer);
        }, [])
    );

    // Reset the timer when the selected duration changes.
    useEffect(() => {
        const newDuration =
            getDurationInSeconds(selectedDuration);

        setTotalSeconds(newDuration);
        setTimeRemaining(newDuration);
        setIsActive(true);
    }, [selectedDuration]);

    // Run the countdown timer while the check-in is active.
    useEffect(() => {
        if (!isActive || timeRemaining <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining((previousTime) => {
                if (previousTime <= 1) {
                    clearInterval(timer);
                    setIsActive(false);
                    return 0;
                }

                return previousTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, timeRemaining]);

    // Format the remaining seconds into a readable timer.
    const formatTime = (seconds: number) => {
        const days =
            Math.floor(seconds / (24 * 60 * 60));

        const hours =
            Math.floor(
                (seconds % (24 * 60 * 60)) /
                    (60 * 60)
            );

        const minutes =
            Math.floor(
                (seconds % (60 * 60)) / 60
            );

        const remainingSeconds =
            seconds % 60;

        if (days > 0) {
            return `${days}:${String(hours).padStart(
                2,
                "0"
            )}:${String(minutes).padStart(
                2,
                "0"
            )}:${String(remainingSeconds).padStart(
                2,
                "0"
            )}`;
        }

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(
                2,
                "0"
            )}:${String(remainingSeconds).padStart(
                2,
                "0"
            )}`;
        }

        return `${String(minutes).padStart(
            2,
            "0"
        )}:${String(remainingSeconds).padStart(
            2,
            "0"
        )}`;
    };

    // Save the completed check-in to history.
    const handleImSafe = async () => {
        const now = new Date();

        const date =
            now.toLocaleDateString();

        const time =
            now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });

        // Create a new history record.
        const newHistoryItem = {
            id: Date.now().toString(),
            date,
            time,
            duration: selectedDuration,

            // Reminder information.
            reminderEnabled: true,
            reminderTime: "5 minutes before",

            message:
                `I'm Safe check-in completed at ${time}.`,
        };

        try {
            // Get existing history.
            const existingHistory =
                await AsyncStorage.getItem(
                    HISTORY_KEY
                );

            // Convert saved history into an array.
            const history =
                existingHistory
                    ? JSON.parse(existingHistory)
                    : [];

            // Make sure the saved data is an array.
            const validHistory =
                Array.isArray(history)
                    ? history
                    : [];

            // Add the newest check-in to the beginning.
            const updatedHistory = [
                newHistoryItem,
                ...validHistory,
            ];

            // Save the updated history.
            await AsyncStorage.setItem(
                HISTORY_KEY,
                JSON.stringify(updatedHistory)
            );

            // Reset the timer after the check-in is completed.
            const resetTime =
                getDurationInSeconds(
                    selectedDuration
                );

            setTotalSeconds(resetTime);
            setTimeRemaining(resetTime);
            setIsActive(true);

            Alert.alert(
                "Check-In Successful",
                `Your check-in was recorded at ${time}.`
            );
        } catch (error) {
            console.log(
                "Error saving history:",
                error
            );

            Alert.alert(
                "Error",
                "Your check-in could not be saved."
            );
        }
    };

    // End the current check-in after confirmation.
    const handleEndCheckIn = () => {
        Alert.alert(
            "End Check-In",
            "Are you sure you want to end this check-in?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "End Check-In",
                    style: "destructive",
                    onPress: () => {
                        setIsActive(false);

                        router.replace(
                            "/(tabs)/Check_In"
                        );
                    },
                },
            ]
        );
    };

    const progress =
        totalSeconds > 0
            ? timeRemaining / totalSeconds
            : 0;

    return (
        <SafeAreaView style={styles.container}>

            {/* SCROLLABLE CONTENT */}

            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.scrollContainer
                }
            >

                {/* HEADER */}

                <View style={styles.header}>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() =>
                            router.replace(
                                "/(tabs)/Check_In"
                            )
                        }
                    >
                        <Ionicons
                            name="arrow-back"
                            size={32}
                            color="#173B8F"
                        />
                    </TouchableOpacity>

                    <Text style={styles.title}>
                        Active Check-In
                    </Text>

                    <View
                        style={styles.headerShield}
                    >
                        <Ionicons
                            name="shield-checkmark"
                            size={42}
                            color="#2563E8"
                        />
                    </View>

                </View>

                {/* ACTIVE CHECK-IN CARD */}

                <View style={styles.activeCard}>

                    <View
                        style={styles.shieldCircle}
                    >
                        <Ionicons
                            name="shield-checkmark"
                            size={70}
                            color="#08B878"
                        />
                    </View>

                    <Text style={styles.activeTitle}>
                        Check-In Active
                    </Text>

                    <Text style={styles.safeText}>
                        You're Safe!
                    </Text>

                    {/* TIMER */}

                    <View style={styles.timerCircle}>

                        <View
                            style={[
                                styles.progressCircle,
                                {
                                    opacity:
                                        timeRemaining > 0
                                            ? 1
                                            : 0.3,

                                    transform: [
                                        {
                                            rotate:
                                                `${(1 - progress) * 180}deg`,
                                        },
                                    ],
                                },
                            ]}
                        />

                        <View
                            style={styles.timerInside}
                        >
                            <Text
                                style={styles.timeLabel}
                            >
                                Time remaining
                            </Text>

                            <Text
                                style={styles.timerText}
                            >
                                {formatTime(
                                    timeRemaining
                                )}
                            </Text>

                            <Text
                                style={
                                    styles.durationLabel
                                }
                            >
                                {selectedDuration}
                            </Text>
                        </View>

                    </View>

                    {/* STATUS */}

                    <View
                        style={styles.endTimeBox}
                    >
                        <Ionicons
                            name="time-outline"
                            size={28}
                            color="#08B878"
                        />

                        <Text
                            style={styles.endTimeText}
                        >
                            Check-in is currently active
                        </Text>
                    </View>

                    {/* I'M SAFE */}

                    <TouchableOpacity
                        style={styles.safeButton}
                        onPress={handleImSafe}
                    >
                        <Ionicons
                            name="shield-checkmark-outline"
                            size={34}
                            color="#FFFFFF"
                        />

                        <Text
                            style={
                                styles.safeButtonText
                            }
                        >
                            I'm Safe
                        </Text>
                    </TouchableOpacity>

                    {/* END CHECK-IN */}

                    <TouchableOpacity
                        style={styles.endButton}
                        onPress={handleEndCheckIn}
                    >
                        <Ionicons
                            name="stop-circle-outline"
                            size={32}
                            color="#EF2929"
                        />

                        <Text
                            style={
                                styles.endButtonText
                            }
                        >
                            End Check-In
                        </Text>
                    </TouchableOpacity>

                </View>

                {/* REMINDER SECTION */}

                <View style={styles.reminderCard}>

                    <View
                        style={styles.reminderHeader}
                    >

                        <View
                            style={styles.infoIconBlue}
                        >
                            <Ionicons
                                name="notifications"
                                size={32}
                                color="#2563E8"
                            />
                        </View>

                        <View
                            style={
                                styles.reminderHeaderText
                            }
                        >
                            <Text
                                style={
                                    styles.reminderTitle
                                }
                            >
                                Reminder
                            </Text>

                            <Text
                                style={
                                    styles.reminderDescription
                                }
                            >
                                Get a reminder before your
                                check-in ends.
                            </Text>
                        </View>

                    </View>

                    <View
                        style={styles.reminderBottom}
                    >

                        <View
                            style={styles.reminderStatus}
                        >
                            <Ionicons
                                name="time-outline"
                                size={23}
                                color="#2563E8"
                            />

                            <Text
                                style={
                                    styles.reminderStatusText
                                }
                            >
                                5 minutes before
                            </Text>
                        </View>

                        {/* EDIT REMINDER */}

                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() =>
                                router.push(
                                    "/(tabs)/Settings"
                                )
                            }
                        >
                            <Text
                                style={
                                    styles.editButtonText
                                }
                            >
                                Edit Reminder
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </ScrollView>

            {/* FIXED BOTTOM NAVIGATION */}

            <View style={styles.bottomNav}>

                {/* HOME */}

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() =>
                        router.push(
                            "/(tabs)/Home"
                        )
                    }
                >
                    <Ionicons
                        name="home"
                        size={34}
                        color="#526487"
                    />

                    <Text style={styles.navText}>
                        Home
                    </Text>
                </TouchableOpacity>

                {/* CHECK IN */}

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() =>
                        router.replace(
                            "/(tabs)/Check_In"
                        )
                    }
                >
                    <View
                        style={styles.activeLine}
                    />

                    <Ionicons
                        name="shield-checkmark"
                        size={34}
                        color="#2563E8"
                    />

                    <Text
                        style={[
                            styles.navText,
                            styles.activeText,
                        ]}
                    >
                        Check In
                    </Text>
                </TouchableOpacity>

                {/* CONTACTS */}

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() =>
                        router.push(
                            "/(tabs)/Contacts"
                        )
                    }
                >
                    <Ionicons
                        name="people"
                        size={34}
                        color="#08B88A"
                    />

                    <Text style={styles.navText}>
                        Contacts
                    </Text>
                </TouchableOpacity>

                {/* HISTORY */}

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() =>
                        router.push(
                            "/(tabs)/History"
                        )
                    }
                >
                    <MaterialIcons
                        name="history"
                        size={35}
                        color="#F59E0B"
                    />

                    <Text style={styles.navText}>
                        History
                    </Text>
                </TouchableOpacity>

                {/* SETTINGS */}

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() =>
                        router.push(
                            "/(tabs)/Settings"
                        )
                    }
                >
                    <Ionicons
                        name="settings"
                        size={34}
                        color="#7C3AED"
                    />

                    <Text style={styles.navText}>
                        Settings
                    </Text>
                </TouchableOpacity>

            </View>

        </SafeAreaView>
    );
}


// STYLES

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F5F8FF",
    },

    scrollContainer: {
        paddingHorizontal: 22,
        paddingTop: 18,
        paddingBottom: 150,
    },

    // HEADER

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 25,
    },

    backButton: {
        width: 62,
        height: 62,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 10,

        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 5,
    },

    title: {
        fontSize: 31,
        fontWeight: "800",
        color: "#173B8F",
    },

    headerShield: {
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
    },

    // ACTIVE CARD

    activeCard: {
        backgroundColor: "#F7FFFB",
        borderRadius: 28,
        paddingHorizontal: 22,
        paddingTop: 35,
        paddingBottom: 25,

        borderWidth: 1,
        borderColor: "#D8F1E6",

        shadowColor: "#7898D8",
        shadowOpacity: 0.10,
        shadowRadius: 12,

        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    shieldCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "#ECFFF5",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },

    activeTitle: {
        fontSize: 36,
        fontWeight: "800",
        color: "#08A96D",
        textAlign: "center",
        marginTop: 18,
    },

    safeText: {
        fontSize: 23,
        fontWeight: "600",
        color: "#526487",
        textAlign: "center",
        marginTop: 8,
    },

    // TIMER

    timerCircle: {
        width: 290,
        height: 290,
        borderRadius: 145,
        borderWidth: 16,
        borderColor: "#D8F4E8",
        alignSelf: "center",
        marginTop: 25,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    progressCircle: {
        position: "absolute",
        width: 290,
        height: 290,
        borderRadius: 145,
        borderWidth: 16,
        borderColor: "#08A96D",
        borderLeftColor: "transparent",
        borderBottomColor: "transparent",
    },

    timerInside: {
        alignItems: "center",
        justifyContent: "center",
    },

    timeLabel: {
        fontSize: 19,
        fontWeight: "600",
        color: "#526487",
        marginBottom: 8,
    },

    timerText: {
        fontSize: 43,
        fontWeight: "800",
        color: "#08A96D",
    },

    durationLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: "#526487",
        marginTop: 4,
    },

    // STATUS

    endTimeBox: {
        height: 55,
        borderRadius: 28,
        backgroundColor: "#ECFFF7",
        borderWidth: 1,
        borderColor: "#CDEFE0",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 22,
    },

    endTimeText: {
        fontSize: 17,
        fontWeight: "700",
        color: "#173B8F",
        marginLeft: 9,
    },

    // I'M SAFE

    safeButton: {
        height: 68,
        borderRadius: 20,
        backgroundColor: "#08A96D",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 22,

        shadowColor: "#08A96D",
        shadowOpacity: 0.25,
        shadowRadius: 10,

        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    safeButtonText: {
        color: "#FFFFFF",
        fontSize: 23,
        fontWeight: "800",
        marginLeft: 10,
    },

    // END BUTTON

    endButton: {
        height: 64,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#EF2929",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 18,
    },

    endButtonText: {
        color: "#EF2929",
        fontSize: 21,
        fontWeight: "800",
        marginLeft: 10,
    },

    // REMINDER CARD

    reminderCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        paddingHorizontal: 20,
        paddingVertical: 22,
        marginTop: 22,

        shadowColor: "#7898D8",
        shadowOpacity: 0.10,
        shadowRadius: 12,

        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    reminderHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    infoIconBlue: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: "#E3EEFF",
        alignItems: "center",
        justifyContent: "center",
    },

    reminderHeaderText: {
        flex: 1,
        marginLeft: 15,
    },

    reminderTitle: {
        fontSize: 23,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 5,
    },

    reminderDescription: {
        fontSize: 15,
        lineHeight: 22,
        color: "#526487",
    },

    reminderBottom: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 18,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#DDE5F2",
    },

    reminderStatus: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    reminderStatusText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#526487",
        marginLeft: 8,
    },

    editButton: {
        borderWidth: 1.5,
        borderColor: "#2563E8",
        borderRadius: 16,
        paddingHorizontal: 13,
        paddingVertical: 11,
    },

    editButtonText: {
        fontSize: 14,
        fontWeight: "800",
        color: "#2563E8",
    },

    // FIXED BOTTOM NAVIGATION

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

        elevation: 8,
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