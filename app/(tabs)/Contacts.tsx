import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

    const router = useRouter();

    const [showAddContact, setShowAddContact] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [relationship, setRelationship] = useState("");
    const [email, setEmail] = useState("");

    const [contacts, setContacts] = useState<Contact[]>([]);

    const addContact = () => {

        if (name.trim() === "" || phone.trim() === "") {
            return;
        }

        const newContact: Contact = {
            id: Date.now(),
            name: name.trim(),
            phone: phone.trim(),
            relationship: relationship.trim(),
            email: email.trim(),
        };

        setContacts([...contacts, newContact]);

        setName("");
        setPhone("");
        setRelationship("");
        setEmail("");

        setShowAddContact(false);
    };

    const deleteContact = (id: number) => {

        setContacts(
            contacts.filter((contact) => contact.id !== id)
        );
    };

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >

                {/* Back Button */}

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={30}
                        color="#2563E8"
                    />
                </TouchableOpacity>


                {/* Page Title */}

                <Text style={styles.title}>
                    Contacts
                </Text>


                {/* Introduction */}

                <View style={styles.introContainer}>

                    <View style={styles.introTextContainer}>

                        <Text style={styles.mainHeading}>
                            Your Trusted Contacts
                        </Text>

                        <Text style={styles.subtitle}>
                            Add and manage the people who will
                            {"\n"}
                            be alerted in case of an emergency.
                        </Text>

                    </View>


                    <View style={styles.contactIcon}>

                        <Ionicons
                            name="person-add"
                            size={48}
                            color="#2563E8"
                        />

                    </View>

                </View>


                {/* Add Contact Button */}

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                        setShowAddContact(!showAddContact)
                    }
                >

                    <Text style={styles.addButtonText}>
                        Add New Contact
                    </Text>

                    <View style={styles.plusCircle}>

                        <Ionicons
                            name={
                                showAddContact
                                    ? "remove"
                                    : "add"
                            }
                            size={28}
                            color="#FFFFFF"
                        />

                    </View>

                </TouchableOpacity>


                {/* Add Contact Form */}

                {showAddContact && (

                    <View style={styles.addForm}>

                        <View style={styles.dragHandle} />

                        <Text style={styles.formTitle}>
                            Add New Contact
                        </Text>


                        <Text style={styles.label}>
                            Name
                        </Text>

                        <TextInput
                            style={styles.formInput}
                            placeholder="Enter contact name"
                            placeholderTextColor="#8092BC"
                            value={name}
                            onChangeText={setName}
                        />


                        <Text style={styles.label}>
                            Phone Number
                        </Text>

                        <TextInput
                            style={styles.formInput}
                            placeholder="02X XXX XXXX"
                            placeholderTextColor="#8092BC"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />


                        <Text style={styles.label}>
                            Relationship (optional)
                        </Text>

                        <TextInput
                            style={styles.formInput}
                            placeholder="e.g. Parent, Friend, Sibling"
                            placeholderTextColor="#8092BC"
                            value={relationship}
                            onChangeText={setRelationship}
                        />


                        <Text style={styles.label}>
                            Email (optional)
                        </Text>

                        <TextInput
                            style={styles.formInput}
                            placeholder="e.g. email@example.com"
                            placeholderTextColor="#8092BC"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />


                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={addContact}
                        >

                            <Text style={styles.saveButtonText}>
                                Save Contact
                            </Text>

                        </TouchableOpacity>

                    </View>

                )}


                {/* Contacts Heading */}

                {contacts.length > 0 && (

                    <Text style={styles.contactsHeading}>
                        Your Contacts
                    </Text>

                )}


                {/* Contact Cards */}

                {contacts.map((contact) => (

                    <View
                        key={contact.id}
                        style={styles.contactCard}
                    >

                        <View style={styles.contactBadge}>

                            <Ionicons
                                name="person"
                                size={28}
                                color="#2563E8"
                            />

                        </View>


                        <View style={styles.contactInfo}>

                            <Text style={styles.contactName}>
                                {contact.name}
                            </Text>

                            <Text style={styles.contactPhone}>
                                {contact.phone}
                            </Text>

                            {contact.relationship !== "" && (

                                <Text style={styles.relationship}>
                                    {contact.relationship}
                                </Text>

                            )}

                        </View>


                        <TouchableOpacity
                            style={styles.messageButton}
                        >

                            <Ionicons
                                name="chatbubble"
                                size={21}
                                color="#2563E8"
                            />

                        </TouchableOpacity>


                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() =>
                                deleteContact(contact.id)
                            }
                        >

                            <MaterialIcons
                                name="delete"
                                size={21}
                                color="#FFFFFF"
                            />

                        </TouchableOpacity>

                    </View>

                ))}


                {/* Bottom Navigation */}

                <View style={styles.bottomNav}>

                    {/* Home */}

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


                    {/* Check In */}

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


                    {/* Contacts - Active */}

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


                    {/* History */}

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


                    {/* Settings */}

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

            </ScrollView>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F5F8FD",
    },

    scrollContainer: {
        paddingHorizontal: 25,
        paddingTop: 15,
        paddingBottom: 30,
    },


    /* Back Button */

    backButton: {
        marginBottom: 10,
        alignSelf: "flex-start",
    },


    /* Title */

    title: {
        fontSize: 34,
        fontWeight: "800",
        color: "#2563E8",
        textAlign: "center",
        marginBottom: 35,
    },


    /* Introduction */

    introContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
    },

    introTextContainer: {
        flex: 1,
    },

    mainHeading: {
        fontSize: 25,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 16,
        lineHeight: 25,
        color: "#60729E",
    },

    contactIcon: {
        width: 95,
        height: 95,
        borderRadius: 50,
        backgroundColor: "#EDF4FF",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },


    /* Add Contact Button */

    addButton: {
        height: 78,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 22,
        marginBottom: 12,

        shadowColor: "#7EA7EF",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    addButtonText: {
        fontSize: 21,
        fontWeight: "700",
        color: "#173B8F",
    },

    plusCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#2563E8",
        justifyContent: "center",
        alignItems: "center",
    },


    /* Add Contact Form */

    addForm: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 22,
        marginBottom: 30,

        shadowColor: "#7EA7EF",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 5,
    },

    dragHandle: {
        width: 48,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#CCD5E8",
        alignSelf: "center",
        marginBottom: 20,
    },

    formTitle: {
        fontSize: 23,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 20,
    },

    label: {
        fontSize: 15,
        fontWeight: "700",
        color: "#60729E",
        marginBottom: 7,
    },

    formInput: {
        height: 55,
        borderWidth: 1,
        borderColor: "#D6E0F3",
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#243F80",
        marginBottom: 17,
        backgroundColor: "#FBFCFF",
    },


    /* Save Button */

    saveButton: {
        height: 57,
        borderRadius: 15,
        backgroundColor: "#2563E8",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
    },

    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },


    /* Contacts */

    contactsHeading: {
        fontSize: 21,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 14,
    },

    contactCard: {
        minHeight: 88,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 13,

        shadowColor: "#7EA7EF",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 4,
    },

    contactBadge: {
        width: 55,
        height: 55,
        borderRadius: 30,
        backgroundColor: "#E7F0FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    contactInfo: {
        flex: 1,
    },

    contactName: {
        fontSize: 17,
        fontWeight: "800",
        color: "#173B8F",
        marginBottom: 4,
    },

    contactPhone: {
        fontSize: 15,
        color: "#60729E",
    },

    relationship: {
        fontSize: 13,
        color: "#8A9ABD",
        marginTop: 3,
    },

    messageButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#EDF4FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },

    deleteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E53935",
        justifyContent: "center",
        alignItems: "center",
    },


    /* Bottom Navigation */

    bottomNav: {
        height: 94,
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: 25,
        marginBottom: 10,

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