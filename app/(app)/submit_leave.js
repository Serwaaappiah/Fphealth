import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from "../../context/authContext";
import { useRouter } from "expo-router";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";

const LeaveRequestPage = () => {
    const router = useRouter();
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const { user, submitLeaveRequest } = useAuth();

    const handleSubmit = async () => {
        if (!user) {
            alert("You need to be logged in to submit a leave request");
            return;
        }
        const response = await submitLeaveRequest(to, subject, message, user.uid);
        if (response.success) {
            setTo('');
            setSubject('');
            setMessage('');
            alert('Leave request submitted successfully');
        } else {
            alert(response.msg);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <TextInput
                    style={styles.input}
                    value={to}
                    onChangeText={setTo}
                    keyboardType="email-address"
                    placeholder="To"
                />
                <TextInput
                    style={styles.input}
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="Subject"
                />
                <TextInput
                    style={styles.messageInput}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={4}
                    placeholder="Compose your message"
                />
                <View style={styles.toolbar}>
                    <FontAwesome name="paperclip" size={20} color="gray" />
                    <MaterialIcons name="format-bold" size={20} color="gray" />
                    <MaterialIcons name="emoji-emotions" size={20} color="gray" />
                </View>
                <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottomNav}>
                            <TouchableOpacity onPress={() => router.push("/home")} style={styles.navItem}>
                                <Ionicons name="home-outline" size={24} color="#007bff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push("/notifications")} style={styles.navItem}>
                                <Ionicons name="notifications-outline" size={24} color="#007bff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push("/profile")} style={styles.navItem}>
                                <Ionicons name="person-outline" size={24} color="#007bff" />
                            </ TouchableOpacity>
                        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    innerContainer: {
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
        paddingBottom:50,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    messageInput: {
        width: '100%',
        height: 100,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        textAlignVertical: 'top',
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 15,
    },
    sendButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "white",
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default LeaveRequestPage;
