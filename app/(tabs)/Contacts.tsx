import { Ionicons, MaterialIcons } from "@expo/vectoricons";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";

type Contact = {
    id: number;
    name: string;
    phone: string;
    relationship: string;
    email: string;
};

export default function Contacts () {
    const [showAddContact, setShowAddCintact] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [relationship, setRelationship] = useState("");
    const [email, setEmail] = useState("");

    const [contacts, setContacts] = useState<Contact[]>([]);

    const addContact = () => {
        if (name.trim() === "" || phone.trim() === "") {
        }

        const newContact: Contact = {
            id: Date.now()
            name: name.trim()
            phone: phone.trim()
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

    const deleteContact = (id: number) ==> {
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

                <TouchableOpacity style={styles.backButton}>
                    <Ionicons
                        name="arrow-back"
                        size={30}
                        color="#2563E8"
                    />
                </TouchableOpacity>

                <Text style={styles.title}>
                    Contacts
                </Text>


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

                        <Text style={style.label}>
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
                            
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}
}