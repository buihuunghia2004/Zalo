import React, { useEffect } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from '~/routers/bottomTab/TabNavigator';
import SearchScreen from '../../screens/search/SearchScreen';
import {MainStackParamList} from '../types';
import ChatScreen from '../../screens/chat/ChatScreen';
import AddFriendScreen from '../../screens/relation/AddFriendScreen';
import ProfilePersonalScreen from '~/screens/personal/ProfilePersonalScreen';
import SendAddFriendScreen from '~/screens/relation/SendAddFriendScreen';
import HandleReqScreen from '~/screens/relation/HandleReqScreen';
import OptionalFriendScreen from '~/screens/relation/OptionalFriendScreen';
import useSocketEvent from '~/hooks/useSocket ';
import {_MessageSentRes} from '~/features/message/dto/message.dto.parent';
import {useRoomStore} from '~/stores/zustand/room.store';
import { useSelector } from 'react-redux';
import { appSelector } from '~/features/app/appSlice';
import { useChatStore } from '~/stores/zustand/chat.store';
const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {

  return (
    <Stack.Navigator screenOptions={{animation: 'fade'}}>
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddFriendScreen"
        component={AddFriendScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfilePersonalScreen"
        component={ProfilePersonalScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SenAddFriendScreen"
        component={SendAddFriendScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HandleReqScreen"
        component={HandleReqScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OptionalFriendScreen"
        component={OptionalFriendScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
