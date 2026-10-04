import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, {
    useCallback,
    useRef,
    useState,
} from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import BottomNavigation from "../../components/Bottom_Navigation";


// HISTORY ITEM DATA STRUCTURE

type HistoryItem = {
    id: string;
    date: string;
    time: string;
    duration: string;
    reminderEnabled?: boolean;
    reminderTime?: string;
    message: string;
};


// KEY USED TO SAVE AND LOAD HISTORY

const HISTORY_KEY = "@safetap_history";


export default function History() {

    // STORES ALL PREVIOUS CHECK-IN HISTORY ITEMS

    const [history, setHistory] =
        useState<HistoryItem[]>([]);


    // REFERENCE TO THE SCROLLVIEW

    const scrollViewRef =
        useRef<ScrollView>(null);


    /*
     * LOAD HISTORY FROM ASYNC STORAGE
     */

    const loadHistory = async () => {

        try {

            // GET SAVED HISTORY

            const savedHistory =
                await AsyncStorage.getItem(
                    HISTORY_KEY
                );


            // CHECK WHETHER HISTORY EXISTS

            if (savedHistory) {

                const parsedHistory =
                    JSON.parse(savedHistory);


                // MAKE SURE SAVED DATA IS AN ARRAY

                if (Array.isArray(parsedHistory)) {

                    setHistory(parsedHistory);

                } else {

                    setHistory([]);

                }

            } else {

                setHistory([]);

            }

        } catch (error) {

            console.log(
                "Error loading history:",
                error
            );

            setHistory([]);

        }

    };


    /*
     * RELOAD HISTORY WHEN PAGE BECOMES VISIBLE
     */

    useFocusEffect(
        useCallback(() => {

            // LOAD MOST RECENT HISTORY

            loadHistory();


            // RETURN TO THE TOP OF THE PAGE

            const timeout =
                setTimeout(() => {

                    scrollViewRef.current?.scrollTo({
                        y: 0,
                        animated: false,
                    });

                }, 100);


            // CLEAR TIMER WHEN PAGE IS LEFT

            return () => {

                clearTimeout(timeout);

            };

        }, [])
    );


    return (

        <SafeAreaView style={styles.container}>

            {/* MAIN CONTENT */}

            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.scrollContainer
                }
            >

                {/* HEADER */}

                <View style={styles.header}>

                    <View
                        style={
                            styles.headerTextContainer
                        }
                    >

                        <Text style={styles.title}>
                            History
                        </Text>

                        <Text style={styles.subtitle}>
                            Your previous safety check-ins
                        </Text>

                    </View>


                    {/* HISTORY ICON */}

                    <View style={styles.headerIcon}>

                        <MaterialIcons
                            name="history"
                            size={40}
                            color="#F59E0B"
                        />

                    </View>

                </View>


                {/* EMPTY STATE */}

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

                        <Text
                            style={styles.sectionTitle}
                        >
                            Check-In History
                        </Text>


                        {/* DISPLAY EACH SAVED CHECK-IN */}

                        {history.map((item) => (

                            <View
                                key={item.id}
                                style={styles.historyItem}
                            >

                                {/* SUCCESS ICON */}

                                <View
                                    style={
                                        styles.successIcon
                                    }
                                >

                                    <Ionicons
                                        name="shield-checkmark"
                                        size={28}
                                        color="#08A96D"
                                    />

                                </View>


                                {/* CHECK-IN INFORMATION */}

                                <View
                                    style={
                                        styles.historyInfo
                                    }
                                >

                                    <Text
                                        style={
                                            styles.historyTitle
                                        }
                                    >
                                        Check-In Successful
                                    </Text>


                                    {/* MESSAGE */}

                                    <Text
                                        style={
                                            styles.message
                                        }
                                    >
                                        {item.message}
                                    </Text>


                                    {/* DATE AND TIME */}

                                    <Text
                                        style={
                                            styles.dateTime
                                        }
                                    >
                                        {item.date} •{" "}
                                        {item.time}
                                    </Text>


                                    {/* DURATION */}

                                    <Text
                                        style={
                                            styles.duration
                                        }
                                    >
                                        Duration:{" "}
                                        {item.duration}
                                    </Text>


                                    {/* REMINDER */}

                                    {item.reminderEnabled ? (

                                        <View
                                            style={
                                                styles.reminderRow
                                            }
                                        >

                                            <Ionicons
                                                name="notifications"
                                                size={16}
                                                color="#08A96D"
                                            />

                                            <Text
                                                style={
                                                    styles.reminder
                                                }
                                            >
                                                Reminder: On •{" "}
                                                {item.reminderTime ||
                                                    "5 minutes before"}
                                            </Text>

                                        </View>

                                    ) : (

                                        <View
                                            style={
                                                styles.reminderRow
                                            }
                                        >

                                            <Ionicons
                                                name="notifications-off"
                                                size={16}
                                                color="#7182A5"
                                            />

                                            <Text
                                                style={
                                                    styles.reminderOff
                                                }
                                            >
                                                Reminder: Off
                                            </Text>

                                        </View>

                                    )}

                                </View>

                            </View>

                        ))}

                    </View>

                )}

            </ScrollView>


            {/* REUSABLE BOTTOM NAVIGATION */}

            <BottomNavigation
                activeTab="History"
            />

        </SafeAreaView>

    );
}


// STYLES

const styles = StyleSheet.create({

    /* MAIN SCREEN */

    container: {
        flex: 1,
        backgroundColor: "#F5F8FF",
    },


    // SCROLLABLE CONTENT

    scrollContainer: {
        paddingHorizontal: 22,
        paddingTop: 20,
        paddingBottom: 130,
    },


    /* HEADER */

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
    },


    headerTextContainer: {
        flex: 1,
        paddingRight: 15,
    },


    title: {
        fontSize: 43,
        fontWeight: "800",
        color: "#173B8F",
    },


    subtitle: {
        fontSize: 17,
        lineHeight: 24,
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


    /* EMPTY HISTORY */

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


    /* HISTORY CARD */

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


    /* HISTORY ITEM */

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


    // REMINDER INFORMATION

    reminderRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },


    reminder: {
        fontSize: 13,
        fontWeight: "700",
        color: "#08A96D",
        marginLeft: 5,
    },


    reminderOff: {
        fontSize: 13,
        fontWeight: "600",
        color: "#7182A5",
        marginLeft: 5,
    },

});