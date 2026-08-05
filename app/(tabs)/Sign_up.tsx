import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView,} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {Ionicons, MaterialIcons, FontAwesome} from "@expo/vector-icons";

export default function Sign_up ({ navigation }: any) {
  const [fullName, setFullName] = useState ("");
  const [email,setEmail] = useState ("");
  const [phone, setPhone] = useState ("");
  const [password,setPassword] = useState ("")
  const [confirmPassword, setConfirmPassword] = useState ("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState (false);

  return (
    <LinearGradient
    colors={["#FFFFFF", "#F7FAFF", "#EEF5FF"]}
    style={styles.container}
    >
        <SafeAreaView style={{ flex: 1}}>
            <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
        >

            <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            >
                <Ionicons
                name="arrow-back"
                size={30}
                color="#2563EB"
                />
            </TouchableOpacity>

            <Text style={styles.logo}>SafeTap</Text>
            <Text style={styles.heading}>
                Create Your Account
                </Text>
                
            <Text style={styles.subtitle}>
                Sign up to get started and {"\n"}
                stay connected with the people {"\n"}
                who matter to you.
            </Text>


            <View style={styles.inputContainer}>
                <FontAwesome
                name="user"
                size={22}
                color="#2563EB"
                style={styles.icon}
                />

                <TextInput
                placeholder="Full Name"
                placeholderTextColor="#2563EB"
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                />
            </View>

            <View style={styles.inputContainer}>
                <MaterialIcons
                name="email"
                size={22}
                color="#2563E8"
                style={styles.icon}
                />

                <TextInput
                placeholder="Email Address"
                placeholderTextColor="#6B7280"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons
                name="call"
                size={22}
                color="#2563EB"
                style={styles.icon}
                />

                <TextInput
                placeholder="Phone Number (Optional)"
                placeholderTextColor="#6B7280"
                keyboardType="phone-pad"
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons
                name="lock-closed"
                size={22}
                color="#2563EB"
                style={styles.icon}
                />

                <TextInput
                placeholder="Password"
                placeholderTextColor="#6B7280"
                style={styles.input}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                />

                <TouchableOpacity
                onPress={() => 
                    setShowPassword(!showPassword)
                }
                >
                    <Ionicons
                    name={
                        showPassword
                        ? "eye-off"
                        : "eye"
                    }
                    size={24}
                    color="#6B7280"
                />
                </TouchableOpacity>
            </View>
            

            <View style={styles.inputContainer}>
                <Ionicons
                name="lock-closed"
                size={22}
                color="#2563EB"
                style={styles.icon}
                />

                <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#6B7280"
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                />

                <TouchableOpacity
                onPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                }
                >
                    <Ionicons
                    name={
                        showConfirmPassword
                        ? "eye-off"
                        : "eye"
                    }
                    size={24}
                    color="#6B7280"
                    />
                </TouchableOpacity> 
            </View>

            <View style={styles.requirements}>
                <View style={styles.requirementRow}>
                    <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#2563EB"
                    />
                    <Text style={styles.requirementText}>
                        At least 8 characters
                    </Text>
                </View>

                <View style={styles.requirementRow}>
                    <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#2563EB"
                    />
                    <Text style={styles.requirementText}>
                        Includes a number
                    </Text>
                </View>

                <View style={styles.requirementRow}>
                    <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#2563EB"
                />
                    <Text style={styles.requirementText}>
                        Includes uppercase and lowercase letters
                    </Text>
                </View>
            </View>
                    </Text>
            </View>

            

       
   
  )