import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import  HomeScreen  from '../../../screens/home/HomeScreen'
import { useSelector } from 'react-redux';
import { appSelector } from '~/features/app/appSlice';
import { useRoomStore } from '~/stores/zustand/room.store';
import { useChatStore } from '~/stores/zustand/chat.store';
import { _MessageSentRes } from '~/features/message/dto/message.dto.parent';
import useSocketEvent from '~/hooks/useSocket ';

const HomeNavigator = () => {
    const {currentRoomId} = useSelector(appSelector);
    const {receiveNewMessage} = useRoomStore();
    const {addMessage} = useChatStore()
      
    useSocketEvent<_MessageSentRes>({
      event: `new_message`,
      callback: newMessage => {          
        if (!currentRoomId) {          
          receiveNewMessage(newMessage);
        }else {
          if ( currentRoomId == newMessage.roomId) {            
            addMessage(newMessage)
          }else{
            receiveNewMessage(newMessage);
          }
        }
      },
    });
    const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator screenOptions={{headerShown: false }} >
      <Stack.Screen name='HomeScreen' component={HomeScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}

export default HomeNavigator