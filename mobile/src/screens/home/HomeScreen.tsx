import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainNavProp } from '../../routers/types';
import ItemChatHome, { Discription } from './components/ItemChatHome';
import AppBar from '../../components/Common/AppBar';
import { RoomService } from '~/features/room/roomService';
import { _GetAllRoomRes } from '~/features/room/dto/room.dto.parent';
import { Room } from '~/features/room/dto/room.dto.nested';

const HomeScreen = () => {
  const mainNav = useNavigation<MainNavProp>();

  const [rooms, setRooms] = useState<Room[]>([]);  

  const goToSearchScreen = () => {
    mainNav.navigate('SearchScreen');
  };
  const goToChatScreen = (id : string) => {
    mainNav.navigate('ChatScreen', {roomId: id});
  }

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await RoomService.getAllRoom(); 
        setRooms(res.data); 
        
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng:', error); // Xử lý lỗi
      }
    };

    fetchRooms(); 
  }, []);
  const chatList = [
    {
      id: '1',
      name: 'Nghĩa',
      description: { sender: 'Huy', message: 'Hello', kind: 'text' } as Discription ,
      time: '1 giờ',
    },
    {
      id: '2',
      name: 'Huy',
      isLike: true,
      description: { sender: 'Huy', message: 'Hello xin chào mọi người', kind: 'text' }as Discription ,
      time: '1 giờ',
      notSeen: 1,
    },
    {
      id: '3',
      name: 'Lê Văn Tèo',
      description: { sender: 'Huy', message: 'Hello', kind: 'video_receive' }as Discription ,
      time: '1 giờ',
      notSeen: 0,
    },
  ];

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
