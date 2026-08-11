import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";

export default function Settings() {

    const [reminderAlerts, setReminderAlerts] = useState(true);

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >


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


                <Text style={styles.sectionTitle}>
                    Account
                </Text>

                <TouchableOpacity
                    style={styles.singleCard}
                    onPress={() => {
                        //Profile page can be added later
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
                                StyleSheet.toggle,
                                reminderAlerts
                                    ? styles.toggleOn
                                    : styles.toggleOff,
                            ]}
                            onPress={() =>
                                setReminderAlerts(!reminderAlerts)
                            }
                        >

                            <View
                                style={[
                                    styles.toggleCircle,
                                    reminderAlerts
                                        ? styles.toggleCircleOn
                                        : styles.toggleCircleOff
                                ]}
                            />

                        </TouchableOpacity>

                    </View>

                </View>



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



                <Text style={styles.sectionTitle}>
                    Other
                </Text>

                <TouchableOpacity
                    style={styles.singleCard}
                    onPress={() => {
                        //Logout functionality can be added later
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



                <View style={styles.bottomNav}>


                    <TouchableOpacity
                        style={styles.navitem}
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

                        <Ionicons
                            name="shield-checkmark-outline"
                            size={34}
                            color="#526487"
                        />

                        <Text style={styles.navText}>
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
                        style={[
                            styles.navItem,
                            styles.activeNavItem,
                        ]}
                        onPress={() =>
                            router.push("/(tabs)/Settings")
                        }
                    >

                        <View style={styles.activeLine} />

                        <Ionicons
                            name="settings"
                            size={34}
                            color="#7C3AED"
                        />

                        <Text style={styles.activeSettingsText}>
                            Settings
                        </Text>

                    </TouchableOpacity>

                </View>

            </ScrollView>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({

    container: {
        flex:1,
        backgroundColor: "#F5F8FF"
    },

    scrollContainer: {
        paddingHorizontal: 22,
        paddingTop: 20,
        paddingBottom: 30,
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
        backgroundColor: "FFFFFF",
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
    }
})