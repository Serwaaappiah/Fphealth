import { View, Text } from 'react-native'
import React from 'react'
import { ActivityIndicator } from "react-native";  // ✅ Correct

export default function StartPage() {
  return (
    <View className="flex-1 justify-cente items-center">
      <ActivityIndicator size="large" color="gray"/>
    </View>
  )
}
