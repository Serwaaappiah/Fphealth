import { View, Text } from 'react-native'
import React from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Platform } from 'react-native';


const ios=Platform.OS=='ios';
export default function CustomKeyboardView({children}) {
  return (
    <KeyboardAvoidingView
      behavior={ios?'padding':'height'}
      style={{flex:1}}
     >
        <ScrollView
         style={{flex:1}}
         bounces={false}
         showsVerticalScrollIndicator={false}
         >
            {
             children
            }
        </ScrollView>
    </KeyboardAvoidingView>
  )
}