import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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

type Contact = {
    id: number;
    name: string;
    phone: string;
    relationship: string;
    email: string;
    primary: boolean;
};

export default function Contacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [showAddContact, setShowAddContact] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [relationship, setRelationship] = useState("");
    const [email, setEmail] = useState("");
    const [primary, setPrimary] = useState(false);

    // Used when editing an existing contact
    const [editingContactId, setEditingContactId] =
        useState<number | null>(null);

    // Detect keyboard
    const [keyboardVisible, setKeyboardVisible] =
        useState(false);

    useEffect(() => {
        const keyboardShowListener =
            Keyboard.addListener(
                "keyboardDidShow",
                () => {
                    setKeyboardVisible(true);
                }
            );

        const keyboardHideListener =
            Keyboard.addListener(
                "keyboardDidHide",
                () => {
                    setKeyboardVisible(false);
                }
            );

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, []);

    /*
     * ADD OR EDIT CONTACT
     */
    const saveContact = () => {
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

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            Alert.alert(
                "Invalid Email",
                "Please enter a valid email address."
            );
            return;
        }

        /*
         * EDIT EXISTING CONTACT
         */
        if (editingContactId !== null) {
            setContacts((currentContacts) => {
                return currentContacts.map((contact) => {
                    if (
                        contact.id !== editingContactId
                    ) {
                        return contact;
                    }

                    return {
                        ...contact,
                        name: name.trim(),
                        phone: phone.trim(),
                        relationship:
                            relationship.trim(),
                        email: email
                            .trim()
                            .toLowerCase(),
                        primary,
                    };
                });
            });

            /*
             * If this contact is being made primary,
             * remove primary status from everyone else.
             */
            if (primary) {
                setContacts((currentContacts) =>
                    currentContacts.map(
                        (contact) => ({
                            ...contact,
                            primary:
                                contact.id ===
                                editingContactId,
                        })
                    )
                );
            }

            finishForm();

            Alert.alert(
                "Contact Updated",
                "The contact details have been updated."
            );

            return;
        }

        /*
         * ADD NEW CONTACT
         */
        const newContact: Contact = {
            id: Date.now(),
            name: name.trim(),
            phone: phone.trim(),
            relationship: relationship.trim(),
            email: email.trim().toLowerCase(),
            primary,
        };

        /*
         * If the new contact is primary,
         * remove primary status from all existing contacts.
         */
        if (primary) {
            setContacts((currentContacts) => [
                ...currentContacts.map(
                    (contact) => ({
                        ...contact,
                        primary: false,
                    })
                ),
                newContact,
            ]);
        } else {
            setContacts((currentContacts) => [
                ...currentContacts,
                newContact,
            ]);
        }

        finishForm();

        Alert.alert(
            "Contact Added",
            "The trusted contact has been added successfully."
        );
    };

    /*
     * RESET FORM
     */
    const finishForm = () => {
        setName("");
        setPhone("");
        setRelationship("");
        setEmail("");
        setPrimary(false);
        setEditingContactId(null);
        setShowAddContact(false);

        Keyboard.dismiss();
    };

    /*
     * START EDITING
     */
    const editContact = (contact: Contact) => {
        setName(contact.name);
        setPhone(contact.phone);
        setRelationship(contact.relationship);
        setEmail(contact.email);
        setPrimary(contact.primary);

        setEditingContactId(contact.id);
        setShowAddContact(true);

        setTimeout(() => {
            // ScrollView will handle moving the form
            // above the keyboard when an input is selected.
        }, 100);
    };

    /*
     * DELETE CONTACT
     */
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
                            (currentContacts) =>
                                currentContacts.filter(
                                    (contact) =>
                                        contact.id !== id
                                )
                        );
                    },
                },
            ]
        );
    };

    /*
     * GET INITIALS
     */
    const getInitials = (name: string) => {
        const words =
            name.trim().split(/\s+/);

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

    /*
     * PRIMARY CONTACT
     *
     * This automatically finds whichever contact
     * has primary === true.
     */
    const primaryContact =
        contacts.find(
            (contact) => contact.primary
        );

    /*
     * EVERYONE ELSE
     */
    const otherContacts =
        contacts.filter(
            (contact) => !contact.primary
        );

    return (
        <SafeAreaView style={styles.container}>

            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : "height"
                }
                keyboardVerticalOffset={
                    Platform.OS === "ios" ? 0 : 20
                }
            >

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={
                        styles.scrollContainer
                    }
                >

                    {/* HEADER */}

                    <View style={styles.header}>

                        <View>
                            <Text style={styles.title}>
                                Trusted Contacts
                            </Text>

                            <Text
                                style={styles.subtitle}
                            >
                                People who can help keep
                                you safe
                            </Text>
                        </View>

                        <View
                            style={styles.headerIcon}
                        >
                            <Ionicons
                                name="shield-checkmark"
                                size={38}
                                color="#08B88A"
                            />
                        </View>

                    </View>

                    {/* PRIMARY CONTACT */}

                    <Text
                        style={styles.sectionLabel}
                    >
                        PRIMARY CONTACT
                    </Text>

                    {primaryContact ? (

                        <View
                            style={
                                styles.emergencyCard
                            }
                        >

                            <View
                                style={
                                    styles.emergencyTop
                                }
                            >

                                <View
                                    style={
                                        styles.emergencyIcon
                                    }
                                >

                                    <Text
                                        style={
                                            styles.emergencyInitials
                                        }
                                    >
                                        {getInitials(
                                            primaryContact.name
                                        )}
                                    </Text>

                                </View>

                                <View
                                    style={
                                        styles.emergencyBadge
                                    }
                                >

                                    <Ionicons
                                        name="shield-checkmark"
                                        size={17}
                                        color="#08A96D"
                                    />

                                    <Text
                                        style={
                                            styles.emergencyBadgeText
                                        }
                                    >
                                        Primary Contact
                                    </Text>

                                </View>

                            </View>

                            <Text
                                style={
                                    styles.emergencyName
                                }
                            >
                                {primaryContact.name}
                            </Text>

                            <Text
                                style={
                                    styles.emergencyRelationship
                                }
                            >
                                {
                                    primaryContact.relationship
                                }
                            </Text>

                            <View
                                style={
                                    styles.emergencyInfo
                                }
                            >

                                <View
                                    style={styles.infoLine}
                                >

                                    <Ionicons
                                        name="call"
                                        size={20}
                                        color="#08A96D"
                                    />

                                    <Text
                                        style={
                                            styles.infoText
                                        }
                                    >
                                        {
                                            primaryContact.phone
                                        }
                                    </Text>

                                </View>

                                <View
                                    style={styles.infoLine}
                                >

                                    <Ionicons
                                        name="mail"
                                        size={20}
                                        color="#08A96D"
                                    />

                                    <Text
                                        style={
                                            styles.infoText
                                        }
                                    >
                                        {
                                            primaryContact.email
                                        }
                                    </Text>

                                </View>

                            </View>

                            {/* EDIT CONTACT */}

                            <TouchableOpacity
                                style={
                                    styles.editContactButton
                                }
                                onPress={() =>
                                    editContact(
                                        primaryContact
                                    )
                                }
                            >

                                <MaterialIcons
                                    name="edit"
                                    size={22}
                                    color="#2563E8"
                                />

                                <Text
                                    style={
                                        styles.editContactText
                                    }
                                >
                                    Edit This Contact
                                </Text>

                            </TouchableOpacity>

                            {/* REMOVE CONTACT */}

                            <TouchableOpacity
                                style={
                                    styles.deleteEmergencyButton
                                }
                                onPress={() =>
                                    deleteContact(
                                        primaryContact.id
                                    )
                                }
                            >

                                <MaterialIcons
                                    name="delete-outline"
                                    size={22}
                                    color="#EF2929"
                                />

                                <Text
                                    style={
                                        styles.deleteEmergencyText
                                    }
                                >
                                    Remove Contact
                                </Text>

                            </TouchableOpacity>

                        </View>

                    ) : (

                        <View
                            style={
                                styles.noEmergencyCard
                            }
                        >

                            <View
                                style={
                                    styles.emptyIcon
                                }
                            >

                                <Ionicons
                                    name="person-add-outline"
                                    size={40}
                                    color="#08B88A"
                                />

                            </View>

                            <Text
                                style={
                                    styles.emptyTitle
                                }
                            >
                                No primary contact
                            </Text>

                            <Text
                                style={
                                    styles.emptyText
                                }
                            >
                                Add a trusted person and
                                select "Set as Primary
                                Contact".
                            </Text>

                        </View>

                    )}

                    {/* OTHER CONTACTS */}

                    {otherContacts.length > 0 && (

                        <View
                            style={
                                styles.otherSection
                            }
                        >

                            <View
                                style={
                                    styles.otherHeader
                                }
                            >

                                <Text
                                    style={
                                        styles.sectionLabel
                                    }
                                >
                                    OTHER TRUSTED CONTACTS
                                </Text>

                                <View
                                    style={
                                        styles.countBadge
                                    }
                                >

                                    <Text
                                        style={
                                            styles.countText
                                        }
                                    >
                                        {
                                            otherContacts.length
                                        }
                                    </Text>

                                </View>

                            </View>

                            <View
                                style={
                                    styles.otherContactsCard
                                }
                            >

                                {otherContacts.map(
                                    (
                                        contact,
                                        index
                                    ) => (

                                        <View
                                            key={
                                                contact.id
                                            }
                                            style={[
                                                styles.otherContact,
                                                index !==
                                                    otherContacts.length -
                                                        1 &&
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
                                                    {
                                                        contact.name
                                                    }
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.otherContactRelationship
                                                    }
                                                >
                                                    {
                                                        contact.relationship
                                                    }
                                                </Text>

                                            </View>

                                            {/* EDIT */}

                                            <TouchableOpacity
                                                style={
                                                    styles.editSmallButton
                                                }
                                                onPress={() =>
                                                    editContact(
                                                        contact
                                                    )
                                                }
                                            >

                                                <MaterialIcons
                                                    name="edit"
                                                    size={21}
                                                    color="#2563E8"
                                                />

                                            </TouchableOpacity>

                                            {/* DELETE */}

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
                                                    size={24}
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

                    <View
                        style={styles.addSection}
                    >

                        <TouchableOpacity
                            style={
                                styles.addOutlineButton
                            }
                            onPress={() => {

                                if (
                                    showAddContact
                                ) {
                                    finishForm();
                                } else {
                                    setShowAddContact(
                                        true
                                    );
                                    setEditingContactId(
                                        null
                                    );
                                }

                            }}
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

                            <Text
                                style={
                                    styles.addOutlineText
                                }
                            >
                                {showAddContact
                                    ? "Cancel"
                                    : "Add Trusted Contact"}
                            </Text>

                        </TouchableOpacity>

                    </View>

                    {/* ADD / EDIT FORM */}

                    {showAddContact && (

                        <View
                            style={styles.formCard}
                        >

                            <Text
                                style={styles.formTitle}
                            >
                                {editingContactId !==
                                null
                                    ? "Edit Contact"
                                    : "Add Trusted Contact"}
                            </Text>

                            {/* NAME */}

                            <Text
                                style={
                                    styles.inputLabel
                                }
                            >
                                Full Name
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Enter full name"
                                placeholderTextColor="#9AA8C0"
                                value={name}
                                onChangeText={setName}
                                returnKeyType="next"
                            />

                            {/* PHONE */}

                            <Text
                                style={
                                    styles.inputLabel
                                }
                            >
                                Phone Number
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

                            {/* RELATIONSHIP */}

                            <Text
                                style={
                                    styles.inputLabel
                                }
                            >
                                Relationship
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Parent, Friend"
                                placeholderTextColor="#9AA8C0"
                                value={relationship}
                                onChangeText={
                                    setRelationship
                                }
                                returnKeyType="next"
                            />

                            {/* EMAIL */}

                            <Text
                                style={
                                    styles.inputLabel
                                }
                            >
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
                                returnKeyType="done"
                            />

                            {/* PRIMARY CHECKBOX */}

                            <TouchableOpacity
                                style={
                                    styles.primaryOption
                                }
                                activeOpacity={0.8}
                                onPress={() =>
                                    setPrimary(
                                        !primary
                                    )
                                }
                            >

                                <View
                                    style={[
                                        styles.checkbox,
                                        primary &&
                                            styles.checkboxSelected,
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

                                <View
                                    style={
                                        styles.primaryOptionText
                                    }
                                >

                                    <Text
                                        style={
                                            styles.primaryOptionTitle
                                        }
                                    >
                                        Set as Primary
                                        Contact
                                    </Text>

                                    <Text
                                        style={
                                            styles.primaryOptionDescription
                                        }
                                    >
                                        This person will
                                        appear at the top
                                        as your primary
                                        contact.
                                    </Text>

                                </View>

                            </TouchableOpacity>

                            {/* SAVE */}

                            <TouchableOpacity
                                style={
                                    styles.saveButton
                                }
                                onPress={
                                    saveContact
                                }
                            >

                                <Ionicons
                                    name={
                                        editingContactId !==
                                        null
                                            ? "checkmark-circle"
                                            : "person-add"
                                    }
                                    size={25}
                                    color="#FFFFFF"
                                />

                                <Text
                                    style={
                                        styles.saveButtonText
                                    }
                                >
                                    {editingContactId !==
                                    null
                                        ? "Save Changes"
                                        : "Save Contact"}
                                </Text>

                            </TouchableOpacity>

                        </View>

                    )}

                </ScrollView>

                {/* BOTTOM NAVIGATION */}

                {!keyboardVisible && (

                    <View
                        style={styles.bottomNav}
                    >

                        {/* HOME */}

                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() =>
                                router.push(
                                    "/(tabs)/Home"
                                )
                            }
                        >

                            <Ionicons
                                name="home"
                                size={32}
                                color="#526487"
                            />

                            <Text
                                style={
                                    styles.navText
                                }
                            >
                                Home
                            </Text>

                        </TouchableOpacity>

                        {/* CHECK IN */}

                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() =>
                                router.push(
                                    "/(tabs)/Check_In"
                                )
                            }
                        >

                            <Ionicons
                                name="shield-checkmark"
                                size={32}
                                color="#2563E8"
                            />

                            <Text
                                style={
                                    styles.navText
                                }
                            >
                                Check In
                            </Text>

                        </TouchableOpacity>

                        {/* CONTACTS */}

                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() =>
                                router.push(
                                    "/(tabs)/Contacts"
                                )
                            }
                        >

                            <View
                                style={
                                    styles.activeLine
                                }
                            />

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
                                router.push(
                                    "/(tabs)/History"
                                )
                            }
                        >

                            <MaterialIcons
                                name="history"
                                size={34}
                                color="#F59E0B"
                            />

                            <Text
                                style={
                                    styles.navText
                                }
                            >
                                History
                            </Text>

                        </TouchableOpacity>

                        {/* SETTINGS */}

                        <TouchableOpacity
                            style={styles.navItem}
                            onPress={() =>
                                router.push(
                                    "/(tabs)/Settings"
                                )
                            }
                        >

                            <Ionicons
                                name="settings"
                                size={32}
                                color="#7C3AED"
                            />

                            <Text
                                style={
                                    styles.navText
                                }
                            >
                                Settings
                            </Text>

                        </TouchableOpacity>

                    </View>

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

    /* PRIMARY CONTACT */

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

    /* EDIT PRIMARY */

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

    /* REMOVE PRIMARY */

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

    /* EMPTY PRIMARY */

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

    /* SMALL EDIT */

    editSmallButton: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: "#EFF5FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },

    /* SMALL DELETE */

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

        shadowColor: "#7898D8",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 3,
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

    /* PRIMARY CHECKBOX */

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

    primaryOptionTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: "#173B8F",
    },

    primaryOptionDescription: {
        fontSize: 13,
        lineHeight: 19,
        color: "#60729E",
        marginTop: 3,
    },

    /* SAVE */

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
        alignItems: