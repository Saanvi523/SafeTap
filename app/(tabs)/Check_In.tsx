import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CheckIn() {
    const [duration, setDuration] = useState("30 min");
    const [showDurationPicker, setShowDurationPicker] = useState(false);
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

                            <Text style={styles.stepDescription}>
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

                            <Text style={styles.stepTitle}>
                                3. Stay Safe
                            </Text>

                            <Text style={styles.stepDescription}>
                                If you don't check in, we'll 
                                {"\n"}
                                alert your trusted contacts.
                            </Text>

                        </View>

                    </View>


                    <View style={styles.startCard}>

                        <Text style={styles.startTitle}>
                            Start a new check in
                        </Text>


                        <View style={styles.divider} />


                        <TouchableOpacity 
                            style={styles.optionRow}
                            onPress={() => setShowDurationPicker(true)}
                        >

                            <Text style={styles.optionLabel}>
                                Check-In Frequency
                            </Text>

                            <View style={styles.optionRight}>

                                <Text style={styles.optionValue}>
                                    {duration} 
                                </Text>

                                <Ionicons
                                    name="chevron-forward"
                                    size={28}
                                    color="#526487"
                                />

                            </View>

                        </TouchableOpacity>

                        {showDurationPicker && (
                            <View style={styles.durationPicker}>

                                <Text style={styles.pickerTitle}>
                                    Check-in Duration
                                </Text>

                                <View style={styles.durationOptions}>

                                    {["15 min", "30 min", "45 min", "60 min", "90 min", "120 min", "1 day", "2 days", "1 week"].map((time) => (
                                        <TouchableOpacity
                                            key={time}
                                            style={[
                                                styles.durationOption,
                                                duration === time && styles.selectedDuration,
                                            ]}
                                            onPress={() => {
                                                setDuration(time);
                                                setShowDurationPicker(false);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.durationOptionText,
                                                    duration === time &&
                                                        styles.selectedDurationText,
                                                ]}
                                            >
                                                {time} 
                                            </Text>
                                        </TouchableOpacity>
                                    ))}

                                </View>

                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setShowDurationPicker(false)}
                                >
                                    <Text style={styles.cancelButtonText}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        )}

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
                                router.push ("/(tabs)/Check_In")
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
        fontSize: 17,
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

        shadowColor: "#7EA7EF",
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

    optionValue: {
        fontSize: 19,
        fontWeight: "700",
        color: "#2563E8",
        marginRight: 10,
    },

    startButton: {
        height: 64,
        borderRadius: 20,
        backgroundColor: "#2563E8",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,

        shadowColor: "#2563E8",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    startButtonText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "800",
        marginLeft: 10,
    },

    bottomNav: {
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

    sectionTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#173B8F",
    marginBottom: 25,
    },

    durationPicker: {
    backgroundColor: "#F5F8FF",
    borderRadius: 18,
    padding: 18,
    marginVertical: 10,
    },

    pickerTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 15,
    },

    durationOptions: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    durationOption: {
        width: "31%",
        height: 48,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#DDE5F2",
    },

    selectedDuration: {
        backgroundColor: "#2563E8",
        borderColor: "#2563E8",
    },

    durationOptionText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#526487",
    },

    selectedDurationText: {
        color: "#FFFFFF",
    },

    cancelButton: {
        alignItems: "center",
        paddingVertical: 8,
    },

    cancelButtonText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#60729E",
    },

});