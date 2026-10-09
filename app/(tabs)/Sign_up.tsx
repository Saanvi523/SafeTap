
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Validate required fields
    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(cleanEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert(
        "Password Too Short",
        "Your password must be at least 6 characters."
      );
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords Do Not Match",
        "Please make sure both passwords are the same."
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
          },
        },
      });

      if (error) {
        const message = error.message.toLowerCase();

        const accountAlreadyExists =
          message.includes("already registered") ||
          message.includes("already exists") ||
          message.includes("already been registered") ||
          message.includes("user already");

        if (accountAlreadyExists) {
          Alert.alert(
            "Account Already Registered",
            "An account with this email may already exist. Please sign in instead.",
            [
              {
                text: "Go to Sign In",
                onPress: () =>
                  router.replace("/(tabs)/Log_in" as any),
              },
              { text: "Cancel", style: "cancel" },
            ]
          );
        } else {
          Alert.alert("Sign Up Failed", error.message);
        }

        return;
      }

      // Some Supabase configurations return no identities
      // when an email is already registered.
      if (data.user && data.user.identities?.length === 0) {
        Alert.alert(
          "Account Already Registered",
          "An account with this email may already exist. Please sign in instead.",
          [
            {
              text: "Go to Sign In",
              onPress: () =>
                router.replace("/(tabs)/Log_in" as any),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return;
      }

      if (data.user) {
        Alert.alert(
          "Check Your Email 📩",
          `If registration was successful, follow the verification instructions sent to ${cleanEmail}. Check your spam folder too. If you already have an account, please sign in instead.`,
          [
            {
              text: "Go to Sign In",
              onPress: () =>
                router.replace("/(tabs)/Log_in" as any),
            },
          ]
        );
      } else {
        Alert.alert(
          "Sign Up Incomplete",
          "We couldn't confirm account creation. Please try again."
        );
      }
    } catch {
      Alert.alert(
        "Something Went Wrong",
        "We couldn't create your account. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={25} color="#1F2937" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons
              name="shield-checkmark"
              size={38}
              color="#2563E8"
            />
          </View>

          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Sign up to start using SafeTap
          </Text>
        </View>

        {/* Full name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword((previous) => !previous)
              }
              style={styles.eyeButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  showPassword ? "eye-off-outline" : "eye-outline"
                }
                size={21}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.helperText}>
            Password must be at least 6 characters.
          </Text>
        </View>

        {/* Confirm password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              onPress={() =>
                setShowConfirmPassword((previous) => !previous)
              }
              style={styles.eyeButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  showConfirmPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={21}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Create account button */}
        <TouchableOpacity
          style={[
            styles.signUpButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleSignUp}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <Text style={styles.signUpText}>
              Creating Account...
            </Text>
          ) : (
            <>
              <Text style={styles.signUpText}>Create Account</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            </>
          )}
        </TouchableOpacity>

        {/* Sign in link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push("/(tabs)/Log_in" as any)
            }
            activeOpacity={0.7}
          >
            <Text style={styles.loginLink}> Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy message */}
        <View style={styles.privacyContainer}>
          <Ionicons
            name="shield-checkmark-outline"
            size={17}
            color="#6B7280"
          />

          <Text style={styles.privacyText}>
            Your information is kept private and secure.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 55,
    paddingBottom: 35,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#E8F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDE3EE",
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    marginLeft: 15,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#111827",
    paddingHorizontal: 12,
  },
  eyeButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },
  signUpButton: {
    height: 55,
    backgroundColor: "#2563E8",
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    gap: 10,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signUpText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#6B7280",
    fontSize: 14,
  },
  loginLink: {
    color: "#2563E8",
    fontSize: 14,
    fontWeight: "700",
  },
  privacyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
    paddingHorizontal: 15,
  },
  privacyText: {
    color: "#6B7280",
    fontSize: 12,
    marginLeft: 7,
    textAlign: "center",
  },
});