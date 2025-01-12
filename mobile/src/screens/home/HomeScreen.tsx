import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainNavProp } from '../../routers/types';
import ItemChatHome, { Discription } from './components/ItemChatHome';
import AppBar from '../../components/Common/AppBar';
import { colors } from '~/styles/Ui/colors';
import SimpleModal from '~/components/Common/modal/SimpleModal';
import Toast from '~/components/Common/toast/SimpleToast';
import { Fonts } from '~/styles/Ui/fonts';
import styles from '~/styles/components/AppBar.styles';
import { textStyle } from '~/styles/Ui/text';

const HomeScreen = () => {
  const mainNav = useNavigation<MainNavProp>();

  const goToSearchScreen = () => {
    mainNav.navigate('SearchScreen');
  };
  const goToChatScreen = (id : string) => {
    mainNav.navigate('ChatScreen', {id});
  }

  // Dữ liệu danh sách chat
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
        style={{backgroundColor: colors.primary}}
      />

      {/* Danh sách chat */}
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => (
          <ItemChatHome
            name={item.name}
            description={ item.description}
            time={item.time}
            isLike={item.isLike}
            notSeen={item.notSeen}
            onPress={(id: string) => goToChatScreen(id)}
          />
        )}
      />
    </View>
  );
};

export default HomeScreen;
