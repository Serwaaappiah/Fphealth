import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/authContext";
import { useRouter } from "expo-router";
import { Calendar } from 'react-native-calendars';
import axios from "axios"; // For sending notification requests to FCM


const ViewSchedule = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [shifts, setShifts] = useState([]);
    const { user, fetchUserShifts } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log("Selected Date:", selectedDate); // Log selected date
        console.log("User:", user); // Log user
        if (selectedDate && user) {
            fetchUserShifts(selectedDate, user.uid).then((data) => {
                console.log("Fetched Shifts:", data); // Log fetched shifts
                setShifts(data);
            });
        }
    }, [selectedDate, user]);

    const sendNotification = async () => {
        try {
            const response = await axios.post(
                "https://fcm.googleapis.com/fcm/send", // Firebase Cloud Messaging API endpoint
                {
                    to: "/topics/available_shifts", // Target topic
                    notification: {
                        title: "Shift Swap Available!",
                        body: "A new shift is available for swapping.",
                    },
                    data: {
                        shiftDetails: "Provide additional details here if needed.", // Optional custom data
                    },
                },
                {
                    headers: {
                        Authorization: `key=a1d39ba289f636ca19701d71ec5a565e39f502d4`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Notification sent:", response.data);
            Alert.alert("Notification Sent", "All users have been notified about the available shift.");
        } catch (error) {
            console.error("Error sending notification:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to send notification.");
        }
    };

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{ [selectedDate]: { selected: true, selectedColor: '#6200ea' } }}
            />
            
            <FlatList
                data={shifts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.shiftCard}>
                        <Text style={styles.shiftText}>
                            Shift: {item.shiftType ? `${item.shiftType} ${item.startTime} - ${item.endTime}` : "Not Available"}
                        </Text>

                        <TouchableOpacity
                            onPress={sendNotification} // Trigger notification on button press
                            style={styles.swapButton}
                        >
                            <Text style={styles.swapButtonText}>Swap Shift</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            
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
        padding: 16,
        backgroundColor: '#fff',
    },
    shiftCard: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    shiftText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    wardText: {
        fontSize: 14,
        color: '#666',
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
    swapButton: {
        marginTop: 10,
        backgroundColor: '#6200ea',
        padding: 10,
        borderRadius: 5,
    },
    swapButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default ViewSchedule;