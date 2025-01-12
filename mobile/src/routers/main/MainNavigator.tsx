import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from '~/routers/bottomTab/TabNavigator'
import SearchScreen from '../../screens/search/SearchScreen'
import { MainStackParamList } from '../types'
import ChatScreen from '../../screens/chat/ChatScreen'
import AddFriendScreen from '../../screens/contacts/AddFriendScreen'
import ProfilePersonalScreen from '~/screens/personal/ProfilePersonalScreen'
import SendAddFriendScreen from '~/screens/relation/SendAddFriendScreen'



const MainNavigator = () => {

  const Stack = createNativeStackNavigator<MainStackParamList>();

  return (
    <Stack.Navigator screenOptions={{animation: 'fade'}}>
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} options={{headerShown: false}}/>
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerShown: false}}/>
      <Stack.Screen name='AddFriendScreen' component={AddFriendScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='ProfilePersonalScreen' component={ProfilePersonalScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='SenAddFriendScreen' component={SendAddFriendScreen} options={{ headerShown: false }}/>

    </Stack.Navigator>
  )
}

export default MainNavigator