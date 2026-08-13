import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Touchable, TouchableOpacity } from "react-native";
import { ScrollView, View } from "react-native-reanimated/lib/typescript/Animated";

export default function ActualCheckIn() {

    const { duration } = useLocalSearchParams<{ duration?: string }>();

    const selectedDuration = duration || "30 min";

    const getDurationInSeconds = (value: string) => {
        if (value.includes("week")) {
            return 7 * 24 * 60 * 60;
        }

        if (value.includes("day")) {
            const days = parseInt(value);
            return days * 24 * 60 * 60;
        }

        if (value.includes("hour")) {
            const hours = parseInt(value);
            return hours * 60 * 60;
        }

        const minutes = parseInt(value);
        return minutes * 60;
    };

    const [totalSeconds, setTotalSeconds] = useState(
        getDurationInSeconds(selectedDuration)
    );

    const [timeRemaining, setTimeRemaining] = useState(
        getDurationInSeconds(selectedDuration)
    );

    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (!isActive || timeRemaining <= 0) {
            return;
        }

        const timer = setInterval (() => {
            setTimeRemaining((previousTime) => {
                if (previousTime <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return previousTime -1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, timeRemaining]);

    const formatTime = (seconds: number) => {

        const days = Math.floor(seconds / (24 * 60 * 60));
        const hours = Math.floor(
            (seconds % (24 * 60 * 60)) / (24 * 60 * 60)
        );
        const remainingSeconds = seconds % 60;

        if (days > 0) {
            return `${days}:$(String(hours).padStart(2, "0")}:${String(
                minutes
            ).padStart(2, "0")}:${String(remainingSeconds).padStart(
                2,
                "0"
            )}`;
        }

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(
                2,
                "0"
            )}:${String(remainingSeconds).padStart(2, "0")}`;
        }

        return `${String(minutes).padStart(
            2,
            "0"
        )}:${String(remainingSeconds).padStart(2, "0")}`;
    };

    const handleImSafe = () => {

        setTimeRemaining(totalSeconds);

        Alert.alert(
            "Check-In Successful",
            "Your check-in has been recorded. The timer has been reset."
        );
    };

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
                        router.push("/(tabs)/Check_In");
                    },
                },
            ]
        );
    };

    const progress = 
        totalSeconds > 0
            ?timeRemaining / totalSeconds
            : 0;

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >


                <View style={styles.header}>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons
                            name="arrow-black"
                            size={32}
                            color="#173B8F"
                        />
                    </TouchableOpacity>

                    <Text style={styles.title}>
                        active Check-In
                    </Text>

                    <View style={styles.headerShield}>
                        <Ionicons
                            name="shield-checkmark"
                            size={42}
                            color="#2563E8"
                        />
                    </View>

                </View>



                <View style={styles.activeCard}>

                    <View style={styles.shieldCircle}>

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
                                            rotate: `${(1 - progress) * 180}deg`,
                                        },
                                    ],
                                },
                            ]}
                        />

                        <View style={styles.timerInside}>

                            <Text style={styles.timeLabel}>
                                Time remaining
                            </Text>

                            <Text style={styles.timerText}>
                                {formatTime(timeRemaining)}
                            </Text>

                            <Text style={styles.durationLabel}>
                                {selectedDuration}
                            </Text>

                        </View>

                    </View>



                    <View style={styles.endTimeBox}>

                        <Ionicons
                            name="time-outline"
                            size={28}
                            color="#08B878"
                        />

                        <Text style={styles.endTimeText}>
                            Check-in is currently active
                        </Text>

                    </View>



                    <TouchableOpacity
                        style={styles.safeButton}
                        onPress={handleImSafe}
                    >

                        <Ionicons
                            name="shield-checkmark-outline"
                            size={34}
                            color="#FFFFFF"
                        />

                        <Text style={styles.safeButtonText}>
                            I'm Safe
                        </Text>

                    </TouchableOpacity>



                    <TouchableOpacity
                        style={styles.endButton}
                        onPress={handleEndCheckIn}
                    >

                        <Ionicons
                            name="stop-circle-outline"
                            size={32}
                            color="#EF2929"
                        />

                        <Text style={styles.endButtonText}>
                            End Check-In
                        </Text>

                    </TouchableOpacity>

                </View>



                <View style={styles.infoCard}>

                    <Text style={styles.infoTitle}>
                        If you don't check in
                    </Text>


                    <View style={styles.infoRow}>

                        <View style={styles.infoIconPurple}>

                            <Ionicons
                                name="people"
                                size={32}
                                color="#8B4DFF"
                            />

                        </View>

                        <Text style={styles.infoText}>
                            We will alert your trusted {"\n"}
                            contacts when the timer{"\n"}
                            reaches zero.
                        </Text>

                        <View style={styles.contactBadge}>

                            <Text style={styles.contactNumber}>
                                3
                            </Text>

                            <Text style={styles.contactText}>
                                contacts
                            </Text>

                        </View>

                    </View>



                    <View style={styles.reminderBox}>

                        <View style={styles.infoIconBlue}>

                            <Ionicons
                                name="notifications"
                                size={32}
                                color="#2563E8"
                            />

                        </View>

                        <Text style={styles.reminderText}>
                            We'ss send a reminder{"\n"}
                            before your check-in ends.
                        </Text>

                        <TouchableOpacity
                            style={styles.editButton}
                        >
                            <Text style={styles.editButtonText}>
                                Edit Reminder
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>



                <View style={styles.bottomNav}>

                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() =>
                            router.push("/(tabs)/Home")
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


                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() =>
                            router.push("/(tabs)/Check_In")
                        }
                    >

                        <View style={styles.activeLine}
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


                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() =>
                            router.push("/(tabs)/Contacts")
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


                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() =>
                            router.push("/(tabs)/History")
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


                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() =>
                            router.push("/(tabs)/Settings")
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

            </ScrollView>

        </SafeAreaView>
    );
}


const styles= StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F5F8FF",
    },

    scrollContainer: {
        paddingHorizontal: 22,
        paddingTop: 18,
        paddingBottom: 25,
    },

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

    infoCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        paddingHorizontal: 22,
        paddingTop: 25,
        paddingBottom: 20,
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

    infoTitle: {
        fontSize: 25,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 22,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    infoIconPurple: {
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: "#F0E5FF",
        alignItems: "center",
        justifyContent: "center",
    },

    infoText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 25,
        color: "#526487",
        marginLeft: 15,
    },

    contactBadge: {
        backgroundColor: "#F0E5FF",
        borderRadius: 18,
        paddingHorizontal: 12,
        paddingVertical: 9,
        alignItems: "center",
    },

    contactNumber: {
        fontSize: 17,
        fontWeight: "800",
        color: "#8B4DFF",
    },

    contactText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#8B4DFF",
    },

    reminderBox: {
        minHeight: 105,
        borderRadius: 20,
        backgroundColor: "#F5F9FF",
        borderWidth: 1,
        borderColor: "#D7E5FF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 12,
    },

    infoIconBlue: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#E3EEFF",
        alignItems: "center",
        justifyContent: "center",
    },

    reminderText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 23,
        color: "#526487",
        fontWeight: "600",
        marginLeft: 12,
    },

    editButton: {
        borderWidth: 1.5,
        borderColor: "#2563E8",
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },

    editButtonText: {
        fontSize: 14,
        fontWeight: "800",
        color: "#2563E8",
    },

    bottomNav: {
        height: 94,
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: 22,

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
})