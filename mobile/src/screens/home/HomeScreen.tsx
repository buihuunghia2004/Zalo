import React, {Key, useEffect, useState} from 'react';
import {View, FlatList, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MainNavProp, StackNames} from '../../routers/types';
import ItemChatHome from './components/item_room_chat/index';
import AppBar, {Actions} from '../../components/Common/AppBar';
import {_GetAllRoomRes} from '~/features/room/dto/room.dto.parent';
import {useRoomStore} from '~/stores/zustand/room.store';
import {_MessageSentRes} from '~/features/message/dto/message.dto.parent';
import useSocketEvent from '~/hooks/useSocket ';
import {useSelector} from 'react-redux';
import {authSelector} from '~/features/auth/authSlice';
import UModal from '~/components/Common/modal/UModal';
import ModalContent_Conversation from '~/components/Common/modal/content/ModalContent_Conversation';
import {useSocket} from '~/socket/SocketProvider';

const HomeScreen = () => {
  const mainNav = useNavigation<MainNavProp>();
  const {user} = useSelector(authSelector);
  const {rooms, unReadMessagesRooms, fetchRooms, setUnReadMessagesRooms} = useRoomStore();
  const [visibleMenuRoom, setVisivleMenuRoom] = useState(false);
  const [pageY, setPageY] = useState(0);

  useSocketEvent<Record<string, any>>({
    event: 'load_more_msgs_when_connect',
    callback: unReadmessages => {
      setUnReadMessagesRooms(unReadmessages);
    },
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const goToSearchScreen = () => {
    mainNav.navigate(StackNames.SearchScreen);
  };
  const goToChatScreen = (id: string) => {
    mainNav.navigate(StackNames.ChatScreen, {roomId: id});
  };
  const handleAppBarPress = (action: Actions) => {
    switch (action) {
      case 'search':
        goToSearchScreen();
        break;
      case 'bell':
        break;
      case 'setting':
        break;
    }
  };
  const handleLongItemPress = (pageY: number) => {
    setPageY(pageY);
    setVisivleMenuRoom(true);
  };
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <UModal
        onClose={() => setVisivleMenuRoom(false)}
        visible={visibleMenuRoom}
        content={<ModalContent_Conversation pageY={pageY} />}
      />
      {/* AppBar */}
      <AppBar
        iconButtonLeft={['search']}
        iconButtonRight={['bell', 'setting']}
        inputSearch={false}
        onChangeInputText={text => console.log('Input changed:', text)}
        onPressInput={() => goToSearchScreen()}
        onPress={action => {
          handleAppBarPress(action);
        }}
      />
      {/* Danh sách chat */}
      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ItemChatHome
            key={item.id}
            room={item}
            unRead={unReadMessagesRooms[item.id] || undefined}
            onPress={() => goToChatScreen(item.id)}
            onLongPress={pageY => handleLongItemPress(pageY)}
          />
        )}
      />
    </View>
  );
};

export default HomeScreen;
