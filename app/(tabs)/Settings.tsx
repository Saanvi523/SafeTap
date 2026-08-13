import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const REMINDER_KEY = "@safetap_reminder_alerts";

export default function Settings() {

    const [reminderAlerts, setReminderAlerts] = useState(true);

    /*
     * LOAD SAVED REMINDER SETTING
     */
    useEffect(() => {

        const loadReminderSetting = async () => {

            try {

                const savedSetting =
                    await AsyncStorage.getItem(REMINDER_KEY);

                if (savedSetting !== null) {

                    setReminderAlerts(
                        savedSetting === "true"
                    );

                }

            } catch (error) {

                console.log(
                    "Error loading reminder setting:",
                    error
                );

            }

        };

        loadReminderSetting();

    }, []);


    /*
     * TOGGLE AND SAVE REMINDER SETTING
     */
    const toggleReminderAlerts = async () => {

        const newValue = !reminderAlerts;

        setReminderAlerts(newValue);

        try {

            await AsyncStorage.setItem(
                REMINDER_KEY,
                String(newValue)
            );

        } catch (error) {

            console.log(
                "Error saving reminder setting:",
                error
            );

        }

    };


    return (
        <SafeAreaView style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >

                {/* HEADER */}

                <View style={styles.header}>

                    <View>

                        <Text style={styles.title}>
                            Settings
                        </Text>

                    </View>

                    <View style={styles.shieldContainer}>

                        <Ionicons
                            name="shield-checkmark"
                            size={52}
                            color="#2563E8"
                        />

                    </View>

                </View>


                {/* ACCOUNT */}

                <Text style={styles.sectionTitle}>
                    Account
                </Text>


                <TouchableOpacity
                    style={styles.singleCard}
                    onPress={() => {
                        // Profile page can be added later
                    }}
                >

                    <View style={styles.iconCircleBlue}>

                        <Ionicons
                            name="person"
                            size={32}
                            color="#2563E8"
                        />

                    </View>


                    <View style={styles.cardTextContainer}>

                        <Text style={styles.cardTitle}>
                            Profile
                        </Text>

                        <Text style={styles.cardDescription}>
                            View and edit your profile
                        </Text>

                    </View>


                    <Ionicons
                        name="chevron-forward"
                        size={30}
                        color="#60729E"
                    />

                </TouchableOpacity>


                {/* PREFERENCES */}

                <Text style={styles.sectionTitle}>
                    Preferences
                </Text>


                <View style={styles.preferencesCard}>

                    <View style={styles.settingRow}>

                        <View style={styles.iconCircleBlue}>

                            <Ionicons
                                name="notifications"
                                size={30}
                                color="#2563E8"
                            />

                        </View>


                        <View style={styles.cardTextContainer}>

                            <Text style={styles.cardTitle}>
                                Reminder Alerts
                            </Text>

                            <Text style={styles.cardDescription}>
                                Get reminded before check-in ends
                            </Text>

                        </View>


                        <TouchableOpacity
                            style={[
                                styles.toggle,
                                reminderAlerts
                                    ? styles.toggleOn
                                    : styles.toggleOff,
                            ]}
                            onPress={toggleReminderAlerts}
                        >

                            <View
                                style={[
                                    styles.toggleCircle,
                                    reminderAlerts
                                        ? styles.toggleCircleOn
                                        : styles.toggleCircleOff,
                                ]}
                            />

                        </TouchableOpacity>

                    </View>

                </View>


                {/* SAFETY & ALERTS */}

                <Text style={styles.sectionTitle}>
                    Safety & Alerts
                </Text>


                <TouchableOpacity
                    style={styles.singleCard}
                    onPress={() =>
                        router.push("/(tabs)/Contacts")
                    }
                >

                    <View style={styles.iconCircleRed}>

                        <Ionicons
                            name="people"
                            size={31}
                            color="#E53935"
                        />

                    </View>


                    <View style={styles.cardTextContainer}>

                        <Text style={styles.cardTitle}>
                            Trusted Contacts
                        </Text>

                        <Text style={styles.cardDescription}>
                            Manage your trusted contacts
                        </Text>

                    </View>


                    <Ionicons
                        name="chevron-forward"
                        size={30}
                        color="#60729E"
                    />

                </TouchableOpacity>


                {/* OTHER */}

                <Text style={styles.sectionTitle}>
                    Other
                </Text>


                <TouchableOpacity
                    style={styles.singleCard}
                    onPress={() => {
                        // Logout functionality can be added later
                    }}
                >

                    <View style={styles.iconCircleRed}>

                        <MaterialIcons
                            name="logout"
                            size={31}
                            color="#E53935"
                        />

                    </View>


                    <View style={styles.cardTextContainer}>

                        <Text style={styles.logoutTitle}>
                            Log Out
                        </Text>

                        <Text style={styles.cardDescription}>
                            Sign out of your account
                        </Text>

                    </View>


                    <Ionicons
                        name="chevron-forward"
                        size={30}
                        color="#60729E"
                    />

                </TouchableOpacity>

            </ScrollView>


            {/* FIXED BOTTOM NAVIGATION */}

            <View style={styles.bottomNav}>

                {/* HOME */}

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() =>
                        router.push("/(tabs)/Home")
                    }
                >

                    <Ionicons
                        name="home"
                        size={32}
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
                        router.push("/(tabs)/Check_In")
                    }
                >

                    <Ionicons
                        name="shield-checkmark"
                        size={32}
                        color="#2563E8"
                    />

                    <Text style={styles.navText}>
                        Check In
                    </Text>

                </TouchableOpacity>


                {/* CONTACTS */}

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() =>
                        router.push("/(tabs)/Contacts")
                    }
                >

                    <Ionicons
                        name="people"
                        size={32}
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
                        router.push("/(tabs)/History")
                    }
                >

                    <MaterialIcons
                        name="history"
                        size={34}
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
                        router.push("/(tabs)/Settings")
                    }
                >

                    <View style={styles.activeLine} />

                    <Ionicons
                        name="settings"
                        size={32}
                        color="#7C3AED"
                    />

                    <Text
                        style={[
                            styles.navText,
                            styles.activeSettingsText,
                        ]}
                    >
                        Settings
                    </Text>

                </TouchableOpacity>

            </View>

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
        marginBottom: 35,
    },

    title: {
        fontSize: 45,
        fontWeight: "800",
        color: "#173B8F",
    },

    subtitle: {
        fontSize: 18,
        lineHeight: 27,
        color: "#60729E",
        marginTop: 8,
    },

    shieldContainer: {
        width: 82,
        height: 82,
        borderRadius: 41,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#7EA7EF",
        shadowOpacity: 0.15,
        shadowRadius: 12,

        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    sectionTitle: {
        fontSize: 27,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 14,
        marginTop: 5,
    },

    singleCard: {
        minHeight: 112,
        backgroundColor: "#FFFFFF",
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        marginBottom: 38,

        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,

        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    preferencesCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 25,
        paddingHorizontal: 24,
        paddingVertical: 10,
        marginBottom: 38,

        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,

        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    settingRow: {
        minHeight: 105,
        flexDirection: "row",
        alignItems: "center",
    },

    cardTextContainer: {
        flex: 1,
        marginLeft: 20,
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#172E70",
        marginBottom: 5,
    },

    cardDescription: {
        fontSize: 16,
        lineHeight: 23,
        color: "#60729E",
    },

    logoutTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#D62828",
    },

    iconCircleBlue: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#E5EFFF",
        justifyContent: "center",
        alignItems: "center",
    },

    iconCircleRed: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#FFE4E8",
        justifyContent: "center",
        alignItems: "center",
    },

    toggle: {
        width: 58,
        height: 34,
        borderRadius: 20,
        justifyContent: "center",
        paddingHorizontal: 3,
    },

    toggleOn: {
        backgroundColor: "#2563E8",
        alignItems: "flex-end",
    },

    toggleOff: {
        backgroundColor: "#D7D9DE",
        alignItems: "flex-start",
    },

    toggleCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
    },

    toggleCircleOn: {
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowRadius: 3,

        shadowOffset: {
            width: 0,
            height: 1,
        },

        elevation: 2,
    },

    toggleCircleOff: {
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowRadius: 3,

        shadowOffset: {
            width: 0,
            height: 1,
        },

        elevation: 2,
    },

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

    activeLine: {
        position: "absolute",
        top: 0,
        width: 55,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#7C3AED",
    },

    activeSettingsText: {
        color: "#7C3AED",
        fontWeight: "800",
    },

});