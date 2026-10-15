import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import BottomNavigation from "../../components/Bottom_Navigation";
import { supabase } from "../../lib/supabase";
type Contact = {
    id: number;
    name: string;
    phone: string;
    relationship: string;
    email: string;
    emailVerified?: boolean;
    primary: boolean;
};
const getContactsStorageKey = (userId: string) =>
    `@safetap_contacts_${userId}`;
export default function Contacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [authLoaded, setAuthLoaded] = useState(false);
    const [contactsLoaded, setContactsLoaded] = useState(false);
    const [showAddContact, setShowAddContact] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [relationship, setRelationship] = useState("");
    const [email, setEmail] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [checkingVerification, setCheckingVerification] = useState(false);
    const [draftContactId, setDraftContactId] = useState<number | null>(null);
    const [primary, setPrimary] = useState(false);
    const [editingContactId, setEditingContactId] =
        useState<number | null>(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const scrollViewRef = useRef<ScrollView | null>(null);
    const currentUserIdRef = useRef<string | null>(null);
    // Load contacts belonging to the selected account.
    const loadContacts = useCallback(async (id: string) => {
        setContactsLoaded(false);
        try {
            const stored = await AsyncStorage.getItem(
                getContactsStorageKey(id)
            );
            const parsed: unknown = stored ? JSON.parse(stored) : [];
            // Ignore results if the account changed while loading.
            if (currentUserIdRef.current !== id) return;
            setContacts(Array.isArray(parsed) ? parsed as Contact[] : []);
        } catch (error) {
            console.error("Error loading contacts:", error);
            if (currentUserIdRef.current === id) {
                setContacts([]);
                Alert.alert(
                    "Loading Error",
                    "Your contacts could not be loaded."
                );
            }
        } finally {
            if (currentUserIdRef.current === id) {
                setContactsLoaded(true);
            }
        }
    }, []);
    // Check the current session and respond to sign-in/sign-out.
    useEffect(() => {
        let active = true;
        const applySession = async (id: string | null) => {
            if (!active) return;
            currentUserIdRef.current = id;
            setUserId(id);
            setContacts([]);
            setContactsLoaded(false);
            setShowAddContact(false);
            setEditingContactId(null);
            setName("");
            setPhone("");
            setRelationship("");
            setEmail("");
            setEmailVerified(false);
            setVerificationSent(false);
            setDraftContactId(null);
            setPrimary(false);
            if (!id) {
                setContactsLoaded(true);
                setAuthLoaded(true);
                return;
            }
            await loadContacts(id);
            if (active) setAuthLoaded(true);
        };
        const initialise = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (!active) return;
            if (error) {
                currentUserIdRef.current = null;
                setUserId(null);
                setContacts([]);
                setContactsLoaded(true);
                setAuthLoaded(true);
                return;
            }
            await applySession(data.session?.user.id ?? null);
        };
        void initialise();
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            // Defer storage work until the auth callback has finished.
            void Promise.resolve().then(() => {
                if (active) {
                    void applySession(session?.user.id ?? null);
                }
            });
        });
        return () => {
            active = false;
            currentUserIdRef.current = null;
            subscription.unsubscribe();
        };
    }, [loadContacts]);
    // Return the screen to the top when it gains focus.
    useFocusEffect(
        useCallback(() => {
            const timer = setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    y: 0,
                    animated: false,
                });
            }, 100);
            return () => clearTimeout(timer);
        }, [])
    );
    // Track keyboard visibility to manage bottom navigation.
    useEffect(() => {
        const showListener = Keyboard.addListener(
            "keyboardDidShow",
            () => setKeyboardVisible(true)
        );
        const hideListener = Keyboard.addListener(
            "keyboardDidHide",
            () => setKeyboardVisible(false)
        );
        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);
    // Save contacts to the current account's storage key.
    const persistContacts = async (updated: Contact[]) => {
        const id = currentUserIdRef.current;
        if (!id) {
            Alert.alert(
                "Sign In Required",
                "Please sign in to manage your trusted contacts."
            );
            return false;
        }
        if (!contactsLoaded || id !== userId) {
            Alert.alert("Please Wait", "Your contacts are still loading.");
            return false;
        }
        try {
            await AsyncStorage.setItem(
                getContactsStorageKey(id),
                JSON.stringify(updated)
            );
            // Do not update the screen if the account changed during saving.
            if (currentUserIdRef.current !== id) return false;
            setContacts(updated);
            return true;
        } catch (error) {
            console.error("Error saving contacts:", error);
            Alert.alert(
                "Saving Error",
                "Your contacts could not be saved. Please try again."
            );
            return false;
        }
    };
    // Clear and close the contact form.
    const finishForm = () => {
        setName("");
        setPhone("");
        setRelationship("");
        setEmail("");
            setEmailVerified(false);
        setVerificationSent(false);
        setDraftContactId(null);
        setPrimary(false);
        setEditingContactId(null);
        setShowAddContact(false);
        Keyboard.dismiss();
    };
    // Validate and save a new or edited contact.
    const saveContact = async () => {
        if (!userId) {
            Alert.alert(
                "Sign In Required",
                "Please sign in before adding trusted contacts."
            );
            return;
        }
        if (!name.trim() || !phone.trim()) {
            Alert.alert(
                "Missing Information",
                "Please enter a name and phone number."
            );
            return;
        }
        // Accept digits, spaces, hyphens, brackets, and an optional leading +.
        const cleanedPhone = phone.trim();
        const phoneDigits = cleanedPhone.replace(/\D/g, "");
        const validPhoneCharacters = /^\+?[0-9\s()\-]+$/.test(cleanedPhone);
        if (!validPhoneCharacters || phoneDigits.length < 7 || phoneDigits.length > 15) {
            Alert.alert(
                "Invalid Phone Number",
                "Enter a phone number using only digits, spaces, hyphens or brackets, with an optional + at the start and 7 to 15 digits."
            );
            return;
        }
        // Email is required and must have a valid format.
        const cleanedEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!cleanedEmail) {
            Alert.alert(
                "Email Required",
                "Please enter the trusted contact's email address."
            );
            return;
        }
        if (!emailRegex.test(cleanedEmail)) {
            Alert.alert(
                "Invalid Email",
                "Please enter a valid email address, such as name@example.com."
            );
            return;
        }
        // Confirm verification with the server rather than trusting local UI state.
        const verificationContactId = editingContactId ?? draftContactId;
        if (verificationContactId === null || !emailVerified) {
            Alert.alert(
                "Email Not Verified",
                "Send the verification email, open its link, and select Check Verification Status before saving this contact."
            );
            return;
        }
        try {
            const { data: verificationData, error: verificationError } = await supabase.functions.invoke(
                "Send-Contact-Verification",
                { body: { action: "status", contactId: verificationContactId } }
            );
            if (verificationError) throw verificationError;
            const serverVerified = verificationData?.verified === true &&
                typeof verificationData?.email === "string" &&
                verificationData.email.trim().toLowerCase() === cleanedEmail;
            if (!serverVerified) {
                setEmailVerified(false);
                Alert.alert("Email Not Verified", "The server has not confirmed this email address as verified. Please check its status again.");
                return;
            }
        } catch (verificationError: any) {
            console.error("Could not confirm email before saving:", verificationError);
            Alert.alert("Could Not Confirm Verification", verificationError?.message ?? "Please check the verification status again.");
            return;
        }
        // Prevent duplicate email addresses or phone numbers, except for the contact being edited.
        const duplicate = contacts.find((contact) => {
            if (contact.id === editingContactId) return false;
            const existingPhoneDigits = contact.phone.replace(/\D/g, "");
            return (
                contact.email.trim().toLowerCase() === cleanedEmail ||
                existingPhoneDigits === phoneDigits
            );
        });
        if (duplicate) {
            Alert.alert(
                "Duplicate Contact",
                "A contact with this email address or phone number already exists."
            );
            return;
        }
        if (!contactsLoaded) {
            Alert.alert("Please Wait", "Your contacts are still loading.");
            return;
        }
        const cleanedContact: Contact = {
            id: editingContactId ?? draftContactId ?? Date.now(),
            name: name.trim(),
            phone: cleanedPhone,
            relationship: relationship.trim(),
            email: cleanedEmail.toLowerCase(),
            emailVerified: true,
            primary,
        };
        let updated: Contact[];
        if (editingContactId !== null) {
            updated = contacts.map((contact) => {
                if (contact.id === editingContactId) {
                    return cleanedContact;
                }
                if (primary) {
                    return { ...contact, primary: false };
                }
                return contact;
            });
        } else {
            const existing = primary
                ? contacts.map((contact) => ({
                    ...contact,
                    primary: false,
                }))
                : contacts;
            updated = [...existing, cleanedContact];
        }
        const wasEditing = editingContactId !== null;
        const saved = await persistContacts(updated);
        if (!saved) return;
        finishForm();
        Alert.alert(
            wasEditing ? "Contact Updated" : "Contact Added",
            wasEditing
                ? "The contact details have been updated."
                : "The trusted contact has been added successfully."
        );
    };
    // Send a verification email through the deployed Supabase Edge Function.
    const requestEmailVerification = async () => {
        const cleanedEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userId) {
            Alert.alert("Sign In Required", "Please sign in before requesting email verification.");
            return;
        }
        if (!cleanedEmail || !emailRegex.test(cleanedEmail)) {
            Alert.alert("Enter a Valid Email", "Enter a valid email address before requesting verification.");
            return;
        }
        const contactId = editingContactId ?? draftContactId ?? Date.now();
        try {
            const { data, error } = await supabase.functions.invoke(
                "Send-Contact-Verification",
                { body: { action: "send", contactId, email: cleanedEmail } }
            );
            if (error) {
                let details = error.message ?? "The verification email could not be sent.";
                const context = (error as any)?.context;
                if (context && typeof context.clone === "function") {
                    try {
                        const responseText = await context.clone().text();
                        if (responseText) {
                            try {
                                const parsed = JSON.parse(responseText);
                                details = parsed.details ?? parsed.error ?? parsed.message ?? responseText;
                            } catch {
                                details = responseText;
                            }
                        }
                    } catch (readError) {
                        console.error("Could not read email verification response:", readError);
                    }
                }
                console.error("Email verification request failed:", details);
                Alert.alert("Could Not Send Email", details);
                return;
            }
            if (!data?.success) {
                Alert.alert(
                    "Could Not Send Email",
                    data?.details ?? data?.error ?? "The server did not confirm that the email was sent."
                );
                return;
            }
            if (editingContactId === null) setDraftContactId(contactId);
            setEmailVerified(false);
            setVerificationSent(true);
            Alert.alert(
                "Verification Email Sent",
                `A verification email was sent to ${cleanedEmail}.\n\nPlease check your inbox and spam/junk folder, then click the verification link. Return to SafeTap and select Check Verification Status.`,
                [{ text: "OK" }]
            );
        } catch (error: any) {
            console.error("Unexpected email verification error:", error);
            Alert.alert("Could Not Send Email", error?.message ?? "Something went wrong while requesting verification.");
        }
    };
    const checkEmailVerification = async () => {
        const cleanedEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userId) {
            Alert.alert("Sign In Required", "Please sign in before checking verification.");
            return;
        }
        if (!cleanedEmail || !emailRegex.test(cleanedEmail)) {
            Alert.alert("Enter a Valid Email", "Enter a valid email address first.");
            return;
        }
        if (!verificationSent && editingContactId === null && draftContactId === null) {
            Alert.alert("Request Verification First", "Select Verify Email and send a verification email before checking its status.");
            return;
        }
        const contactId = editingContactId ?? draftContactId;
        if (contactId === null) {
            Alert.alert("Request Verification First", "Send a verification email for this contact first.");
            return;
        }
        setCheckingVerification(true);
        try {
            const { data, error } = await supabase.functions.invoke(
                "Send-Contact-Verification",
                { body: { action: "status", contactId } }
            );
            if (error) {
                let details = error.message ?? "Could not check verification status.";
                const context = (error as any)?.context;
                if (context && typeof context.clone === "function") {
                    try {
                        const responseText = await context.clone().text();
                        if (responseText) {
                            try {
                                const parsed = JSON.parse(responseText);
                                details = parsed.details ?? parsed.error ?? parsed.message ?? responseText;
                            } catch {
                                details = responseText;
                            }
                        }
                    } catch (readError) {
                        console.error("Could not read status response:", readError);
                    }
                }
                throw new Error(details);
            }
            if (data?.error) throw new Error(data.error);
            const verified = data?.verified === true &&
                typeof data?.email === "string" &&
                data.email.trim().toLowerCase() === cleanedEmail;
            setEmailVerified(verified);
            if (verified) {
                Alert.alert("Email Verified", "This email address has been verified. You can now save the contact.");
            } else {
                Alert.alert("Not Verified Yet", "The email has not been verified yet. Open the verification email and click its link, then check again.");
            }
        } catch (error: any) {
            console.error("Verification status error:", error);
            Alert.alert("Could Not Check Status", error?.message ?? "Unable to check verification status. Please try again.");
        } finally {
            setCheckingVerification(false);
        }
    };
    // Populate the form with the selected contact's details.
    const editContact = (contact: Contact) => {
        setName(contact.name);
        setPhone(contact.phone);
        setRelationship(contact.relationship);
        setEmail(contact.email);
        // Preserve the saved verification state when the email has not changed.
        // saveContact still confirms the address with the server before saving.
        setEmailVerified(contact.emailVerified === true);
        setVerificationSent(contact.emailVerified === true);
        setDraftContactId(contact.id);
        setPrimary(contact.primary);
        setEditingContactId(contact.id);
        setShowAddContact(true);
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };
    // Ask for confirmation before removing a contact.
    const deleteContact = (id: number) => {
        Alert.alert(
            "Delete Contact",
            "Are you sure you want to remove this contact?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const updated = contacts.filter(
                            (contact) => contact.id !== id
                        );
                        const saved = await persistContacts(updated);
                        if (saved) {
                            Alert.alert(
                                "Contact Removed",
                                "The trusted contact has been removed."
                            );
                        }
                    },
                },
            ]
        );
    };
    // Generate initials for contact avatars.
    const getInitials = (contactName: string) => {
        const words = contactName.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }
        return (
            words[0][0] + words[words.length - 1][0]
        ).toUpperCase();
    };
    const primaryContact = contacts.find((contact) => contact.primary);
    const otherContacts = contacts.filter((contact) => !contact.primary);
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContainer}
                >
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Trusted Contacts</Text>
                            <Text style={styles.subtitle}>
                                People who can help keep you safe
                            </Text>
                        </View>
                        <View style={styles.headerIcon}>
                            <Ionicons
                                name="shield-checkmark"
                                size={38}
                                color="#08B88A"
                            />
                        </View>
                    </View>
                    {!authLoaded ? (
                        <View style={styles.noEmergencyCard}>
                            <Text style={styles.emptyTitle}>
                                Checking Sign In...
                            </Text>
                        </View>
                    ) : !userId ? (
                        <View style={styles.noEmergencyCard}>
                            <View style={styles.emptyIcon}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={40}
                                    color="#08B88A"
                                />
                            </View>
                            <Text style={styles.emptyTitle}>
                                Sign In to View Contacts
                            </Text>
                            <Text style={styles.emptyText}>
                                Sign in to add and manage your trusted contacts.
                                Your contacts are kept separately for each account.
                            </Text>
                            <TouchableOpacity
                                style={styles.signInButton}
                                activeOpacity={0.8}
                                onPress={() => router.push("/(tabs)/Log_in")}
                            >
                                <Ionicons
                                    name="log-in-outline"
                                    size={22}
                                    color="#FFFFFF"
                                />
                                <Text style={styles.signInButtonText}>
                                    Sign In
                                </Text>
                                <Ionicons
                                    name="arrow-forward"
                                    size={18}
                                    color="#FFFFFF"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.signUpButton}
                                activeOpacity={0.8}
                                onPress={() => router.push("/(tabs)/Sign_up")}
                            >
                                <Text style={styles.signUpButtonText}>
                                    Don't have an account? Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : !contactsLoaded ? (
                        <View style={styles.noEmergencyCard}>
                            <Text style={styles.emptyTitle}>
                                Loading Contacts...
                            </Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.sectionLabel}>
                                PRIMARY CONTACT
                            </Text>
                            {primaryContact ? (
                                <View style={styles.emergencyCard}>
                                    <View style={styles.emergencyTop}>
                                        <View style={styles.emergencyIcon}>
                                            <Text style={styles.emergencyInitials}>
                                                {getInitials(primaryContact.name)}
                                            </Text>
                                        </View>
                                        <View style={styles.emergencyBadge}>
                                            <Ionicons
                                                name="shield-checkmark"
                                                size={17}
                                                color="#08A96D"
                                            />
                                            <Text style={styles.emergencyBadgeText}>
                                                Primary Contact
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.emergencyName}>
                                        {primaryContact.name}
                                    </Text>
                                    <Text style={styles.emergencyRelationship}>
                                        {primaryContact.relationship ||
                                            "Relationship not provided"}
                                    </Text>
                                    <View style={styles.emergencyInfo}>
                                        <View style={styles.infoLine}>
                                            <Ionicons
                                                name="call"
                                                size={20}
                                                color="#08A96D"
                                            />
                                            <Text style={styles.infoText}>
                                                {primaryContact.phone}
                                            </Text>
                                        </View>
                                        {!!primaryContact.email && (
                                            <View style={styles.infoLine}>
                                                <Ionicons
                                                    name="mail"
                                                    size={20}
                                                    color="#08A96D"
                                                />
                                                <Text style={styles.infoText}>
                                                    {primaryContact.email}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        style={styles.editContactButton}
                                        onPress={() => editContact(primaryContact)}
                                    >
                                        <MaterialIcons
                                            name="edit"
                                            size={22}
                                            color="#2563E8"
                                        />
                                        <Text style={styles.editContactText}>
                                            Edit This Contact
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.deleteEmergencyButton}
                                        onPress={() => deleteContact(primaryContact.id)}
                                    >
                                        <MaterialIcons
                                            name="delete-outline"
                                            size={22}
                                            color="#EF2929"
                                        />
                                        <Text style={styles.deleteEmergencyText}>
                                            Remove Contact
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.noEmergencyCard}>
                                    <View style={styles.emptyIcon}>
                                        <Ionicons
                                            name="person-add-outline"
                                            size={40}
                                            color="#08B88A"
                                        />
                                    </View>
                                    <Text style={styles.emptyTitle}>
                                        No primary contact
                                    </Text>
                                    <Text style={styles.emptyText}>
                                        Add a trusted person and select
                                        "Set as Primary Contact".
                                    </Text>
                                </View>
                            )}
                            {otherContacts.length > 0 && (
                                <View style={styles.otherSection}>
                                    <View style={styles.otherHeader}>
                                        <Text style={styles.sectionLabel}>
                                            OTHER TRUSTED CONTACTS
                                        </Text>
                                        <View style={styles.countBadge}>
                                            <Text style={styles.countText}>
                                                {otherContacts.length}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.otherContactsCard}>
                                        {otherContacts.map((contact, index) => (
                                            <View
                                                key={contact.id}
                                                style={[
                                                    styles.otherContact,
                                                    index !== otherContacts.length - 1 &&
                                                        styles.contactDivider,
                                                ]}
                                            >
                                                <View style={styles.smallInitial}>
                                                    <Text style={styles.smallInitialText}>
                                                        {getInitials(contact.name)}
                                                    </Text>
                                                </View>
                                                <View style={styles.otherContactInfo}>
                                                    <Text style={styles.otherContactName}>
                                                        {contact.name}
                                                    </Text>
                                                    <Text style={styles.otherContactRelationship}>
                                                        {contact.relationship || contact.phone}
                                                    </Text>
                                                </View>
                                                <TouchableOpacity
                                                    style={styles.editSmallButton}
                                                    onPress={() => editContact(contact)}
                                                >
                                                    <MaterialIcons
                                                        name="edit"
                                                        size={21}
                                                        color="#2563E8"
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.deleteSmallButton}
                                                    onPress={() => deleteContact(contact.id)}
                                                >
                                                    <MaterialIcons
                                                        name="delete-outline"
                                                        size={24}
                                                        color="#EF2929"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                            <View style={styles.addSection}>
                                <TouchableOpacity
                                    style={styles.addOutlineButton}
                                    onPress={() => {
                                        if (showAddContact) {
                                            finishForm();
                                        } else {
                                            setName("");
                                            setPhone("");
                                            setRelationship("");
                                            setEmail("");
            setEmailVerified(false);
                                            setPrimary(false);
                                            setEditingContactId(null);
                                            setShowAddContact(true);
                                        }
                                    }}
                                >
                                    <Ionicons
                                        name={showAddContact ? "close" : "add"}
                                        size={25}
                                        color="#2563E8"
                                    />
                                    <Text style={styles.addOutlineText}>
                                        {showAddContact
                                            ? "Cancel"
                                            : "Add Trusted Contact"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {showAddContact && (
                                <View style={styles.formCard}>
                                    <Text style={styles.formTitle}>
                                        {editingContactId !== null
                                            ? "Edit Contact"
                                            : "Add Trusted Contact"}
                                    </Text>
                                    {/* Full Name */}
                                    <View style={styles.labelRow}>
                                        <Text style={styles.inputLabel}>
                                            Full Name
                                        </Text>
                                        <Text style={styles.requiredText}>
                                            Required
                                        </Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter full name"
                                        placeholderTextColor="#9AA8C0"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                    />
                                    {/* Phone Number */}
                                    <View style={styles.labelRow}>
                                        <Text style={styles.inputLabel}>
                                            Phone Number
                                        </Text>
                                        <Text style={styles.requiredText}>
                                            Required
                                        </Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter phone number"
                                        placeholderTextColor="#9AA8C0"
                                        keyboardType="phone-pad"
                                        value={phone}
                                        onChangeText={setPhone}
                                        returnKeyType="next"
                                    />
                                    {/* Email - required and positioned above Relationship */}
                                    <View style={styles.labelRow}>
                                        <Text style={styles.inputLabel}>
                                            Email
                                        </Text>
                                        <Text style={styles.requiredText}>
                                            Required
                                        </Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter email address"
                                        placeholderTextColor="#9AA8C0"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        value={email}
                                        onChangeText={(value) => {
                                            if (value.trim().toLowerCase() !== email.trim().toLowerCase()) {
                                                // A changed email must be verified separately.
                                                setEmailVerified(false);
                                                setVerificationSent(false);
                                            }
                                            setEmail(value);
                                        }}
                                        returnKeyType="next"
                                    />
                                    <View style={styles.verificationRow}>
                                        <View style={styles.verificationInfo}>
                                            <Ionicons
                                                name={emailVerified ? "checkmark-circle" : "alert-circle-outline"}
                                                size={19}
                                                color={emailVerified ? "#08A96D" : "#D97706"}
                                            />
                                            <Text style={[
                                                styles.verificationText,
                                                emailVerified && styles.verificationTextVerified,
                                            ]}>
                                                {emailVerified ? "Email verified" : "Email not verified"}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.verifyButton}
                                            activeOpacity={0.8}
                                            onPress={requestEmailVerification}
                                        >
                                            <View style={styles.verifyButtonContent}>
                                                <Ionicons
                                                    name="mail-outline"
                                                    size={16}
                                                    color="#2563E8"
                                                />
                                                <Text style={styles.verifyButtonText}>Verify Email</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        style={[
                                            styles.verifyButton,
                                            styles.checkVerificationButton,
                                            { alignSelf: "flex-start", marginBottom: 10 },
                                        ]}
                                        activeOpacity={0.8}
                                        onPress={checkEmailVerification}
                                        disabled={checkingVerification}
                                    >
                                        <View style={styles.verifyButtonContent}>
                                            <Ionicons
                                                name={checkingVerification ? "time-outline" : "refresh-outline"}
                                                size={16}
                                                color="#08A96D"
                                            />
                                            <Text style={styles.checkVerificationButtonText}>
                                                {checkingVerification ? "Checking..." : "Check Verification Status"}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={styles.verificationHint}>
                                        Verification must be completed before this contact can be saved.
                                    </Text>
                                    {/* Relationship */}
                                    <View style={styles.labelRow}>
                                        <Text style={styles.inputLabel}>
                                            Relationship
                                        </Text>
                                        <Text style={styles.optionalText}>
                                            Optional
                                        </Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. Parent, Friend (optional)"
                                        placeholderTextColor="#9AA8C0"
                                        value={relationship}
                                        onChangeText={setRelationship}
                                        returnKeyType="done"
                                    />
                                    {/* Primary Contact Option */}
                                    <TouchableOpacity
                                        style={styles.primaryOption}
                                        activeOpacity={0.8}
                                        onPress={() => setPrimary(!primary)}
                                    >
                                        <View
                                            style={[
                                                styles.checkbox,
                                                primary && styles.checkboxSelected,
                                            ]}
                                        >
                                            {primary && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={20}
                                                    color="#FFFFFF"
                                                />
                                            )}
                                        </View>
                                        <View style={styles.primaryOptionText}>
                                            <View style={styles.primaryTitleRow}>
                                                <Text style={styles.primaryOptionTitle}>
                                                    Set as Primary Contact
                                                </Text>
                                                <Text style={styles.optionalText}>
                                                    Optional
                                                </Text>
                                            </View>
                                            <Text style={styles.primaryOptionDescription}>
                                                This person will appear at the top as your
                                                primary contact.
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    {/* Save Contact */}
                                    <TouchableOpacity
                                        style={styles.saveButton}
                                        onPress={saveContact}
                                    >
                                        <Ionicons
                                            name={
                                                editingContactId !== null
                                                    ? "checkmark-circle"
                                                    : "person-add"
                                            }
                                            size={25}
                                            color="#FFFFFF"
                                        />
                                        <Text style={styles.saveButtonText}>
                                            {editingContactId !== null
                                                ? "Save Changes"
                                                : "Save Contact"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>
                {!keyboardVisible && (
                    <BottomNavigation activeTab="Contacts" />
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F8FF",
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: 22,
        paddingTop: 20,
        paddingBottom: 180,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    title: {
        fontSize: 36,
        fontWeight: "800",
        color: "#173B8F",
        maxWidth: 280,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 23,
        color: "#60729E",
        marginTop: 7,
        maxWidth: 270,
    },
    headerIcon: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: "#E2FAEF",
        alignItems: "center",
        justifyContent: "center",
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: "800",
        letterSpacing: 1,
        color: "#60729E",
        marginBottom: 12,
    },
    emergencyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 28,
        padding: 24,
        borderWidth: 2,
        borderColor: "#08B88A",
        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
    },
    emergencyTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    emergencyIcon: {
        width: 82,
        height: 82,
        borderRadius: 41,
        backgroundColor: "#E2FAEF",
        alignItems: "center",
        justifyContent: "center",
    },
    emergencyInitials: {
        fontSize: 25,
        fontWeight: "800",
        color: "#08A96D",
    },
    emergencyBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E2FAEF",
        borderRadius: 18,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    emergencyBadgeText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#08A96D",
        marginLeft: 5,
    },
    emergencyName: {
        fontSize: 29,
        fontWeight: "800",
        color: "#173B8F",
        marginTop: 20,
    },
    emergencyRelationship: {
        fontSize: 16,
        fontWeight: "700",
        color: "#08A96D",
        marginTop: 4,
    },
    emergencyInfo: {
        backgroundColor: "#F5FAF8",
        borderRadius: 18,
        padding: 15,
        marginTop: 20,
    },
    infoLine: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    infoText: {
        fontSize: 15,
        color: "#526487",
        marginLeft: 10,
        flex: 1,
    },
    editContactButton: {
        height: 50,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#BFD2F7",
        backgroundColor: "#F5F8FF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 18,
    },
    editContactText: {
        color: "#2563E8",
        fontSize: 15,
        fontWeight: "800",
        marginLeft: 7,
    },
    deleteEmergencyButton: {
        height: 48,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#F2CACA",
        backgroundColor: "#FFF8F8",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    deleteEmergencyText: {
        color: "#EF2929",
        fontSize: 15,
        fontWeight: "800",
        marginLeft: 7,
    },
    noEmergencyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        padding: 28,
        alignItems: "center",
    },
    emptyIcon: {
        width: 75,
        height: 75,
        borderRadius: 38,
        backgroundColor: "#E2FAEF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    emptyTitle: {
        fontSize: 21,
        fontWeight: "800",
        color: "#173B8F",
        textAlign: "center",
    },
    emptyText: {
        fontSize: 15,
        lineHeight: 23,
        textAlign: "center",
        color: "#60729E",
        marginTop: 8,
    },
    signInButton: {
        minHeight: 54,
        width: "100%",
        backgroundColor: "#2563E8",
        borderRadius: 15,
        paddingHorizontal: 20,
        marginTop: 22,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    signInButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "800",
    },
    signUpButton: {
        padding: 14,
        marginTop: 4,
    },
    signUpButtonText: {
        color: "#2563E8",
        fontSize: 14,
        fontWeight: "700",
        textAlign: "center",
    },
    otherSection: {
        marginTop: 30,
    },
    otherHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    countBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#E2FAEF",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
        marginBottom: 12,
    },
    countText: {
        fontSize: 13,
        fontWeight: "800",
        color: "#08A96D",
    },
    otherContactsCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        paddingHorizontal: 18,
        overflow: "hidden",
    },
    otherContact: {
        minHeight: 82,
        flexDirection: "row",
        alignItems: "center",
    },
    contactDivider: {
        borderBottomWidth: 1,
        borderBottomColor: "#E5EBF4",
    },
    smallInitial: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#F0E5FF",
        alignItems: "center",
        justifyContent: "center",
    },
    smallInitialText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#8B4DFF",
    },
    otherContactInfo: {
        flex: 1,
        marginLeft: 14,
    },
    otherContactName: {
        fontSize: 17,
        fontWeight: "800",
        color: "#173B8F",
    },
    otherContactRelationship: {
        fontSize: 14,
        color: "#60729E",
        marginTop: 3,
    },
    editSmallButton: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: "#EFF5FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    deleteSmallButton: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: "#FFF2F2",
        alignItems: "center",
        justifyContent: "center",
    },
    addSection: {
        marginTop: 25,
    },
    addOutlineButton: {
        height: 58,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: "#2563E8",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    addOutlineText: {
        fontSize: 17,
        fontWeight: "800",
        color: "#2563E8",
        marginLeft: 8,
    },
    formCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 22,
        marginTop: 18,
        shadowColor: "#7898D8",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    formTitle: {
        fontSize: 23,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 7,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: "700",
        color: "#526487",
    },
    requiredText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#EF2929",
    },
    optionalText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#08A96D",
    },
    input: {
        height: 52,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#D7E1F0",
        backgroundColor: "#F8FAFE",
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#173B8F",
        marginBottom: 15,
    },
    verificationRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: -5,
        marginBottom: 7,
    },
    verificationInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginRight: 8,
    },
    verificationText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#D97706",
        marginLeft: 6,
    },
    verificationTextVerified: {
        color: "#08A96D",
    },
    verifyButton: {
        borderWidth: 1,
        borderColor: "#2563E8",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 9,
        backgroundColor: "#EFF5FF",
    },
    checkVerificationButton: {
        borderColor: "#B7E8D0",
        backgroundColor: "#EAFBF3",
    },
    verifyButtonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    verifyButtonText: {
        fontSize: 13,
        fontWeight: "800",
        color: "#2563E8",
    },
    checkVerificationButtonText: {
        fontSize: 13,
        fontWeight: "800",
        color: "#08A96D",
    },
    verificationHint: {
        fontSize: 12,
        lineHeight: 17,
        color: "#60729E",
        marginBottom: 15,
        marginTop: 2,
    },
    primaryOption: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F8FF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#D7E1F0",
        padding: 15,
        marginTop: 2,
        marginBottom: 18,
    },
    checkbox: {
        width: 27,
        height: 27,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#B8C6DD",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxSelected: {
        backgroundColor: "#08B88A",
        borderColor: "#08B88A",
    },
    primaryOptionText: {
        flex: 1,
        marginLeft: 12,
    },
    primaryTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    primaryOptionTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: "#173B8F",
        flex: 1,
        marginRight: 6,
    },
    primaryOptionDescription: {
        fontSize: 13,
        lineHeight: 19,
        color: "#60729E",
        marginTop: 3,
    },
    saveButton: {
        height: 56,
        borderRadius: 17,
        backgroundColor: "#2563E8",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "800",
        marginLeft: 8,
    },
});
