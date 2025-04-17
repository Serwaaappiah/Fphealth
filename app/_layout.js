import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Slot, useSegments,useRouter } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "../global.css";
import { AuthContextProvider,useAuth } from '../context/authContext';
import { subscribeToTopic } from '../firebaseConfig';
const MainLayout=()=>{
    const{isAuthenticated}=useAuth();
    const segments=useSegments();
    const router=useRouter();


    useEffect(()=>{
//check if the user is authenticated or not
     if(typeof isAuthenticated=='undefined')return;
     const inApp=segments[0]=='(app)';
     if(isAuthenticated && !inApp){
        //redirect to home
        router.replace('home');
     }else if(isAuthenticated==false){
        //redirect the user to sign in page
        router.replace('signIn');

     }
    },[isAuthenticated])

    useEffect(() => {
        const setupNotifications = async () => {
          await subscribeToTopic("available_shifts"); // Subscribe to the topic
        };
    
        setupNotifications();
      }, []);
    

    return<Slot/>
}

export default function Rootlayout() {
   return (
       <GestureHandlerRootView style={{ flex: 1 }}>
           <AuthContextProvider>
               <MainLayout />
           </AuthContextProvider>
       </GestureHandlerRootView>
   );
}

