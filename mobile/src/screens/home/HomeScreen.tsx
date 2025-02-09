import React, { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainNavProp, StackNames } from '../../routers/types';
import ItemChatHome from './components/ItemChatHome';
import AppBar from '../../components/Common/AppBar';
import { _GetAllRoomRes } from '~/features/room/dto/room.dto.parent';
import { useRoomStore } from '~/stores/zustand/room.store';
import { _MessageSentRes } from '~/features/message/dto/message.dto.parent';
import useSocket from '~/hooks/useSocket ';

const HomeScreen = () => {
  const mainNav = useNavigation<MainNavProp>();  

  const { rooms, fetchRooms, receiveNewMessage } = useRoomStore()
  const { socket, newMessages } = useSocket();

  useEffect(() => {
   if (newMessages) {    
    newMessages.map((message)=>receiveNewMessage(message))
   }
  }, [socket]);

  useEffect(() => {
    fetchRooms()
  }, []);

  
  const goToSearchScreen = () => {
    mainNav.navigate(StackNames.SearchScreen);
  };
  const goToChatScreen = (id : string) => {    
    mainNav.navigate(StackNames.ChatScreen, {roomId: id});
  }

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      {/* AppBar */}
      <AppBar
        iconButtonLeft={['search']}
        iconButtonRight={['bell', 'setting']}
        inputSearch={false}
        onChangeInputText={(text) => console.log('Input changed:', text)}
        onPressInput={() => goToSearchScreen()}
        onPress={(action) => {
          switch (action) {
            case 'search':
              goToSearchScreen();
              break;
            case 'bell':
              break;
            case 'setting':
              break;
          }
        }}
      />
      {/* Danh sách chat */}
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => (
          <ItemChatHome
            id={item.id}
            name={item.roomName}
            image={item.roomAvatarUrl}
            // description={ item.description}
            // time={item.time}
            // isLike={item.isLike}
            // notSeen={item.notSeen}
            onPress={() => goToChatScreen(item.id)}
          />
        )}
      />
    </View>
  );
};

export default HomeScreen;
