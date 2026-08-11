import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";

export default function Home() {
    return (
        <SafeAreaView style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
            >


                <View style={styles.header}>

                    <View>
                        <Text style={styles.title}>
                            Settings
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


                <View style={styles.cardGrid}
            </ScrollView>
        </SafeAreaView>
    )
}