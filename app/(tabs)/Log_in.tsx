import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignIn() {
    const [password, setPassword] = useState ("");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView style={styles.container}>

            <TouchableOpacity style={styles.backButton}>
                <Ionicons name="arrow-back" size={30} color="#1E4FD8" />
            </TouchableOpacity>

            <Text style={styles.logo}>SafeTap</Text>

            <Text style={styles.heading}>Welcome Back</Text>

            <Text style={styles.subHeading}>
                Sign in to access your{"\n"} 
                safety check-ins and alerts.
            </Text>

            <View style={styles.inputContainer}>
                <FontAwesome
                name="user"
                size={22}
                color="#1E4FD8"
                style={styles.leftIcon}
                />

                <TextInput
                    placeholder="Full Name"
                    placeholderTextColor="#6C7AA9"
                    style={styles.input}
                />
            </View>

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
                style={styles.input}
                />
            </View>

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
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                />

                <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                >
                    <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={24}
                    color="#7A84A7"
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotContainer}>
                <Text style={styles.forgotText}>
                    Forgot Password?
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signInButton}>
                <Text style={styles.signInText}>
                    SIGN IN
                </Text>
            </TouchableOpacity>

            <View style={styles.orContainer}>
                <View style={styles.divider}/>

                <Text style={styles.orText}>
                    or
                </Text>

                <View style={styles.divider} />
            </View>


            <View style={styles.createAccountContainer}>
                <Text style={styles.noAccountText}>
                    Don't have an account?
                </Text>

                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/Sign_up")}
                >
                    <Text style={styles.createAccountText}>
                        Create Account
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.shieldContainer}>
                <Image
                    source={require("../../assets/images/Shield 2.0. .png")}
                    style={styles.shieldImage}
                    resizeMode="contain"
                />
            </View>



        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FB",
        paddingHorizontal: 28,
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
        marginTop:10,
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
        marginBottom: 55,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        height: 72,
        marginBottom: 24,
        paddingHorizontal: 18,
    
        shadowColor: "#8AAEFF",
        shadowOpacity: 0.18,
        shadowRadius: 14,
        shadowOffset: {
            width: 0,
            height: 6,
        },

        elevation: 8,
    },

    leftIcon: {
        marginRight: 18,
    },

    input: {
        flex: 1,
        fontSize: 20,
        color: "#24428E",
    },

    forgotContainer: {
        alignItems: "flex-end",
        marginTop: -8,
        marginBottom: 32,
    },

    forgotText: {
        fontSize: 17,
        fontWeight: "600",
        color: "#1554D1",
    },

    signInButton: {
        height: 64,
        backgroundColor: "#1764E8",
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
    },

    signInText: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "800",
        letterSpacing: 1,
    },

    orContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 28,
        marginHorizontal: 5,
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#C8D7F2",
    },

    orText: {
        marginHorizontal: 20,
        fontSize: 17,
        color: "#65769F",
    },

    createAccountContainer: {
        alignItems: "center",
        marginTop: 25,
    },

    noAccountText: {
        fontSize: 16,
        color: "#60729E",
        marginBottom: 8,
    },

    createAccountText: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1554D1",
    },

    shieldContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
    },

    shieldImage: {
        width: 180,
        height: 180,
    },
});