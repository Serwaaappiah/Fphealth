import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from "react-native";
import { useAuth } from "../../context/authContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { format } from "date-fns";

const Home = () => {
  const { logout, user } = useAuth();
  const router = useRouter();
  const todayDate = format(new Date(), "EEEE, MMM dd yyyy");

  const menuItems = [
    { id: "1", title: "View Schedule", icon: "calendar-outline", route: "/view_schedule" },
    { id: "2", title: "Submit Leave Request", icon: "chatbubble-ellipses-outline", route: "/submit_leave" },
    { id: "3", title: "Choose Shift", icon: "time-outline", route: "/select_shift" },
    { id: "4", title: "Report Complaint", icon: "warning-outline", route: "/report" },
    { id: "5", title: "Swap Shift", icon: "swap-horizontal-outline", route: "/shift_swap" }

  ];
  
   
  //handle logout process
  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      router.replace('/signIn');
    } else {
      Alert.alert('Logout Failed', response.msg);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning</Text>
        <Text style={styles.date}>{todayDate}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons padding  name="log-out-outline" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.profileImage} />
        <View>
          <Text style={styles.userName}>{user?.username || "User"}</Text>
          <Text style={styles.userSubtitle}>Manage your shifts with ease</Text>
        </View>
      </View>

      {/* Menu List */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push(item.route)}>
            <Ionicons name={item.icon} size={24} color="#007bff" style={styles.menuIcon} />
            <Text style={styles.menuText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
      />

      {/* Floating Action Button */}
      {/*<TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>}*/}

      {/* Bottom Navigation Bar */}
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
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#007bff",
    padding: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  date: {
    fontSize: 14,
    color: "white",
  },

  logoutButton: {
    position: "absolute",
    right: 20, // Moves it to the right
    top: 60,  // Adjust based on spacing
  },
  
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userSubtitle: {
    fontSize: 14,
    color: "gray",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  navItem: {
    alignItems: "center",
  },
});
