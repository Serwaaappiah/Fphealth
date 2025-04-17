import { Alert, View, Text, Image, TextInput, TouchableOpacity,Pressable } from 'react-native';
import React, { useState, useRef } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/authContext';

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
      if (!emailRef.current || !passwordRef.current) {
        Alert.alert('Sign In', "Please fill all the fields!");
        return;
      }

      setLoading(true);
      const response = await login(emailRef.current, passwordRef.current);
      setLoading(false);
      console.log('sign in response:', response);
      if (!response.success) {
        Alert.alert('Sign In', response.msg);
        return;
      }
      // Login process
  }

  return (
    <CustomKeyboardView>
      <StatusBar style='dark'/>
      <View style={{ paddingTop: hp(7), paddingHorizontal: wp(5) }} className="flex-1 gap-12" >
       {/*signIn Image*/}
       <View className="items-center">
        <Image style={{ height: hp(30) }} resizeMode='contain' source={require('../assets/images/loginImage.jpg')} />
       </View>

       <View className="gap-10">
        <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutra-800" >Sign In</Text>
          {/*inputs*/}
          <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
            <Octicons name="mail" size={hp(2.7)} color="gray" />
            <TextInput
              onChangeText={value => emailRef.current = value}
              style={{ fontSize: hp(2) }}
              className="flex-1 font-semibold text-neutral-700"
              placeholder="Email Address"
              placeholderTextColor={'gray'}
            />
          </View>

          <View style={{ height: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
            <Octicons name="lock" size={hp(2.7)} color="gray" />
            <TextInput
              onChangeText={value => passwordRef.current = value}
              style={{ fontSize: hp(2) }}
              className="flex-1 font-semibold text-neutral-700"
              placeholder="Password"
              secureTextEntry // secure password by encrypting it
              placeholderTextColor={'gray'}
            />
          </View>

          {/**submit button */}
          <View>
            {loading ? (
              <View className="flex-row justify-center">
                <Loading size={hp(6.5)} />
              </View>
            ) : (
              <TouchableOpacity onPress={handleLogin} style={{ height: hp(6.5) }} className="bg-indigo-500 rounded-xl justify-center items-center">
                <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                  Sign In
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/**sign up text */}
          <View className="flex-row justify-center">
            <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">Don't have an account?</Text>
            <Pressable onPress={() => router.push('signUp')}> 
              <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-indigo-500">Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  )
}