import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainNavProp, StackNames } from '../../routers/types';
import ItemChatHome from './components/ItemChatHome';
import AppBar from '../../components/Common/AppBar';
import { _GetAllRoomRes } from '~/features/room/dto/room.dto.parent';
import { useRoomStore } from '~/stores/zustand/room.store';
import { _MessageSentRes } from '~/features/message/dto/message.dto.parent';
import useSocketEvent from '~/hooks/useSocket ';
import { useSelector } from 'react-redux';
import { authSelector } from '~/features/auth/authSlice';
import UModal from '~/components/Common/modal/UModal';
import ModalContent_Conversation from '~/components/Common/modal/content/ModalContent_Conversation';

const HomeScreen = () => {
  const mainNav = useNavigation<MainNavProp>();  
  const { user } = useSelector(authSelector)
  const { rooms, fetchRooms, receiveNewMessage } = useRoomStore()
  const [visibleMenuRoom, setVisivleMenuRoom] = useState(false)

  useSocketEvent<_MessageSentRes[]>({
    event: `event:notify:${user}:new_message`,
    callback: (newMessages) => {            
      newMessages.map((item)=>receiveNewMessage(item))
    },
  });


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
    <UModal key={'a'} onClose={() => setVisivleMenuRoom(false)} visible={visibleMenuRoom} content={<ModalContent_Conversation/>}/>
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
            roomAvatarUrl={item.roomAvatarUrl}
            roomAvatarUrls={item.roomAvatarUrls}
            // description={ item.description}
            // time={item.time}
            // isLike={item.isLike}
            // notSeen={item.notSeen}
            onPress={() => goToChatScreen(item.id)}
            onLongPress={()=>console.log(setVisivleMenuRoom(true))
            }
          />
        )}
      />
    </View>
  );
};

export default HomeScreen;
