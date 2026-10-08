import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import BottomNavigation from "../../components/Bottom_Navigation";
import { supabase } from "../../lib/supabase";

const REMINDER_KEY = "@safetap_reminder_alerts";

export default function Settings() {
    const [reminderAlerts, setReminderAlerts] = useState(true);
    const [showProfile, setShowProfile] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(false);

    /* LOAD REMINDER SETTING */

    useEffect(() => {
        const loadReminderSetting = async () => {
            try {
                const savedSetting =
                    await AsyncStorage.getItem(REMINDER_KEY);

                if (savedSetting !== null) {
                    setReminderAlerts(savedSetting === "true");
                }
            } catch (error) {
                console.error("Error loading reminder setting:", error);
            }
        };

        loadReminderSetting();
    }, []);

    /* LOAD SIGNED-IN USER PROFILE */

    const loadProfile = async () => {
        setLoadingProfile(true);

        try {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error) {
                throw error;
            }

            if (!user) {
                setFullName("");
                setEmail("");
                Alert.alert(
                    "Not Signed In",
                    "Please sign in to view your profile."
                );
                return;
            }

            const nameFromMetadata =
                user.user_metadata?.full_name ??
                user.user_metadata?.name ??
                "";

            setFullName(
                typeof nameFromMetadata === "string" &&
                nameFromMetadata.trim()
                    ? nameFromMetadata.trim()
                    : "Name not provided"
            );

            setEmail(user.email ?? "Email not available");
        } catch (error) {
            console.error("Error loading profile:", error);

            Alert.alert(
                "Profile Unavailable",
                "We couldn't load your account information. Please try again."
            );
        } finally {
            setLoadingProfile(false);
        }
    };

    /* OPEN PROFILE */

    const openProfile = async () => {
        setShowProfile(true);
        await loadProfile();
    };

    /* TOGGLE REMINDER SETTING */

    const toggleReminderAlerts = async () => {
        const newValue = !reminderAlerts;

        setReminderAlerts(newValue);

        try {
            await AsyncStorage.setItem(
                REMINDER_KEY,
                String(newValue)
            );
        } catch (error) {
            console.error("Error saving reminder setting:", error);

            Alert.alert(
                "Couldn't Save Setting",
                "Your reminder preference could not be saved."
            );
        }
    };

    /* LOG OUT */

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const { error } =
                                await supabase.auth.signOut();

                            if (error) {
                                throw error;
                            }

                            setShowProfile(false);
                            router.replace("/");
                        } catch (error) {
                            console.error("Error logging out:", error);

                            Alert.alert(
                                "Log Out Failed",
                                "You couldn't be signed out. Please try again."
                            );
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {/* HEADER */}

                <View style={styles.header}>
                    <Text style={styles.title}>Settings</Text>

                    <View style={styles.shieldContainer}>
                        <Ionicons
                            name="shield-checkmark"
                            size={52}
                            color="#2563E8"
                        />
                    </View>
                </View>

                {/* ACCOUNT */}

                <Text style={styles.sectionTitle}>Account</Text>

                <TouchableOpacity
                    style={styles.singleCard}
                    onPress={openProfile}
                    activeOpacity={0.8}
                >
                    <View style={styles.iconCircleBlue}>
                        <Ionicons
                            name="person"
                            size={32}
                            color="#2563E8"
                        />
                    </View>

                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>Profile</Text>
                        <Text style={styles.cardDescription}>
                            View your name and email address
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={30}
                        color="#60729E"
                    />
                </TouchableOpacity>

                {/* PREFERENCES */}

                <Text style={styles.sectionTitle}>Preferences</Text>

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
                            activeOpacity={0.8}
                            accessibilityRole="switch"
                            accessibilityState={{
                                checked: reminderAlerts,
                            }}
                            accessibilityLabel="Reminder Alerts"
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
                    activeOpacity={0.8}
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

                <Text style={styles.sectionTitle}>Other</Text>

                <TouchableOpacity
                    style={styles.singleCard}
                    onPress={handleLogout}
                    activeOpacity={0.8}
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

            {/* PROFILE POPUP */}

            <Modal
                visible={showProfile}
                transparent
                animationType="fade"
                onRequestClose={() => setShowProfile(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.profileModal}>
                        <View style={styles.profileHeader}>
                            <View style={styles.profileIcon}>
                                <Ionicons
                                    name="person"
                                    size={35}
                                    color="#2563E8"
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowProfile(false)}
                                activeOpacity={0.8}
                                accessibilityLabel="Close profile"
                            >
                                <Ionicons
                                    name="close"
                                    size={27}
                                    color="#526487"
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.profileTitle}>
                            My Profile
                        </Text>

                        <Text style={styles.profileSubtitle}>
                            Your SafeTap account information
                        </Text>

                        {loadingProfile ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator
                                    size="large"
                                    color="#2563E8"
                                />
                                <Text style={styles.loadingText}>
                                    Loading your profile...
                                </Text>
                            </View>
                        ) : (
                            <>
                                {/* NAME */}

                                <View style={styles.profileInfoBox}>
                                    <Text style={styles.profileLabel}>
                                        Full Name
                                    </Text>

                                    <View style={styles.profileValueRow}>
                                        <Ionicons
                                            name="person-outline"
                                            size={21}
                                            color="#2563E8"
                                        />

                                        <Text style={styles.profileValue}>
                                            {fullName || "Name not provided"}
                                        </Text>
                                    </View>
                                </View>

                                {/* EMAIL */}

                                <View style={styles.profileInfoBox}>
                                    <Text style={styles.profileLabel}>
                                        Email Address
                                    </Text>

                                    <View style={styles.profileValueRow}>
                                        <Ionicons
                                            name="mail-outline"
                                            size={21}
                                            color="#2563E8"
                                        />

                                        <Text style={styles.profileValue}>
                                            {email || "Email not available"}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.profileNote}>
                                    These details are taken from your
                                    signed-in SafeTap account.
                                </Text>
                            </>
                        )}

                        <TouchableOpacity
                            style={styles.profileCloseButton}
                            onPress={() => setShowProfile(false)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.profileCloseText}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* BOTTOM NAVIGATION */}

            <BottomNavigation activeTab="Settings" />
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
        shadowOffset: { width: 0, height: 5 },
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
        shadowOffset: { width: 0, height: 5 },
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
        shadowOffset: { width: 0, height: 5 },
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
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },

    toggleCircleOff: {
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
    },

    profileModal: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 28,
        padding: 25,
        shadowColor: "#000000",
        shadowOpacity: 0.2,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 7 },
        elevation: 10,
    },

    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    profileIcon: {
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: "#E5EFFF",
        alignItems: "center",
        justifyContent: "center",
    },

    closeButton: {
        width: 45,
        height: 45,
        borderRadius: 14,
        backgroundColor: "#F3F6FB",
        alignItems: "center",
        justifyContent: "center",
    },

    profileTitle: {
        fontSize: 30,
        fontWeight: "800",
        color: "#173B8F",
        marginTop: 18,
    },

    profileSubtitle: {
        fontSize: 15,
        color: "#60729E",
        marginTop: 5,
        marginBottom: 20,
    },

    profileInfoBox: {
        backgroundColor: "#F5F8FF",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 15,
        marginBottom: 12,
    },

    profileLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: "#60729E",
        marginBottom: 8,
    },

    profileValueRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    profileValue: {
        flex: 1,
        flexWrap: "wrap",
        fontSize: 16,
        fontWeight: "700",
        color: "#173B8F",
    },

    profileNote: {
        fontSize: 13,
        lineHeight: 19,
        color: "#60729E",
        marginTop: 3,
        marginBottom: 12,
    },

    loadingContainer: {
        alignItems: "center",
        paddingVertical: 30,
    },

    loadingText: {
        fontSize: 14,
        color: "#60729E",
        marginTop: 12,
    },

    profileCloseButton: {
        height: 55,
        borderRadius: 17,
        backgroundColor: "#2563E8",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },

    profileCloseText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "800",
    },
});

