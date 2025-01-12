import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ContactsScreen from '../../../screens/contacts/ContactsScreen'

const ContactsNavigator = () => {

    const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='ContactsScreen' component={ContactsScreen}/>
    </Stack.Navigator>
  )
}

export default ContactsNavigator