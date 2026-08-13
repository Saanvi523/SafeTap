import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    /*
     * Runs every time this page becomes visible.
     *
     * It:
     * - Clears the email box
     * - Clears the password box
     * - Hides the password
     * - Scrolls back to the very top
     */
    useFocusEffect(
        useCallback(() => {
            // Clear the input boxes
            setEmail("");
            setPassword("");
            setShowPassword(false);

            // Wait briefly for the page to finish rendering
            const timeout = setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    y: 0,
                    animated: false,
                });
            }, 100);

            return () => {
                clearTimeout(timeout);
            };
        }, [])
    );

    /*
     * SIGN IN
     *
     * Checks that both fields have been filled in
     * before checking the login details.
     */
    const handleSignIn = () => {
        // Both fields are empty
        if (!email.trim() && !password.trim()) {
            alert(
                "Please fill in your email and password."
            );
            return;
        }

        // Email is empty
        if (!email.trim()) {
            alert("Please fill in your email.");
            return;
        }

        // Password is empty
        if (!password.trim()) {
            alert("Please fill in your password.");
            return;
        }

        // Check login details
        if (
            email.trim() === "test@safetap.com" &&
            password === "123456"
        ) {
            router.push("/(tabs)/Home");
        } else {
            alert("Incorrect email or password.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            >
                {/* BACK BUTTON */}

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="arrow-back"
                        size={30}
                        color="#1E4FD8"
                    />
                </TouchableOpacity>

                {/* LOGO */}

                <Text style={styles.logo}>
                    SafeTap
                </Text>

                {/* HEADING */}

                <Text style={styles.heading}>
                    Welcome Back
                </Text>

                <Text style={styles.subHeading}>
                    Sign in to access your{"\n"}
                    safety check-ins and alerts.
                </Text>

                {/* EMAIL */}

                <View style={styles.inputContainer}>
                    <MaterialIcons
                        name="email"
                        size={22}
                        color="#1E4FD8"
                        style={styles.leftIcon}
                    />

                    <TextInput
                        placeholder="Email Address"
                        placeholderTextColor="#6C7AA9"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                    />
                </View>

                {/* PASSWORD */}

                <View style={styles.inputContainer}>
                    <MaterialIcons
                        name="lock"
                        size={22}
                        color="#1E4FD8"
                        style={styles.leftIcon}
                    />

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#6C7AA9"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                    />

                    {/* SHOW / HIDE PASSWORD */}

                    <TouchableOpacity
                        onPress={() =>
                            setShowPassword(
                                (previous) => !previous
                            )
                        }
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={
                                showPassword
                                    ? "eye-off"
                                    : "eye"
                            }
                            size={24}
                            color="#7A84A7"
                        />
                    </TouchableOpacity>
                </View>

                {/* FORGOT PASSWORD */}

                <TouchableOpacity
                    style={styles.forgotContainer}
                    activeOpacity={0.7}
                >
                    <Text style={styles.forgotText}>
                        Forgot Password?
                    </Text>
                </TouchableOpacity>

                {/* SIGN IN BUTTON */}

                <TouchableOpacity
                    style={styles.signInButton}
                    onPress={handleSignIn}
                    activeOpacity={0.8}
                >
                    <Text style={styles.signInText}>
                        SIGN IN
                    </Text>
                </TouchableOpacity>

                {/* SHIELD */}

                <View style={styles.shieldContainer}>
                    <Image
                        source={require("../../assets/images/Shield 2.0. .png")}
                        style={styles.shieldImage}
                        resizeMode="contain"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FB",
        paddingHorizontal: 28,
    },

    scrollContainer: {
        paddingBottom: 40,
    },

    backButton: {
        marginTop: 20,
        marginBottom: 20,
    },

    logo: {
        fontSize: 56,
        fontWeight: "800",
        color: "#1E4FD8",
        textAlign: "center",
        marginTop: 10,
    },

    heading: {
        marginTop: 55,
        textAlign: "center",
        fontSize: 28,
        fontWeight: "700",
        color: "#183C8E",
    },

    subHeading: {
        textAlign: "center",
        marginTop: 14,
        color: "#5C6E9E",
        fontSize: 18,
        lineHeight: 28,
        marginBottom: 35,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        height: 64,
        marginBottom: 18,
        paddingHorizontal: 18,

        shadowColor: "#2563E8",
        shadowOpacity: 0.08,
        shadowRadius: 10,

        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 5,
    },

    leftIcon: {
        marginRight: 15,
    },

    input: {
        flex: 1,
        fontSize: 17,
        color: "#1F2937",
    },

    forgotContainer: {
        alignItems: "flex-end",
        marginTop: -3,
        marginBottom: 25,
    },

    forgotText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1554D1",
    },

    signInButton: {
        height: 60,
        backgroundColor: "#1764E8",
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
    },

    signInText: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "800",
        letterSpacing: 1,
    },

    shieldContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
    },

    shieldImage: {
        width: 180,
        height: 180,
    },
});