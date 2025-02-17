import React, { useEffect, useState } from 'react';
import { View, FlatList, GestureResponderEvent } from 'react-native';
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
import ModalContent_MenuMessage from '~/components/Common/modal/content/ModelContent_MenuMessage';

const HomeScreen = () => {
  const mainNav = useNavigation<MainNavProp>();  
  const { user } = useSelector(authSelector)
  const { rooms, fetchRooms, receiveNewMessage } = useRoomStore()
  const [visibleMenuRoom, setVisivleMenuRoom] = useState(false)
  const [pageY, setPageY] = useState(0)

  useSocketEvent<_MessageSentRes[]>({
    event: `load_more_msgs_when_connect`,
    callback: (newMessages) => {
      console.log(newMessages);
              
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

  const handleLongItemPress = (pageY: number)=>{
    setPageY(pageY)
    setVisivleMenuRoom(true)
  }
  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <UModal key={'a'} onClose={() => setVisivleMenuRoom(false)}
      visible={visibleMenuRoom} 
      content={<ModalContent_MenuMessage pageY={pageY}/>}/>
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
            key={item.id}
            id={item.id}
            name={item.roomName}
            roomAvatarUrl={item.roomAvatarUrl}
            roomAvatarUrls={item.roomAvatarUrls}
            // description={ item.description}
            // time={item.time}
            // isLike={item.isLike}
            // notSeen={item.notSeen}
            onPress={() => goToChatScreen(item.id)}
            onLongPress={(pageY)=>handleLongItemPress(pageY)}
            />
        )}
      />
    </View>
  );
};

export default HomeScreen;
