import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { DinaryScreen } from '../../../screens'

const DinaryNavigator = () => {

    const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='DinaryScreen' component={DinaryScreen}/>
    </Stack.Navigator>
  )
}

export default DinaryNavigator