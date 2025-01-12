import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PersonalScreen } from '../../../screens'

const PersonalNavigator = () => {

    const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='PersonalScreen' component={PersonalScreen}/>
    </Stack.Navigator>
  )
}

export default PersonalNavigator