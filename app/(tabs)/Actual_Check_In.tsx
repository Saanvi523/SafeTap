import { Ionicons } from "@expo/vector-icons";
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
                        onPress 
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}