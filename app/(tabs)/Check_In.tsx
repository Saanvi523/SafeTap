import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";

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

                            <Text
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}