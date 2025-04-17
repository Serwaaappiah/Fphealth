import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { Calendar } from "react-native-calendars";
import { useAuth } from "../../context/authContext";

// Shift options with colors
const shifts = [
  { id: "1", type: "Morning Shift", time: "08:00am - 12:00pm", color: "#D6F5D6" },
  { id: "2", type: "Afternoon Shift", time: "12:00pm - 04:00pm", color: "#C5E3F6" },
  { id: "3", type: "Night Shift", time: "08:00pm - 06:00am", color: "#F6C5C5" },
];

export default function ChooseShiftScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const router = useRouter();
  
  const { user, saveUserShift } = useAuth(); // Destructure user and saveUserShift from useAuth

  const handleShiftSelection = (shiftId) => {
    setSelectedShift(shiftId);
  };

  const handleSubmit = () => {
    if (selectedDate && selectedShift) {
        if (user) {
            const selectedShiftDetails = shifts.find(shift => shift.id === selectedShift);
            const selectedTime = selectedShiftDetails ? selectedShiftDetails.time : null;
            const selectedType = selectedShiftDetails ? selectedShiftDetails.type : null;

            saveUserShift(user.uid, selectedShift, selectedDate, selectedType, selectedTime);
            Alert.alert("Success", "Shift saved successfully!");
        } else {
            Alert.alert("Error", "User not authenticated.");
        }
    } else {
        Alert.alert("Error", "Please select a date and a shift.");
    }
};


  return (
    <View style={styles.container}>
      {/* Header */}
    
      
      {/* Calendar View */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: '#6200ea' } } : {}}
        theme={{
          todayTextColor: '#6200ea',
          arrowColor: '#6200ea',
        }}
      />
      
      {/* Shift Options */}
      {selectedDate && (
        <>
          <Text style={styles.subHeader}>Select Your Shift for {selectedDate}</Text>
          <FlatList
            data={shifts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.shiftCard,
                  { backgroundColor: item.color },
                  selectedShift === item.id && styles.selectedShift
                ]}
                onPress={() => handleShiftSelection(item.id)}
              >
                <Text style={styles.shiftTitle}>{item.type}</Text>
                <Text style={styles.shiftTime}>{item.time}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </>
           
      )}

      {/** navigation bottom */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/home")} style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/notifications")} style={styles.navItem}>
          <Ionicons name="notifications-outline" size={24} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/profile")} style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
    </View>
    
    
  );
}

// Styles for easier modification
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    paddingBottom: 60, // Added padding to avoid overlap with bottom navigation
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    textAlign: "center",
  },
  shiftCard: {
    padding: 9,
    marginVertical: 4,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  selectedShift: {
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  shiftTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  shiftTime: {
    fontSize: 14,
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#3b82f6", 
    paddingVertical: 20,  // Adjusts height of the button
    paddingHorizontal: 30, // Adjusts width of the button
    borderRadius: 10, 
    alignSelf: "center", // Ensures it's centered
    marginTop: 16,
},
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute", // Ensures it stays at the bottom
    bottom: 0, // Aligns it to the bottom of the screen
    left: 0,
    right: 0,
  },
  

  navItem: {
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign:"center",
  },
});