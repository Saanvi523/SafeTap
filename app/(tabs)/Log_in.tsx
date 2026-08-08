import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TextInputComponent, TouchableOpacity, View } from "react-native";


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

                <TextInputComponent
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
});