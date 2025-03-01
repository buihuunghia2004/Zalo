import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import  HomeScreen  from '../../../screens/home/HomeScreen'
import { _MessageSentRes } from '~/features/message/dto/message.dto.parent';

const HomeNavigator = () => {
    const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator screenOptions={{headerShown: false }} >
      <Stack.Screen name='HomeScreen' component={HomeScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}

export default HomeNavigator