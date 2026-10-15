
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
    const [email, setEmail] = useState("");
    const [relationship, setRelationship] = useState("");
    const [primary, setPrimary] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [checkingVerification, setCheckingVerification] = useState(false);
    const [savingContact, setSavingContact] = useState(false);

    const [editingContactId, setEditingContactId] =
        useState<number | null>(null);
    const [draftContactId, setDraftContactId] =
        useState<number | null>(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const scrollViewRef = useRef<ScrollView | null>(null);
    const currentUserIdRef = useRef<string | null>(null);

    // Load contacts belonging to the signed-in account.
    const loadContacts = useCallback(async (id: string) => {
        setContactsLoaded(false);

        try {
            const stored = await AsyncStorage.getItem(
                getContactsStorageKey(id)
            );

            const parsed: unknown = stored ? JSON.parse(stored) : [];

            if (currentUserIdRef.current !== id) return;

            setContacts(
                Array.isArray(parsed) ? (parsed as Contact[]) : []
            );
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

    // Check the authentication session.
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
            setDraftContactId(null);
            setName("");
            setPhone("");
            setEmail("");
            setRelationship("");
            setPrimary(false);
            setEmailVerified(false);
            setVerificationSent(false);

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

    // Scroll to the top when the page becomes active.
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

    // Hide bottom navigation while the keyboard is open.
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

    // Save the current account's contacts.
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
            Alert.alert(
                "Please Wait",
                "Your contacts are still loading."
            );
            return false;
        }

        try {
            await AsyncStorage.setItem(
                getContactsStorageKey(id),
                JSON.stringify(updated)
            );

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

    // Clear and close the form.
    const finishForm = () => {
        setName("");
        setPhone("");
        setEmail("");
        setRelationship("");
        setPrimary(false);
        setEmailVerified(false);
        setVerificationSent(false);
        setEditingContactId(null);
        setDraftContactId(null);
        setShowAddContact(false);
        Keyboard.dismiss();
    };

    // Send an email verification link.
    const requestEmailVerification = async () => {
        const cleanedEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!userId) {
            Alert.alert("Sign In Required", "Please sign in first.");
            return;
        }

        if (!cleanedEmail || !emailRegex.test(cleanedEmail)) {
            Alert.alert(
                "Enter a Valid Email",
                "Enter a valid email address before requesting verification."
            );
            return;
        }

        // Reuse the same ID for this contact throughout the form.
        const contactId =
            editingContactId ?? draftContactId ?? Date.now();

        try {
            const { data, error } =
                await supabase.functions.invoke(
                    "Send-Contact-Verification",
                    {
                        body: {
                            action: "send",
                            contactId,
                            email: cleanedEmail,
                        },
                    }
                );

            if (error) throw error;

            if (!data?.success) {
                throw new Error(
                    data?.error ??
                        "The verification email could not be sent."
                );
            }

            if (editingContactId === null) {
                setDraftContactId(contactId);
            }

            setEmailVerified(false);
            setVerificationSent(true);

            Alert.alert(
                "Verification Email Sent",
                `A verification link was sent to ${cleanedEmail}. Open that email and click the verification link before saving this contact.`
            );
        } catch (error: any) {
            console.error("Email verification error:", error);

            let errorDetails =
                error?.message ??
                "Something went wrong. Please try again.";

            // Read the HTTP response returned by the Edge Function.
            try {
                if (error?.context) {
                    const responseText = await error.context
                        .clone()
                        .text();

                    console.error(
                        "Email verification response:",
                        responseText
                    );

                    if (responseText) {
                        errorDetails +=
                            "\n\nDetails: " + responseText;
                    }

                    console.error(
                        "Email verification status:",
                        error.context.status
                    );
                }
            } catch (detailsError) {
                console.error(
                    "Could not read error response:",
                    detailsError
                );
            }

            Alert.alert(
                "Could Not Send Email",
                errorDetails
            );
        }
    };

    // Ask Supabase for the real verification status.
    // Never treat a local state value as proof of verification.
    const getVerifiedStatus = async (
        contactId: number,
        contactEmail: string
    ): Promise<boolean> => {
        const cleanedEmail = contactEmail.trim().toLowerCase();

        const { data, error } =
            await supabase.functions.invoke(
                "Send-Contact-Verification",
                {
                    body: {
                        action: "status",
                        contactId,
                    },
                }
            );

        if (error) throw error;

        if (data?.error) {
            throw new Error(data.error);
        }

        return (
            data?.verified === true &&
            typeof data?.email === "string" &&
            data.email.trim().toLowerCase() === cleanedEmail
        );
    };

    // Check verification status when the user taps the status button.
    const checkEmailVerification = async (
        contactId: number,
        contactEmail: string
    ) => {
        if (!userId) {
            Alert.alert("Sign In Required", "Please sign in first.");
            return;
        }

        setCheckingVerification(true);

        try {
            const verified = await getVerifiedStatus(
                contactId,
                contactEmail
            );

            setEmailVerified(verified);

            // Update a saved contact only if its email still matches.
            const updatedContacts = contacts.map((contact) => {
                if (
                    contact.id === contactId &&
                    contact.email.trim().toLowerCase() ===
                        contactEmail.trim().toLowerCase()
                ) {
                    return {
                        ...contact,
                        emailVerified: verified,
                    };
                }

                return contact;
            });

            if (currentUserIdRef.current !== userId) return;

            if (contacts.some((contact) => contact.id === contactId)) {
                await AsyncStorage.setItem(
                    getContactsStorageKey(userId),
                    JSON.stringify(updatedContacts)
                );
                setContacts(updatedContacts);
            }

            Alert.alert(
                verified ? "Email Verified" : "Not Verified Yet",
                verified
                    ? "Supabase confirms this email address is verified."
                    : "The email has not been verified for this address yet. Open the verification link and try again."
            );
        } catch (error: any) {
            console.error("Verification status error:", error);

            Alert.alert(
                "Could Not Check Status",
                error?.message ??
                    "Unable to check verification status. Please try again."
            );
        } finally {
            setCheckingVerification(false);
        }
    };

    // Validate and save a contact.
    const saveContact = async () => {
        if (savingContact) return;

        if (!userId) {
            Alert.alert(
                "Sign In Required",
                "Please sign in before adding trusted contacts."
            );
            return;
        }

        if (!name.trim()) {
            Alert.alert(
                "Name Required",
                "Please enter the contact's full name."
            );
            return;
        }

        if (!phone.trim()) {
            Alert.alert(
                "Phone Required",
                "Please enter the contact's phone number."
            );
            return;
        }

        const cleanedPhone = phone.trim();
        const phoneDigits = cleanedPhone.replace(/\D/g, "");
        const validPhoneCharacters = /^\+?[0-9\s()\-]+$/.test(
            cleanedPhone
        );

        if (
            !validPhoneCharacters ||
            phoneDigits.length < 7 ||
            phoneDigits.length > 15
        ) {
            Alert.alert(
                "Invalid Phone Number",
                "Enter a phone number containing 7 to 15 digits. You can use spaces, hyphens, brackets or a + at the beginning."
            );
            return;
        }

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

        if (!contactsLoaded) {
            Alert.alert(
                "Please Wait",
                "Your contacts are still loading."
            );
            return;
        }

        // Prevent duplicate phone numbers and email addresses.
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

        const contactId =
            editingContactId ?? draftContactId ?? Date.now();

        setSavingContact(true);

        try {
            // Check Supabase immediately before saving.
            const verified = await getVerifiedStatus(
                contactId,
                cleanedEmail
            );

            if (!verified) {
                setEmailVerified(false);

                Alert.alert(
                    "Email Verification Required",
                    "This contact cannot be saved until their email is verified. Send the verification email, open its link, and check the status again."
                );

                return;
            }

            setEmailVerified(true);

            // Preserve verification only for the exact verified email.
            const existingContact = contacts.find(
                (contact) => contact.id === editingContactId
            );

            const sameEmail =
                existingContact?.email.trim().toLowerCase() ===
                cleanedEmail;

            const cleanedContact: Contact = {
                id: contactId,
                name: name.trim(),
                phone: cleanedPhone,
                email: cleanedEmail,
                relationship: relationship.trim(),
                emailVerified: verified || sameEmail,
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
                    ? "The verified contact details have been updated."
                    : "The verified trusted contact has been added successfully."
            );
        } catch (error: any) {
            console.error(
                "Contact verification before save failed:",
                error
            );

            Alert.alert(
                "Could Not Confirm Verification",
                error?.message ??
                    "SafeTap could not confirm this email address with Supabase. The contact has not been saved. Please try again."
            );
        } finally {
            setSavingContact(false);
        }
    };

    // Load an existing contact into the form.
    const editContact = (contact: Contact) => {
        setName(contact.name);
        setPhone(contact.phone);
        setEmail(contact.email);
        setRelationship(contact.relationship);
        setPrimary(contact.primary);

        // Do not trust the locally stored verification flag.
        setEmailVerified(false);
        setVerificationSent(true);

        setEditingContactId(contact.id);
        setDraftContactId(null);
        setShowAddContact(true);

        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({
                animated: true,
            });
        }, 100);
    };

    // Confirm before deleting a contact.
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

    // Create initials for contact avatars.
    const getInitials = (contactName: string) => {
        const words = contactName.trim().split(/\s+/);

        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }

        return (
            words[0][0] + words[words.length - 1][0]
        ).toUpperCase();
    };

    const primaryContact = contacts.find(
        (contact) => contact.primary
    );

    const otherContacts = contacts.filter(
        (contact) => !contact.primary
    );

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
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.title}>
                                Trusted Contacts
                            </Text>
                            <Text style={styles.subtitle}>
                                People who can help keep you safe
                            </Text>
                        </View>

                        <View style={styles.headerIcon}>
                            <Ionicons
                                name="shield-checkmark"
                                size={36}
                                color="#08A96D"
                            />
                        </View>
                    </View>

                    {!authLoaded ? (
                        <View style={styles.emptyCard}>
                            <Text style={styles.emptyTitle}>
                                Checking Sign In...
                            </Text>
                        </View>
                    ) : !userId ? (
                        <View style={styles.emptyCard}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={42}
                                color="#08A96D"
                            />
                            <Text style={styles.emptyTitle}>
                                Sign In to View Contacts
                            </Text>
                            <Text style={styles.emptyText}>
                                Sign in to add and manage your trusted contacts.
                            </Text>
                            <TouchableOpacity
                                style={styles.signInButton}
                                onPress={() => router.push("/(tabs)/Log_in")}
                            >
                                <Text style={styles.signInButtonText}>
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.signUpButton}
                                onPress={() => router.push("/(tabs)/Sign_up")}
                            >
                                <Text style={styles.signUpButtonText}>
                                    Don't have an account? Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : !contactsLoaded ? (
                        <View style={styles.emptyCard}>
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
                                <View style={styles.primaryCard}>
                                    <View style={styles.primaryCardHeader}>
                                        <View style={styles.avatar}>
                                            <Text style={styles.avatarText}>
                                                {getInitials(primaryContact.name)}
                                            </Text>
                                        </View>
                                        <View style={styles.primaryBadge}>
                                            <Ionicons
                                                name="shield-checkmark"
                                                size={16}
                                                color="#08A96D"
                                            />
                                            <Text style={styles.primaryBadgeText}>
                                                Primary
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.contactName}>
                                        {primaryContact.name}
                                    </Text>
                                    <Text style={styles.relationshipText}>
                                        {primaryContact.relationship ||
                                            "Relationship not provided"}
                                    </Text>

                                    <View style={styles.contactDetails}>
                                        <View style={styles.detailRow}>
                                            <Ionicons
                                                name="call-outline"
                                                size={19}
                                                color="#08A96D"
                                            />
                                            <Text style={styles.detailText}>
                                                {primaryContact.phone}
                                            </Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Ionicons
                                                name="mail-outline"
                                                size={19}
                                                color="#08A96D"
                                            />
                                            <Text style={styles.detailText}>
                                                {primaryContact.email}
                                            </Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Ionicons
                                                name={
                                                    primaryContact.emailVerified
                                                        ? "checkmark-circle"
                                                        : "information-circle-outline"
                                                }
                                                size={19}
                                                color={
                                                    primaryContact.emailVerified
                                                        ? "#08A96D"
                                                        : "#F59E0B"
                                                }
                                            />
                                            <Text style={styles.detailText}>
                                                {primaryContact.emailVerified
                                                    ? "Email verified"
                                                    : "Email not verified"}
                                            </Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() => editContact(primaryContact)}
                                    >
                                        <MaterialIcons
                                            name="edit"
                                            size={20}
                                            color="#2563E8"
                                        />
                                        <Text style={styles.editButtonText}>
                                            Edit Contact
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() =>
                                            deleteContact(primaryContact.id)
                                        }
                                    >
                                        <MaterialIcons
                                            name="delete-outline"
                                            size={21}
                                            color="#E53935"
                                        />
                                        <Text style={styles.deleteButtonText}>
                                            Remove Contact
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.emptyCard}>
                                    <Ionicons
                                        name="person-add-outline"
                                        size={42}
                                        color="#08A96D"
                                    />
                                    <Text style={styles.emptyTitle}>
                                        No Primary Contact
                                    </Text>
                                    <Text style={styles.emptyText}>
                                        Add a trusted person and select
                                        "Set as Primary Contact".
                                    </Text>
                                </View>
                            )}

                            {otherContacts.length > 0 && (
                                <View style={styles.otherSection}>
                                    <Text style={styles.sectionLabel}>
                                        OTHER TRUSTED CONTACTS ({otherContacts.length})
                                    </Text>

                                    <View style={styles.otherContactsCard}>
                                        {otherContacts.map((contact, index) => (
                                            <View
                                                key={contact.id}
                                                style={[
                                                    styles.otherContactRow,
                                                    index < otherContacts.length - 1 &&
                                                        styles.contactDivider,
                                                ]}
                                            >
                                                <View style={styles.smallAvatar}>
                                                    <Text style={styles.smallAvatarText}>
                                                        {getInitials(contact.name)}
                                                    </Text>
                                                </View>

                                                <View style={styles.otherContactInfo}>
                                                    <Text style={styles.otherContactName}>
                                                        {contact.name}
                                                    </Text>
                                                    <Text style={styles.otherContactSubtext}>
                                                        {contact.relationship || contact.phone}
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            styles.verificationStatus,
                                                            contact.emailVerified &&
                                                                styles.verifiedStatus,
                                                        ]}
                                                    >
                                                        {contact.emailVerified
                                                            ? "Email verified"
                                                            : "Email not verified"}
                                                    </Text>
                                                </View>

                                                <TouchableOpacity
                                                    style={styles.smallActionButton}
                                                    onPress={() => editContact(contact)}
                                                >
                                                    <MaterialIcons
                                                        name="edit"
                                                        size={20}
                                                        color="#2563E8"
                                                    />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.smallDeleteButton}
                                                    onPress={() =>
                                                        deleteContact(contact.id)
                                                    }
                                                >
                                                    <MaterialIcons
                                                        name="delete-outline"
                                                        size={22}
                                                        color="#E53935"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => {
                                    if (showAddContact) {
                                        finishForm();
                                    } else {
                                        setName("");
                                        setPhone("");
                                        setEmail("");
                                        setRelationship("");
                                        setPrimary(false);
                                        setEmailVerified(false);
                                        setVerificationSent(false);
                                        setEditingContactId(null);
                                        setDraftContactId(null);
                                        setShowAddContact(true);

                                        setTimeout(() => {
                                            scrollViewRef.current?.scrollToEnd({
                                                animated: true,
                                            });
                                        }, 100);
                                    }
                                }}
                            >
                                <Ionicons
                                    name={showAddContact ? "close" : "add"}
                                    size={24}
                                    color="#2563E8"
                                />
                                <Text style={styles.addButtonText}>
                                    {showAddContact
                                        ? "Cancel"
                                        : "Add Trusted Contact"}
                                </Text>
                            </TouchableOpacity>

                            {showAddContact && (
                                <View style={styles.formCard}>
                                    <Text style={styles.formTitle}>
                                        {editingContactId !== null
                                            ? "Edit Contact"
                                            : "Add Trusted Contact"}
                                    </Text>

                                    <Text style={styles.inputLabel}>
                                        Full Name *
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter full name"
                                        placeholderTextColor="#9AA8C0"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                    />

                                    <Text style={styles.inputLabel}>
                                        Phone Number *
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter phone number"
                                        placeholderTextColor="#9AA8C0"
                                        keyboardType="phone-pad"
                                        value={phone}
                                        onChangeText={setPhone}
                                        returnKeyType="next"
                                    />

                                    <Text style={styles.inputLabel}>
                                        Email *
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter email address"
                                        placeholderTextColor="#9AA8C0"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        value={email}
                                        onChangeText={(value) => {
                                            setEmail(value);
                                            setEmailVerified(false);
                                            setVerificationSent(false);
                                        }}
                                        returnKeyType="next"
                                    />

                                    <View style={styles.verificationBox}>
                                        <View style={styles.verificationHeader}>
                                            <Ionicons
                                                name={
                                                    emailVerified
                                                        ? "checkmark-circle"
                                                        : "mail-outline"
                                                }
                                                size={21}
                                                color={
                                                    emailVerified
                                                        ? "#08A96D"
                                                        : "#F59E0B"
                                                }
                                            />
                                            <Text style={styles.verificationTitle}>
                                                Email verification
                                            </Text>
                                        </View>

                                        <Text style={styles.verificationHelp}>
                                            {emailVerified
                                                ? "Supabase has confirmed this email address."
                                                : verificationSent
                                                    ? "Open the verification email first, then check the status."
                                                    : "Verify the email address before saving this trusted contact."}
                                        </Text>

                                        <TouchableOpacity
                                            style={styles.verifyButton}
                                            onPress={requestEmailVerification}
                                        >
                                            <Ionicons
                                                name="mail"
                                                size={18}
                                                color="#FFFFFF"
                                            />
                                            <Text style={styles.verifyButtonText}>
                                                {verificationSent
                                                    ? "Resend Verification Email"
                                                    : "Send Verification Email"}
                                            </Text>
                                        </TouchableOpacity>

                                        {verificationSent && (
                                            <TouchableOpacity
                                                style={[
                                                    styles.verifyButton,
                                                    styles.checkStatusButton,
                                                ]}
                                                disabled={checkingVerification}
                                                onPress={() =>
                                                    checkEmailVerification(
                                                        editingContactId ??
                                                            draftContactId ??
                                                            Date.now(),
                                                        email.trim().toLowerCase()
                                                    )
                                                }
                                            >
                                                <Ionicons
                                                    name="refresh"
                                                    size={18}
                                                    color="#FFFFFF"
                                                />
                                                <Text style={styles.verifyButtonText}>
                                                    {checkingVerification
                                                        ? "Checking..."
                                                        : "Check Verification Status"}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    <Text style={styles.inputLabel}>
                                        Relationship (optional)
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="e.g. Parent, Friend"
                                        placeholderTextColor="#9AA8C0"
                                        value={relationship}
                                        onChangeText={setRelationship}
                                        returnKeyType="done"
                                    />

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
                                                    size={18}
                                                    color="#FFFFFF"
                                                />
                                            )}
                                        </View>

                                        <View style={styles.primaryOptionInfo}>
                                            <Text style={styles.primaryOptionTitle}>
                                                Set as Primary Contact
                                            </Text>
                                            <Text style={styles.primaryOptionDescription}>
                                                Show this person first in your contacts.
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.saveButton,
                                            savingContact && styles.disabledButton,
                                        ]}
                                        disabled={savingContact}
                                        onPress={saveContact}
                                    >
                                        <Ionicons
                                            name="checkmark-circle-outline"
                                            size={22}
                                            color="#FFFFFF"
                                        />
                                        <Text style={styles.saveButtonText}>
                                            {savingContact
                                                ? "Checking Verification..."
                                                : editingContactId !== null
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
        paddingBottom: 35,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    headerTextContainer: {
        flex: 1,
        paddingRight: 12,
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: "#173B8F",
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        color: "#60729E",
        marginTop: 7,
    },
    headerIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#E2FAEF",
        alignItems: "center",
        justifyContent: "center",
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 1,
        color: "#60729E",
        marginBottom: 12,
    },
    primaryCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 25,
        padding: 21,
        borderWidth: 1.5,
        borderColor: "#08B88A",
        shadowColor: "#7898D8",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    primaryCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#E2FAEF",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        fontSize: 23,
        fontWeight: "800",
        color: "#08A96D",
    },
    primaryBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E2FAEF",
        borderRadius: 16,
        paddingHorizontal: 11,
        paddingVertical: 8,
    },
    primaryBadgeText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#08A96D",
        marginLeft: 5,
    },
    contactName: {
        fontSize: 26,
        fontWeight: "800",
        color: "#173B8F",
        marginTop: 17,
    },
    relationshipText: {
        fontSize: 15,
        color: "#08A96D",
        fontWeight: "700",
        marginTop: 4,
    },
    contactDetails: {
        backgroundColor: "#F5FAF8",
        borderRadius: 15,
        padding: 13,
        marginTop: 18,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    detailText: {
        flex: 1,
        fontSize: 14,
        color: "#526487",
        marginLeft: 10,
    },
    editButton: {
        minHeight: 47,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: "#C9D9F8",
        backgroundColor: "#F5F8FF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: "800",
        color: "#2563E8",
        marginLeft: 7,
    },
    deleteButton: {
        minHeight: 45,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: "#F2CCCC",
        backgroundColor: "#FFF8F8",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 9,
    },
    deleteButtonText: {
        fontSize: 14,
        fontWeight: "800",
        color: "#E53935",
        marginLeft: 7,
    },
    emptyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 23,
        padding: 25,
        alignItems: "center",
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#173B8F",
        textAlign: "center",
        marginTop: 12,
    },
    emptyText: {
        fontSize: 14,
        lineHeight: 22,
        textAlign: "center",
        color: "#60729E",
        marginTop: 8,
    },
    signInButton: {
        width: "100%",
        minHeight: 49,
        borderRadius: 13,
        backgroundColor: "#2563E8",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    signInButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "800",
    },
    signUpButton: {
        padding: 13,
    },
    signUpButtonText: {
        color: "#2563E8",
        fontSize: 14,
        fontWeight: "700",
    },
    otherSection: {
        marginTop: 27,
    },
    otherContactsCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingHorizontal: 13,
    },
    otherContactRow: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 83,
        paddingVertical: 10,
    },
    contactDivider: {
        borderBottomWidth: 1,
        borderBottomColor: "#E5EBF4",
    },
    smallAvatar: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: "#F0E5FF",
        alignItems: "center",
        justifyContent: "center",
    },
    smallAvatarText: {
        fontSize: 15,
        fontWeight: "800",
        color: "#8B4DFF",
    },
    otherContactInfo: {
        flex: 1,
        marginLeft: 10,
        marginRight: 5,
    },
    otherContactName: {
        fontSize: 15,
        fontWeight: "800",
        color: "#173B8F",
    },
    otherContactSubtext: {
        fontSize: 12,
        color: "#60729E",
        marginTop: 3,
    },
    verificationStatus: {
        fontSize: 11,
        color: "#60729E",
        marginTop: 4,
    },
    verifiedStatus: {
        color: "#08A96D",
        fontWeight: "700",
    },
    smallActionButton: {
        width: 36,
        height: 38,
        borderRadius: 10,
        backgroundColor: "#EFF5FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 5,
    },
    smallDeleteButton: {
        width: 36,
        height: 38,
        borderRadius: 10,
        backgroundColor: "#FFF2F2",
        alignItems: "center",
        justifyContent: "center",
    },
    addButton: {
        minHeight: 55,
        borderWidth: 1.5,
        borderColor: "#2563E8",
        borderStyle: "dashed",
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 22,
    },
    addButtonText: {
        fontSize: 15,
        fontWeight: "800",
        color: "#2563E8",
        marginLeft: 8,
    },
    formCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 23,
        padding: 20,
        marginTop: 18,
        marginBottom: 20,
        shadowColor: "#7898D8",
        shadowOpacity: 0.08,
        shadowRadius: 9,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "800",
        color: "#173B8F",
        marginTop: 15,
        marginBottom: 8,
    },
    input: {
        minHeight: 51,
        borderWidth: 1,
        borderColor: "#D6E0F0",
        borderRadius: 13,
        paddingHorizontal: 14,
        fontSize: 15,
        color: "#173B8F",
        backgroundColor: "#FBFCFF",
    },
    verificationBox: {
        backgroundColor: "#FFF9E9",
        borderWidth: 1,
        borderColor: "#F5D98C",
        borderRadius: 15,
        padding: 13,
        marginTop: 14,
    },
    verificationHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    verificationTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: "#173B8F",
        marginLeft: 8,
    },
    verificationHelp: {
        fontSize: 12,
        lineHeight: 19,
        color: "#60729E",
        marginTop: 8,
    },
    verifyButton: {
        minHeight: 43,
        borderRadius: 11,
        backgroundColor: "#2563E8",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        paddingHorizontal: 8,
    },
    checkStatusButton: {
        backgroundColor: "#08A96D",
    },
    verifyButtonText: {
        fontSize: 14,
        fontWeight: "800",
        color: "#FFFFFF",
        marginLeft: 8,
        textAlign: "center",
    },
    primaryOption: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 23,
        marginBottom: 20,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: "#B8C7DF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
    },
    checkboxSelected: {
        backgroundColor: "#08A96D",
        borderColor: "#08A96D",
    },
    primaryOptionInfo: {
        flex: 1,
    },
    primaryOptionTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: "#173B8F",
    },
    primaryOptionDescription: {
        fontSize: 12,
        lineHeight: 18,
        color: "#60729E",
        marginTop: 5,
    },
    saveButton: {
        minHeight: 54,
        borderRadius: 14,
        backgroundColor: "#08A96D",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    disabledButton: {
        opacity: 0.65,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#FFFFFF",
        marginLeft: 8,
    },
});
