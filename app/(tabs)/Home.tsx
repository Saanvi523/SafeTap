import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";

export default function Home() {
    return (
        <SafeAreaView style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >


                <View style={styles.header}>

                    <View>
                        <Text style={styles.title}>
                            Home
                        </Text>

                        <Text style={styles.subtitle}>
                            Access all SafeTap features
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


                <View style={styles.cardGrid}>

                    <TouchableOpacity 
                        style={[
                            styles.featureCard,
                            styles.checkInCard,
                        ]}
                        onPress={() =>
                            router.push("/(tabs)/Check_In")
                        }
                    >

                        <View style={styles.iconCircleBlue}>
                            <Ionicons
                                name="shield-checkmark"
                                size={52}
                                color="#2563E8"
                            />
                        </View>

                        <Text style={styles.cardTitle}>
                            Check In
                        </Text>

                        <Text style={styles.cardDescription}>
                            Start a new check in 
                            {"\n"}
                            and stay safe.
                        </Text>

                        <View style={styles.arrowBlue}>
                            <Ionicons
                                name="chevron-forward"
                                size={30}
                                color="#2563E8"
                            />
                        </View>

                    </TouchableOpacity>


                    <TouchableOpacity
                        style={[
                            styles.featureCard,
                            styles.contactsCard,
                        ]}
                        onPress={() =>
                            router.push("/(tabs)/Contacts")
                        }
                    >

                        <View style={styles.iconCircleGreen}>
                            <Ionicons
                                name="people"
                                size={52}
                                color="#08B88A"
                            />
                        </View>

                        <Text style={styles.cardTitle}>
                            Contacts
                        </Text>

                        <Text style={styles.cardDescription}>
                            Manage your trusted
                            {"\n"}
                            contacts.
                        </Text>

                        <View style={styles.arrowGreen}>
                            <Ionicons
                                name="chevron-forward"
                                size={30}
                                color="#08B88A"
                            />
                        </View>

                    </TouchableOpacity>


                    <TouchableOpacity
                        style={[
                            styles.featureCard,
                            styles.historyCard,
                        ]}
                        onPress={() =>
                            router.push("/(tabs)/History")
                        }
                    >

                        <View style={styles.iconCircleOrange}>
                            <MaterialIcons
                                name="history"
                                size={55}
                                color="#F59E0B"
                            />
                        </View>

                        <Text style={styles.cardTitle}>
                            History 
                        </Text>

                        <Text style={styles.cardDescription}>
                            View your past
                            {"\n"}
                            check in records.
                        </Text>

                        <View style={styles.arrowOrange}>
                            <Ionicons
                                name="chevron-forward"
                                size={30}
                                color="#F59E0B"
                            />
                        </View>

                    </TouchableOpacity>


                    <TouchableOpacity
                        style={[
                            styles.featureCard,
                            styles.settingsCard,
                        ]}
                        onPress={() =>
                            router.push("/(tabs)/Settings")
                        }
                    >

                        <View style={styles.iconCirclePurple}>
                            <Ionicons
                                name="settings"
                                size={54}
                                color="#7C3AED"
                            />
                        </View>

                        <Text style={styles.cardTitle}>
                            Settings 
                        </Text>

                        <Text style={styles.cardDescription}>
                            Manage your
                            {"\n"}
                            preferences.
                        </Text>

                        <View style={styles.arrowPurple}>
                            <Ionicons
                                name="chevron-forward"
                                size={30}
                                color="#7C3AED"
                            />
                        </View>

                    </TouchableOpacity>

                </View>


                <View style={styles.safetyBanner}>

                    <View style={styles.safetyicon}>
                        <Ionicons
                            name="lock-closed"
                            size={42}
                            color="FFFFFF"
                        />
                    </View>

                    <View style={styles.safetyTextContainer}>

                        <Text style={styles.safetyTitle}>
                            You're in control
                        </Text>

                        <Text style={styles.safetyText}>
                            SafeTap is here to keep you safe and
                            {"\n"}
                            connected with the people who matter.
                        </Text>

                    </View>

                </View>


                <View style={styles.bottomNav}>

                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() =>
                            router.push("/(tabs)/Home")
                        }
                    >

                        <View style={styles.activeLine} />

                        <Ionicons
                            name="home"
                            size={35}
                            color="#2563E8"
                        />

                        <Text
                            style={[
                                styles.navText,
                                styles.activeHomeText,
                            ]}
                        >
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
                            name="shield-outline"
                            size={34}
                            color="#173B8F"
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
        paddingTop: 20,
        paddingBottom: 25,
    },


    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
        marginBottom: 30,
    },

    title: {
        fontSize: 45,
        fontWeight: "800",
        color: "#173B8F",
    },

    subtitle: {
        width: 68,
        height: 68,
        borderRadius: 34,
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


    cardGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    featureCard: {
        width: "48%",
        height: 265,
        borderRadius: 25,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        paddingTop: 25,
        marginBottom: 18,

        shadowColor:"#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,

        overflow: "hidden",
    },



    checkInCard: {
        borderBottomWidth: 5,
        borderBottomColor: "#8DBAFF",
    },

    contactsCard: {
        borderBottomWidth: 5,
        borderBottomColor: "8DE8BF"
    },

    historyCard: {
        borderBottomWidth: 5,
        borderBottomColor: "#FFD16A",
    },

    settingsCard: {
        borderBottomWidth: 5,
        borderBottomColor: "#C89AFF",
    },



    iconCircleBlue: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#E5EFFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,
    },

    iconCircleGreen: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#E2FAEF",
        justifyContent: "center",
        marginBottom: 18,
    },

    iconCircleOrange: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#FFF1D1",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,
    },

    iconCirclePurple: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#F0E5FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,
    },

    cardTitle: {
        fontSize: 23,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 9,
    },

    cardDescription: {
        fontSize: 16,
        lineHeight: 24,
        color: "#60729E"
        textAlign: "center",
    },

    arrowBlue: {
        position: "absolute",
        right: 14,
        bottom: 14,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#E5EFFF",
        justifyContent: "center",
        alignItems: "center",
    },

    arrowGreen: {
        position: "absolute",
        right: 14,
        bottom: 14,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#E2FAEF",
        justifyContent: "center",
        alignItems: "center",
    },

    arrowOrange: {
        position: "absolute",
        right: 14,
        bottom: 14,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#FFF1D1",
        justifyContent: "center",
        alignItems: "center",
    },

    arrowPurple: {
        position: "absolute",
        right: 14,
        bottom: 14,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F0E5FF",
        justifyContent: "center",
        alignItems: "center",
    },



    safetyBanner: {
        minHeight: 160,
        borderRadius: 26,
        backgroundColor: "#79A5F5",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 5,
        marginBottom: 25,

        shadowColor: "#7199E8",
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    safetyIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#2563E8",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },

    safetyTextContainer: {
        flex: 1,
    },

    safetyTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#FFFFFF",
        marginBottom: 8,
    },

    safetyText: {
        fontSize: 15,
        lineHeight: 23,
        color: "#FFFFFF",
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
        height: "100%"
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    navText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#526487"
        marginTop: 5,
    },

    activeHomeText: {
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