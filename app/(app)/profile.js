import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "../../context/authContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");  // Add other fields if needed

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.userId) {
        try {
          const userRef = doc(db, "users", user.userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUsername(userData.username || "");
            setContact(userData.contact || "");
            setEmail(userData.email || "");  // Include other fields
          } else {
            Alert.alert("Error", "User not found in database.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert("Error", "Could not load user data.");
        }
      }
    };

    fetchUserData();
  }, [user?.userId]);

  // Update Firestore when saving
  const handleUpdate = async () => {
    if (!username.trim() || !contact.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const userRef = doc(db, "users", user.userId);
      await updateDoc(userRef, { username, contact });

      setUser((prev) => ({ ...prev, username, contact }));
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username" />
      <TextInput style={styles.input} value={contact} onChangeText={setContact} placeholder="Contact" keyboardType="phone-pad" />
      <TextInput style={styles.input} value={email} editable={false} placeholder="Email" />  {/* Show email but not editable */}
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
     flex: 1,
      padding: 20, 
      backgroundColor: "#E3F2FD",
       justifyContent: "center" },

  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 20 },

  input: { 
    backgroundColor: "#fff", 
    padding: 15, 
    marginBottom: 15, 
    borderRadius: 10 },

  button: { 
    backgroundColor: "#007bff", 
    padding: 15, 
    borderRadius: 10,
     alignItems: "center" },

  buttonText: { 
    color: "#fff",
     fontSize: 18,
     fontWeight: "bold" },
});
