import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type HistoryItem = {
    id: string;
    date: string;
    time: string;
    duration: string;
    message: string;
};

const HISTORY_KEY = "@safetap_history";

export default function History() {

    const [history, setHistory] = useState<HistoryItem[]>([]);

    const loadHistory = async () => {
        try {
            const savedHistory =
                await AsyncStorage.getItem(HISTORY_KEY);

            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            } else {
                setHistory([]);
            }

        } catch (error) {
            console.log("Error loading history:", error);
        }
    };

    /*
     * Reload the history whenever the History
     * page becomes visible.
     */
    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

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
                            Your previous safety check-ins
                        </Text>

                    </View>

                    <View style={styles.headerIcon}>

                        <MaterialIcons
                            name="history"
                            size={40}
                            color="#F59E0B"
                        />

                    </View>

                </View>


                {/* NO HISTORY */}

                {history.length === 0 ? (

                    <View style={styles.emptyCard}>

                        <View style={styles.emptyIcon}>

                            <MaterialIcons
                                name="history"
                                size={55}
                                color="#F59E0B"
                            />

                        </View>

                        <Text style={styles.emptyTitle}>
                            No Check-Ins Yet
                        </Text>

                        <Text style={styles.emptyText}>
                            Your completed safety check-ins
                            {"\n"}
                            will appear here.
                        </Text>

                    </View>

                ) : (

                    /* HISTORY LIST */

                    <View style={styles.historyCard}>

                        <Text style={styles.sectionTitle}>
                            Check-In History
                        </Text>

                        {history.map((item) => (

                            <View
                                key={item.id}
                                style={styles.historyItem}
                            >

                                <View style={styles.successIcon}>

                                    <Ionicons
                                        name="shield-checkmark"
                                        size={28}
                                        color="#08A96D"
                                    />

                                </View>

                                <View style={styles.historyInfo}>

                                    <Text style={styles.historyTitle}>
                                        Check-In Successful
                                    </Text>

                                    <Text style={styles.message}>
                                        {item.message}
                                    </Text>

                                    <Text style={styles.dateTime}>
                                        {item.date} • {item.time}
                                    </Text>

                                    <Text style={styles.duration}>
                                        Duration: {item.duration}
                                    </Text>

                                </View>

                            </View>

                        ))}

                    </View>

                )}

            </ScrollView>


            {/* BOTTOM NAVIGATION */}

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

                    <View style={styles.activeLine} />

                    <MaterialIcons
                        name="history"
                        size={34}
                        color="#F59E0B"
                    />

                    <Text
                        style={[
                            styles.navText,
                            styles.activeText,
                        ]}
                    >
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

                    <Ionicons
                        name="settings"
                        size={32}
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
        marginBottom: 30,
    },

    title: {
        fontSize: 43,
        fontWeight: "800",
        color: "#173B8F",
    },

    subtitle: {
        fontSize: 17,
        color: "#60729E",
        marginTop: 8,
    },

    headerIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#7898D8",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    emptyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        paddingVertical: 55,
        paddingHorizontal: 25,
        alignItems: "center",

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
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#FFF5DD",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },

    emptyTitle: {
        fontSize: 25,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 10,
    },

    emptyText: {
        fontSize: 16,
        lineHeight: 25,
        color: "#60729E",
        textAlign: "center",
    },

    historyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 10,

        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    sectionTitle: {
        fontSize: 25,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 20,
    },

    historyItem: {
        flexDirection: "row",
        paddingVertical: 18,
        borderTopWidth: 1,
        borderTopColor: "#E3EAF5",
    },

    successIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#E8FFF4",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },

    historyInfo: {
        flex: 1,
    },

    historyTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 5,
    },

    message: {
        fontSize: 14,
        color: "#526487",
        lineHeight: 20,
        marginBottom: 6,
    },

    dateTime: {
        fontSize: 14,
        fontWeight: "700",
        color: "#2563E8",
        marginBottom: 4,
    },

    duration: {
        fontSize: 13,
        color: "#7182A5",
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

    activeText: {
        color: "#F59E0B",
        fontWeight: "800",
    },

    activeLine: {
        position: "absolute",
        top: 0,
        width: 55,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#F59E0B",
    },

});