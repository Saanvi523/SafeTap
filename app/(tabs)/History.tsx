import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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

import { getHistory, HistoryItem } from "../historyStore";

export default function History() {

    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {

        const loadHistory = () => {
            setHistory([...getHistory()]);
        };

        loadHistory();

        const interval = setInterval(loadHistory, 500);

        return () => clearInterval(interval);

    }, []);


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
                            History
                        </Text>

                        <Text style={styles.subtitle}>
                            View your past check-ins
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


                {/* SUMMARY */}

                <View style={styles.summaryCard}>

                    <View style={styles.summaryIcon}>

                        <MaterialIcons
                            name="history"
                            size={38}
                            color="#F59E0B"
                        />

                    </View>

                    <View style={styles.summaryTextContainer}>

                        <Text style={styles.summaryTitle}>
                            Check-In History
                        </Text>

                        <Text style={styles.summaryDescription}>
                            Your completed and missed check-ins are
                            recorded here.
                        </Text>

                    </View>

                </View>


                <Text style={styles.sectionTitle}>
                    Recent Activity
                </Text>


                {history.length === 0 ? (

                    <View style={styles.emptyCard}>

                        <View style={styles.emptyIcon}>

                            <MaterialIcons
                                name="history"
                                size={45}
                                color="#60729E"
                            />

                        </View>

                        <Text style={styles.emptyTitle}>
                            No Check-In History
                        </Text>

                        <Text style={styles.emptyText}>
                            Your check-ins will appear here after you
                            complete or miss one.
                        </Text>

                    </View>

                ) : (

                    history.map((item) => (

                        <View
                            key={item.id}
                            style={styles.historyCard}
                        >

                            <View
                                style={[
                                    styles.statusIcon,
                                    item.status === "Successful"
                                        ? styles.successIcon
                                        : styles.missedIcon,
                                ]}
                            >

                                <Ionicons
                                    name={
                                        item.status === "Successful"
                                            ? "checkmark"
                                            : "close"
                                    }
                                    size={28}
                                    color={
                                        item.status === "Successful"
                                            ? "#08B88A"
                                            : "#E53935"
                                    }
                                />

                            </View>


                            <View style={styles.historyTextContainer}>

                                <Text
                                    style={[
                                        styles.statusTitle,
                                        item.status === "Successful"
                                            ? styles.successText
                                            : styles.missedText,
                                    ]}
                                >
                                    {item.status} Check-In
                                </Text>

                                <Text style={styles.historyDate}>
                                    {item.date}
                                </Text>

                                <Text style={styles.historyDetails}>
                                    {item.time} • {item.duration}
                                </Text>

                                <Text style={styles.message}>
                                    {item.message}
                                </Text>

                            </View>

                        </View>

                    ))

                )}


                {/* BOTTOM NAVIGATION */}

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
                        style={[
                            styles.navItem,
                            styles.activeNavItem,
                        ]}
                        onPress={() =>
                            router.push("/(tabs)/History")
                        }
                    >

                        <View style={styles.activeLine} />

                        <MaterialIcons
                            name="history"
                            size={35}
                            color="#F59E0B"
                        />

                        <Text style={styles.activeHistoryText}>
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
        paddingBottom: 30,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
    },

    title: {
        fontSize: 45,
        fontWeight: "800",
        color: "#173B8F",
    },

    subtitle: {
        fontSize: 18,
        color: "#60729E",
        marginTop: 5,
    },

    shieldContainer: {
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

    summaryCard: {
        minHeight: 125,
        backgroundColor: "#FFFFFF",
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 22,
        marginBottom: 32,

        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    summaryIcon: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: "#FFF1D1",
        justifyContent: "center",
        alignItems: "center",
    },

    summaryTextContainer: {
        flex: 1,
        marginLeft: 18,
    },

    summaryTitle: {
        fontSize: 21,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 5,
    },

    summaryDescription: {
        fontSize: 15,
        lineHeight: 22,
        color: "#60729E",
    },

    sectionTitle: {
        fontSize: 27,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 14,
    },

    historyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 16,

        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    statusIcon: {
        width: 58,
        height: 58,
        borderRadius: 29,
        justifyContent: "center",
        alignItems: "center",
    },

    successIcon: {
        backgroundColor: "#E2FAEF",
    },

    missedIcon: {
        backgroundColor: "#FFE4E8",
    },

    historyTextContainer: {
        flex: 1,
        marginLeft: 18,
    },

    statusTitle: {
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 5,
    },

    successText: {
        color: "#08A77E",
    },

    missedText: {
        color: "#D62828",
    },

    historyDate: {
        fontSize: 16,
        fontWeight: "600",
        color: "#344A78",
        marginBottom: 3,
    },

    historyDetails: {
        fontSize: 14,
        color: "#60729E",
        marginBottom: 8,
    },

    message: {
        fontSize: 13,
        lineHeight: 19,
        color: "#526487",
    },

    emptyCard: {
        minHeight: 190,
        backgroundColor: "#FFFFFF",
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 25,
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

    emptyIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#E9EEF8",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 6,
    },

    emptyText: {
        fontSize: 15,
        color: "#60729E",
        textAlign: "center",
    },

    bottomNav: {
        height: 94,
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: 20,

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

    activeNavItem: {
        position: "relative",
    },

    activeLine: {
        position: "absolute",
        top: 0,
        width: 55,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#F59E0B",
    },

    activeHistoryText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#F59E0B",
        marginTop: 5,
    },

});