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


            <TouchableOpacity style={styles.signUpButton}>
                <LinearGradient
                    colors={["#3B82F6", "#2563EB"]}
                    start={{ x:0, y:0 }}
                    end={{ x:1, y:0 }}
                    style={styles.buttonGradient}    
                >
                    <Text style={styles.signUpButtonText}>
                        SIGN UP
                    </Text>
                </LinearGradient> 
            </TouchableOpacity>   

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                    Already have an account?
                </Text>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.loginLink}>
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.shieldcontainer}>
                <Ionicons
                    name="shield.checkmark"
                    size={90}
                    color="#3B82F6"
                />
            </View>

        </ScrollView>
    </SafeAreaView>
</LinearGradient>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContainer: {
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 40,
    },

    backButton: {
        marginBottom: 20,
        alignSelf: "flex-start",
    },
    
    logo: {
        fontSize: 52,
        fontWeight: "800",
        color: "#2563EB",
        textAlign: "center",
        marginBottom: 10,
    },
    
    heading: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1E3A8A",
        textAlign: "center",
    },

    subtitle: {
        fontSize: 17,
        color: "#6B7280",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 35,
        lineHeight: 26,
    },
    
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        paddingHorizontal: 18,
        height: 64,
        marginBottom: 18,

        shadowColor: "#2563EB",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 5,
    },

    icon: {
        marginRight: 15,
    },

    input: {
        flex: 1,
        fontSize: 17,
        color: "#1F2937",
    },

    requirements: {
        marginTop: 5,
        marginBottom: 25,
    },

    requirementRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },

    requirementText: {
        fontSize: 15,
        color: "#64748B",
        marginLeft: 10,
    },

    signUpButton: {
        marginTop: 10,
        borderRadius: 18,
        overflow: "hidden",
    },

    buttonGradient: {
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 18,
    },

    signUpButtonText: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "700",
        letterSpacing: 1,
    },

    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 28,
    },

    loginText: {
        fontSize: 16,
        color: "#64748B",
    },

    loginLink: {
        fontSize: 16,
        color: "#2563EB",
        fontWeight: "700",
        marginLeft: 5,
    },

    shieldContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 45,
        marginBottom: 20,
    },
});
    


                    
            
            

            

       
   
  )