import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Contact = {
    id: number;
    name: string;
    phone: string;
    relationship: string;
    email: string;
};

export default function Contacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [showAddContact, setShowAddContact] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [relationship, setRelationship] = useState("");
    const [email, setEmail] = useState("");

    const addContact = () => {
        // Check that all fields are filled in
        if (
            !name.trim() ||
            !phone.trim() ||
            !relationship.trim() ||
            !email.trim()
        ) {
            Alert.alert(
                "Missing Information",
                "Please fill in all contact details."
            );
            return;
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            Alert.alert(
                "Invalid Email",
                "Please enter a valid email address, such as example@email.com."
            );
            return;
        }

        const newContact: Contact = {
            id: Date.now(),
            name: name.trim(),
            phone: phone.trim(),
            relationship: relationship.trim(),
            email: email.trim().toLowerCase(),
        };

        setContacts([...contacts, newContact]);

        // Clear form
        setName("");
        setPhone("");
        setRelationship("");
        setEmail("");

        setShowAddContact(false);

        Alert.alert(
            "Contact Added",
            "The trusted contact has been added successfully."
        );
    };

    const deleteContact = (id: number) => {
        Alert.alert(
            "Delete Contact",
            "Are you sure you want to remove this contact?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setContacts(
                            contacts.filter(
                                (contact) => contact.id !== id
                            )
                        );
                    },
                },
            ]
        );
    };

    const getInitials = (name: string) => {
        const words = name.trim().split(/\s+/);

        if (words.length === 1) {
            return words[0]
                .substring(0, 2)
                .toUpperCase();
        }

        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase();
    };

    const emergencyContact = contacts[0];
    const otherContacts = contacts.slice(1);

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >

                {/* HEADER */}

                <View style={styles.header}>

                    <View>
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
                            size={38}
                            color="#08B88A"
                        />
                    </View>

                </View>

                {/* EMERGENCY CONTACT */}

                <Text style={styles.sectionLabel}>
                    EMERGENCY CONTACT
                </Text>

                {emergencyContact ? (

                    <View style={styles.emergencyCard}>

                        <View style={styles.emergencyTop}>

                            <View style={styles.emergencyIcon}>

                                <Text
                                    style={styles.emergencyInitials}
                                >
                                    {getInitials(
                                        emergencyContact.name
                                    )}
                                </Text>

                            </View>

                            <View style={styles.emergencyBadge}>

                                <Ionicons
                                    name="shield-checkmark"
                                    size={17}
                                    color="#08A96D"
                                />

                                <Text
                                    style={styles.emergencyBadgeText}
                                >
                                    Primary Contact
                                </Text>

                            </View>

                        </View>

                        <Text style={styles.emergencyName}>
                            {emergencyContact.name}
                        </Text>

                        <Text style={styles.emergencyRelationship}>
                            {emergencyContact.relationship}
                        </Text>

                        <View style={styles.emergencyInfo}>

                            <View style={styles.infoLine}>

                                <Ionicons
                                    name="call"
                                    size={20}
                                    color="#08A96D"
                                />

                                <Text style={styles.infoText}>
                                    {emergencyContact.phone}
                                </Text>

                            </View>

                            <View style={styles.infoLine}>

                                <Ionicons
                                    name="mail"
                                    size={20}
                                    color="#08A96D"
                                />

                                <Text style={styles.infoText}>
                                    {emergencyContact.email}
                                </Text>

                            </View>

                        </View>

                        <TouchableOpacity
                            style={styles.deleteEmergencyButton}
                            onPress={() =>
                                deleteContact(
                                    emergencyContact.id
                                )
                            }
                        >

                            <MaterialIcons
                                name="delete-outline"
                                size={22}
                                color="#EF2929"
                            />

                            <Text
                                style={styles.deleteEmergencyText}
                            >
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
                            No emergency contact
                        </Text>

                        <Text style={styles.emptyText}>
                            Add a trusted person to receive
                            alerts if you miss a check-in.
                        </Text>

                    </View>

                )}

                {/* OTHER CONTACTS */}

                {contacts.length > 1 && (

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

                            {otherContacts.map(
                                (contact, index) => (

                                    <View
                                        key={contact.id}
                                        style={[
                                            styles.otherContact,
                                            index !==
                                                otherContacts.length - 1 &&
                                                styles.contactDivider,
                                        ]}
                                    >

                                        <View
                                            style={
                                                styles.smallInitial
                                            }
                                        >

                                            <Text
                                                style={
                                                    styles.smallInitialText
                                                }
                                            >
                                                {getInitials(
                                                    contact.name
                                                )}
                                            </Text>

                                        </View>

                                        <View
                                            style={
                                                styles.otherContactInfo
                                            }
                                        >

                                            <Text
                                                style={
                                                    styles.otherContactName
                                                }
                                            >
                                                {contact.name}
                                            </Text>

                                            <Text
                                                style={
                                                    styles.otherContactRelationship
                                                }
                                            >
                                                {contact.relationship}
                                            </Text>

                                        </View>

                                        <TouchableOpacity
                                            style={
                                                styles.deleteSmallButton
                                            }
                                            onPress={() =>
                                                deleteContact(
                                                    contact.id
                                                )
                                            }
                                        >

                                            <MaterialIcons
                                                name="delete-outline"
                                                size={25}
                                                color="#EF2929"
                                            />

                                        </TouchableOpacity>

                                    </View>

                                )
                            )}

                        </View>

                    </View>

                )}

                {/* ADD CONTACT BUTTON */}

                <View style={styles.addSection}>

                    <TouchableOpacity
                        style={styles.addOutlineButton}
                        onPress={() =>
                            setShowAddContact(
                                !showAddContact
                            )
                        }
                    >

                        <Ionicons
                            name={
                                showAddContact
                                    ? "close"
                                    : "add"
                            }
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

                {/* ADD CONTACT FORM */}

                {showAddContact && (

                    <View style={styles.formCard}>

                        <Text style={styles.formTitle}>
                            Add Trusted Contact
                        </Text>

                        {/* NAME */}

                        <Text style={styles.inputLabel}>
                            Full Name
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter full name"
                            placeholderTextColor="#9AA8C0"
                            value={name}
                            onChangeText={setName}
                        />

                        {/* PHONE */}

                        <Text style={styles.inputLabel}>
                            Phone Number
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter phone number"
                            placeholderTextColor="#9AA8C0"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />

                        {/* RELATIONSHIP */}

                        <Text style={styles.inputLabel}>
                            Relationship
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Parent, Friend"
                            placeholderTextColor="#9AA8C0"
                            value={relationship}
                            onChangeText={setRelationship}
                        />

                        {/* EMAIL */}

                        <Text style={styles.inputLabel}>
                            Email
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter email address"
                            placeholderTextColor="#9AA8C0"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={email}
                            onChangeText={setEmail}
                        />

                        {/* SAVE */}

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={addContact}
                        >

                            <Ionicons
                                name="checkmark-circle"
                                size={25}
                                color="#FFFFFF"
                            />

                            <Text style={styles.saveButtonText}>
                                Save Contact
                            </Text>

                        </TouchableOpacity>

                    </View>

                )}

            </ScrollView>

            {/* BOTTOM NAVIGATION */}

            <View style={styles.bottomNav}>

                {/* HOME */}

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() =>
                        router.push("/(tabs)/Home")
                    }
                >

                    <Ionicons
                        name="home"
                        size={32}
                        color="#526487"
                    />

                    <Text style={styles.navText}>
                        Home
                    </Text>

                </TouchableOpacity>

                {/* CHECK IN */}

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() =>
                        router.push("/(tabs)/Check_In")
                    }
                >

                    <Ionicons
                        name="shield-checkmark"
                        size={32}
                        color="#2563E8"
                    />

                    <Text style={styles.navText}>
                        Check In
                    </Text>

                </TouchableOpacity>

                {/* CONTACTS */}

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() =>
                        router.push("/(tabs)/Contacts")
                    }
                >

                    <View style={styles.activeLine} />

                    <Ionicons
                        name="people"
                        size={32}
                        color="#08B88A"
                    />

                    <Text
                        style={[
                            styles.navText,
                            styles.activeText,
                        ]}
                    >
                        Contacts
                    </Text>

                </TouchableOpacity>

                {/* HISTORY */}

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() =>
                        router.push("/(tabs)/History")
                    }
                >

                    <MaterialIcons
                        name="history"
                        size={34}
                        color="#F59E0B"
                    />

                    <Text style={styles.navText}>
                        History
                    </Text>

                </TouchableOpacity>

                {/* SETTINGS */}

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() =>
                        router.push("/(tabs)/Settings")
                    }
                >

                    <Ionicons
                        name="settings"
                        size={32}
                        color="#7C3AED"
                    />

                    <Text style={styles.navText}>
                        Settings
                    </Text>

                </TouchableOpacity>

            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F5F8FF",
    },

    scrollContainer: {
        paddingHorizontal: 22,
        paddingTop: 20,
        paddingBottom: 125,
    },

    /* HEADER */

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

    /* SECTION LABEL */

    sectionLabel: {
        fontSize: 13,
        fontWeight: "800",
        letterSpacing: 1,
        color: "#60729E",
        marginBottom: 12,
    },

    /* EMERGENCY CONTACT */

    emergencyCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 28,
        padding: 24,
        borderWidth: 2,
        borderColor: "#08B88A",

        shadowColor: "#7898D8",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

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

    deleteEmergencyButton: {
        height: 48,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#F2CACA",
        backgroundColor: "#FFF8F8",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 18,
    },

    deleteEmergencyText: {
        color: "#EF2929",
        fontSize: 15,
        fontWeight: "800",
        marginLeft: 7,
    },

    /* EMPTY STATE */

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
    },

    emptyText: {
        fontSize: 15,
        lineHeight: 23,
        textAlign: "center",
        color: "#60729E",
        marginTop: 8,
    },

    /* OTHER CONTACTS */

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

    deleteSmallButton: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: "#FFF2F2",
        alignItems: "center",
        justifyContent: "center",
    },

    /* ADD CONTACT */

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

    /* FORM */

    formCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 22,
        marginTop: 18,
    },

    formTitle: {
        fontSize: 23,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 20,
    },

    inputLabel: {
        fontSize: 15,
        fontWeight: "700",
        color: "#526487",
        marginBottom: 7,
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

    /* BOTTOM NAVIGATION */

    bottomNav: {
        position: "absolute",
        bottom: 10,
        left: 15,
        right: 15,
        height: 94,
        backgroundColor: "#FFFFFF",
        borderRadius: 26,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",

        shadowColor: "#7898DB",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 6,
    },

    navItem: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    navText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#526487",
        marginTop: 5,
    },

    activeText: {
        color: "#08B88A",
        fontWeight: "800",
    },

    activeLine: {
        position: "absolute",
        top: 0,
        width: 55,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#08B88A",
    },
});