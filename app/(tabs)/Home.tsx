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
                                name="checron-forward"
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

                    <View style={style.safetyicon}>
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

    scrollContainer: {}

})