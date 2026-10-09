
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    Alert,
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
    const [loading, setLoading] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    // Reset the sign-in page whenever it becomes visible.
    useFocusEffect(
        useCallback(() => {
            setEmail("");
            setPassword("");
            setShowPassword(false);

            const timeout = setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    y: 0,
                    animated: false,
                });
            }, 100);

            return () => clearTimeout(timeout);
        }, [])
    );

    // Sign in using the test account or Supabase.
    const handleSignIn = async () => {
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail && !password) {
            Alert.alert(
                "Missing Information",
                "Please fill in your email and password."
            );
            return;
        }

        if (!cleanEmail) {
            Alert.alert("Missing Email", "Please fill in your email.");
            return;
        }

        if (!password) {
            Alert.alert(
                "Missing Password",
                "Please fill in your password."
            );
            return;
        }

        // Keep the original hardcoded test account.
        if (
            cleanEmail === "test@safetap.com" &&
            password === "123456"
        ) {
            router.replace("/(tabs)/Home" as any);
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password,
            });

            if (error) {
                Alert.alert(
                    "Sign In Failed",
                    "Incorrect email or password. Please try again."
                );
                return;
            }

            router.replace("/(tabs)/Home" as any);
        } catch {
            Alert.alert(
                "Connection Error",
                "Unable to sign in. Please check your connection and try again."
            );
        } finally {
            setLoading(false);
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
                {/* Back button */}
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

                {/* App logo */}
                <Text style={styles.logo}>SafeTap</Text>

                {/* Page heading */}
                <Text style={styles.heading}>Welcome Back</Text>

                <Text style={styles.subHeading}>
                    Sign in to access your{"\n"}
                    safety check-ins and alerts.
                </Text>

                {/* Email input */}
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

                {/* Password input */}
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

                    {/* Show or hide password */}
                    <TouchableOpacity
                        onPress={() =>
                            setShowPassword((previous) => !previous)
                        }
                        activeOpacity={0.7}
                        accessibilityLabel={
                            showPassword ? "Hide password" : "Show password"
                        }
                    >
                        <Ionicons
                            name={showPassword ? "eye-off" : "eye"}
                            size={24}
                            color="#7A84A7"
                        />
                    </TouchableOpacity>
                </View>

                {/* Sign in button */}
                <TouchableOpacity
                    style={[
                        styles.signInButton,
                        loading && styles.disabledButton,
                    ]}
                    onPress={handleSignIn}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    <Text style={styles.signInText}>
                        {loading ? "SIGNING IN..." : "SIGN IN"}
                    </Text>
                </TouchableOpacity>

                {/* Sign up link */}
                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpPrompt}>
                        Don't have an account?
                    </Text>

                    <TouchableOpacity
                        onPress={() =>
                            router.push("/(tabs)/Sign_up" as any)
                        }
                        activeOpacity={0.7}
                    >
                        <Text style={styles.signUpLink}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Shield image */}
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

    signInButton: {
        height: 60,
        backgroundColor: "#1764E8",
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
    },

    disabledButton: {
        opacity: 0.6,
    },

    signInText: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "800",
        letterSpacing: 1,
    },

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