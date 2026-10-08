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
import { supabase } from "../../lib/supabase";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    /*
     * RESET SIGN IN PAGE
     *
     * Runs whenever this page becomes visible.
     * Clears the input fields, hides the password,
     * and returns the page to the top.
     */
    useFocusEffect(
        useCallback(() => {
            // Clear the input fields
            setEmail("");
            setPassword("");
            setShowPassword(false);

            // Scroll back to the top
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
     * Checks that the required fields have been completed.
     * The original hardcoded test account is still available.
     * Other accounts are checked using Supabase Authentication.
     */
    const handleSignIn = async () => {
        // Check if both fields are empty
        if (!email.trim() && !password.trim()) {
            alert("Please fill in your email and password.");
            return;
        }

        // Check if email is empty
        if (!email.trim()) {
            alert("Please fill in your email.");
            return;
        }

        // Check if password is empty
        if (!password.trim()) {
            alert("Please fill in your password.");
            return;
        }

        // Keep the original hardcoded test account
        if (
            email.trim() === "test@safetap.com" &&
            password === "123456"
        ) {
            router.push("/(tabs)/Home");
            return;
        }

        // Try signing in using Supabase Authentication
        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

        // Supabase sign-in failed
        if (error) {
            alert("Incorrect email or password.");
            return;
        }

        // Supabase sign-in successful
        router.push("/(tabs)/Home");
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

                {/* APP LOGO */}

                <Text style={styles.logo}>
                    SafeTap
                </Text>

                {/* PAGE HEADING */}

                <Text style={styles.heading}>
                    Welcome Back
                </Text>

                <Text style={styles.subHeading}>
                    Sign in to access your{"\n"}
                    safety check-ins and alerts.
                </Text>

                {/* EMAIL INPUT */}

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

                {/* PASSWORD INPUT */}

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

                {/* SIGN UP LINK */}

                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpPrompt}>
                        Don't have an account?
                    </Text>

                    <TouchableOpacity
                        onPress={() => router.push("/Log_in")}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.signUpLink}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* SHIELD IMAGE */}

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

    /* MAIN SCREEN */

    container: {
        flex: 1,
        backgroundColor: "#F5F7FB",
        paddingHorizontal: 28,
    },

    scrollContainer: {
        paddingBottom: 40,
    },

    /* BACK BUTTON */

    backButton: {
        marginTop: 20,
        marginBottom: 20,
    },

    /* APP LOGO */

    logo: {
        fontSize: 56,
        fontWeight: "800",
        color: "#1E4FD8",
        textAlign: "center",
        marginTop: 10,
    },

    /* PAGE HEADING */

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

    /* INPUT FIELDS */

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

    /* SIGN IN BUTTON */

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

    /* SIGN UP LINK */

    signUpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
    },

    signUpPrompt: {
        fontSize: 16,
        color: "#5C6E9E",
    },

    signUpLink: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1764E8",
        marginLeft: 5,
    },

    /* SHIELD IMAGE */

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