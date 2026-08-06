import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity } from "react-native";

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

            
        </SafeAreaView>
    )
}