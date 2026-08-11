import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function CheckIn() {
    return (
        <SafeAreaView style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >


                <View style={styles.header}>

                    <View>
                        <Text style={styles.title}>
                            Check In
                        </Text>

                        <Text style={styles.subtitle}>
                            Start a check in and stay safe
                        </Text>
                    </View>

                    <View style={styles.shieldContainer}>
                        <Ionicons
                            name="shield-checkmark"
                            size={48}
                            color="#2563E8"
                        />
                    </View>

                </View>


                <View style={styles.howItWorksCard}>

                    <Text style={styles.sectionTitle}>
                        How It Works
                    </Text>


                    <View style={styles.stepRow}>

                        <View style={styles.stepIconBlue}>
                            <MaterialIcons
                                name="event"
                                size={45}
                                color="#2563E8"
                            />
                        </View>

                        <View style={styles.stepTextContainer}>

                            <Text style={styles.stepTitle}>
                                1. Set your time
                            </Text>

                            <Text styel={styles.stepDescription}>
                                Choose how long your
                                {"\n"}
                                check in should last.
                            </Text>

                        </View>

                    </View>


                    <View style={styles.stepRow}>

                        <View style={styles.stepIconGreen}>
                            <Ionicons
                                name="notifications"
                                size={45}
                                color="#08B88A"
                            />
                        </View>

                        <View style={styles.stepTextContainer}>

                            <Text style={styles.stepTitle}>
                                2.We'll remind you
                            </Text>

                            <Text style={styles.stepDescription}>
                                We'll send you a reminder
                                {"\n"}
                                when it's time to check in.
                            </Text>

                        </View>

                    </View>


                    <View style={styles.stepRow}>

                        <View style={styles.stepIconPurple}>
                            <Ionicons
                                name="people"
                                size={45}
                                color="#8B4DFF"
                            />
                        </View>

                        <View style={styles.stepTextContainer}>

                            <Text style={styles.stepTotle}>
                                3. Stay Safe
                            </Text>

                            <Text style={styles.stepDescription}>
                                If you don't check in, we'll 
                                {"\n"}
                                alert your trusted contacts.
                            </Text>

                        </View>

                    </View>


                    <View style={styles.startCrad}>

                        <Text style={styles.startTitle}>
                            Start a new check in
                        </Text>


                        <View style={styles.divider} />


                        <TouchableOpacity style={styles.optionRow}>

                            <Text style={styles.optionLabel}>
                                Duration
                            </Text>

                            <View style={styles.optionRight}>

                                <Text style={styles.optionValue}>
                                    30 min
                                </Text>

                                <Ionicons
                                    name="chevron-forward"
                                    size={28}
                                    color="#526487"
                                />

                            </View>

                        </TouchableOpacity>


                        <View style={styles.divider} />


                        <TouchableOpacity style={styles.optionRow}>

                            <Text style={styles.optionLabel}>
                                When
                            </Text>

                            <View style={styles.optionRight}>

                                <Text style={styles.optionValue}>
                                    Today, 8:00PM
                                </Text>

                                <Ionicons
                                    name="chevron-forward"
                                    size={28}
                                    color="#526487"
                                />
                                
                            </View>

                        </TouchableOpacity>


                        <View style={styles.divider} />



                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={() =>
                                router.push("/(tabs)/Actual_Check_In")
                            }
                        >

                            <Ionicons
                                name="shield-checkmark-outline"
                                size={30}
                                color="#FFFFFF"
                            />

                            <Text style={styles.startButtonText}>
                                Start Check In
                            </Text>

                        </TouchableOpacity>

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
                                router.push ("/(tabs)/Check-In")
                            }
                        >

                            <View style={styles.activeLine} />

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


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F5F8FF",
    },

    scrollContainer: {
        paddingHorizontal: 22,
        paddingTop: 20,
        paddingBottom: 25,
    },


    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
    },

    title: {
        fontSize: 43,
        fontWeight: "800",
        color: "#173B8F",
    },

    subtitle: {
        fontsize: 17,
        lineHeight: 25,
        color: "#60729E",
        marginTop: 8
    },

    shieldContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "7EA7EF",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },


    howItWorksCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        paddingHorizontal: 25,
        paddingTop: 30,
        paddingBottom: 20,
        marginBottom: 25,

        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    stepRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 27,
    },

    stepIconBlue: {
        width: 105,
        height: 105,
        borderRadius: 53,
        backgroundColor: "#E7F0FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 25,
    },

    stepIconGreen: {
        width: 105,
        height: 105,
        borderRadius: 53,
        backgroundColor: "#E2FAEF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 25,
    },

    stepIconPurple: {
        width: 105,
        height: 105,
        borderRadius: 53,
        backgroundColor: "#F0E5FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 25,
    },

    stepTextContainer: {
        flex: 1,
    },

    stepTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 8,
    },

    stepDescription: {
        fontSize: 16,
        lineHeight: 26,
        color: "#60729E",
    },



    startCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        paddingHorizontal: 25,
        paddingTop: 30,
        paddingBottom: 25,
        marginBottom: 25,

        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5
        },

        elevation: 5,
    },

    startTitle: {
        fontSize: 25,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 20,
    },

    divider: {
        height: 1,
        backgroundColor: "#DDE5F2"
    },

    optionRow: {
        height: 82,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    optionLabel: {
        fontSize: 19,
        color: "#526487",
    },

    optionRight: {
        flexDirection: "row",
        alignItems: "center",
    },
})