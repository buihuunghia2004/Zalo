import React, { useEffect, useRef, useState} from 'react';
import {View, FlatList } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MainNavProp, StackNames} from '../../routers/types';
import ItemChatHome from './components/item_room_chat/index';
import AppBar, {Actions} from '../../components/Common/AppBar';
import {_GetAllRoomRes} from '~/features/room/dto/room.dto.parent';
import {useRoomStore} from '~/stores/zustand/room.store';
import {_MessageSentRes} from '~/features/message/dto/message.dto.parent';
import UModal, { UModalRef } from '~/components/Common/modal/UModal';
import ModalContent_Conversation from '~/components/Common/modal/content/ModalContent_Conversation';

const HomeScreen = () => {
  const mainNav = useNavigation<MainNavProp>();
  const {rooms, fetchRooms} = useRoomStore();
  const modalRef = useRef<UModalRef>(null);
  
  useEffect(() => {
    
    fetchRooms();
  }, []);

  const goToSearchScreen = () => {
    mainNav.navigate(StackNames.SearchScreen);
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
    modalRef.current?.open(
      <ModalContent_Conversation pageY={pageY}/>
    )
  };
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <UModal ref={modalRef}/>

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
            onLongPress={pageY => handleLongItemPress(pageY)}
          />
        )}
      />
    </View>
  );
};

export default HomeScreen;
