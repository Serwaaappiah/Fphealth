import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc,collection,query,where,getDocs,addDoc} from "firebase/firestore";

export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            console.log('got user:', user);
            if (user) {
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unsub;
    }, []);

    const updateUserData = async (userId) => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let data = docSnap.data();
            setUser((prevUser) => ({
                ...prevUser,
                username: data.username,
                contact: data.contact,
                userId: data.userId,
                email: data.email,
            }));
        }
    }

    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (e) {
            let msg = e.message;
            if (msg.includes('(auth/invalid-email)')) msg = 'Invalid email';
            else if (msg.includes('(auth/invalid-credential)')) msg = 'Wrong credentials';
            else if (msg.includes('(auth/network-request-failed)')) msg = 'Network request failed. Please check your internet connection.';
            return { success: false, msg };
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (e) {
            return { success: false, msg: e.message, error: e };
        }
    }

    const register = async (email, password, username, contact) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('response.user:', response?.user);

            await setDoc(doc(db, "users", response?.user?.uid), {
                username,
                contact,
                userId: response?.user?.uid,
                email: email
            });
            console.log("User details saved");
            return { success: true, data: response };
        } catch (e) {
            let msg = e.message;
            if (msg.includes('(auth/invalid-email)')) msg = 'Invalid email';
            else if (msg.includes('(auth/email-already-in-use)')) msg = 'This email is already in use';
            else if (msg.includes('(auth/network-request-failed)')) msg = 'Network request failed. Please check your internet connection.';
            console.error("Error saving user to Firestore:", e);
            return { success: false, msg };
        }
    }


    //save shift selected in the database
    const saveUserShift = async (userId, shiftId, date, type, time) => {
        try {
            const shiftRef = doc(db, "shifts", shiftId);
    
            console.log("Saving shift with data:", { assignedUser: userId, date, type, time });
    
            // Update shift document to assign the user and save additional data
            await setDoc(
                shiftRef,
                {
                    assignedUser: userId,
                    date,
                    startTime: time.split(" - ")[0], // Extract start time
                    endTime: time.split(" - ")[1], // Extract end time
                    shiftType: type // Save shift type (e.g., Morning, Afternoon, Night)
                },
                { merge: true }
            );
    
            console.log("Shift successfully assigned!");
        } catch (error) {
            console.error("Error saving shift: ", error);
        }
    };

    //function to fetch users shift so that it can be displayed in 
    //view schedule

    const fetchUserShifts = async (date, userId) => {
        try {
            console.log("Fetching shifts for date:", date, "and user:", userId); // Debugging
            
            const shiftsRef = collection(db, "shifts"); // Reference to the "shifts" collection
            const q = query(shiftsRef, 
                where("assignedUser", "==", userId), 
                where("date", "==", date) // Ensure date format matches Firestore
            );
    
            const querySnapshot = await getDocs(q);
            const shifts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
            console.log("Fetched Shifts:", shifts); // Debugging log
    
            return shifts; // Return fetched shifts
        } catch (error) {
            console.error("Error fetching shifts:", error);
            return [];
        }
    };
  
   
    //submit leave request
    const submitLeaveRequest = async (to, subject, message, userId) => {
        try {
            await addDoc(collection(db, 'leaveRequests'), {
                to,
                subject,
                message,
                userId,
                timestamp: new Date(),
            });
            console.log("Leave request submitted successfully");
            return { success: true };
        } catch (error) {
            console.error("Error submitting leave request: ", error);
            return { success: false, msg: error.message };
        }
    };
     
    //submit complaint
    const submitComplaint = async (subject, message, userId) => {
        try {
            await addDoc(collection(db, 'complaints'), {
                subject,
                message,
                userId,
                timestamp: new Date(),
            });
            console.log("Complaint submitted successfully");
            return { success: true };
        } catch (error) {
            console.error("Error submitting complaint: ", error);
            return { success: false, msg: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, saveUserShift,fetchUserShifts ,submitLeaveRequest, submitComplaint}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const value = useContext(AuthContext);

    if (value === undefined) {
        throw new Error('useAuth must be wrapped inside AuthContextProvider');
    }
    return value;
}