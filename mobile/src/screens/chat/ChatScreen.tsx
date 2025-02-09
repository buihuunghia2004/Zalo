import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  Animated,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {MainNavProp, MainStackParamList, StackNames} from '../../routers/types';
import {colors} from '../../styles/Ui/colors';
import {Assets} from '../../styles/Ui/assets';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import ItemMessage from './components/ItemMessage';
import AppBar from '../../components/Common/AppBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/Ui/dimensions';
import {iconSize} from '../../styles/Ui/icons';
import EmojiList from './components/EmojiList';
import {MessageService} from '~/features/message/messageService';
import {useTypedRoute} from '~/hooks/userMainRoute';
import {
  _MessageSentReq,
  _MessageSentRes,
} from '~/features/message/dto/message.dto.parent';
import {
  MessageContentEnum,
  MessageViewStatus,
} from '~/features/message/dto/message.enum';
import {formatToHoursMinutes} from '~/utils/Convert/timeConvert';
import {MessageBase} from '~/features/message/dto/message.dto.nested';
import {RoomService} from '~/features/room/roomService';
import {_GetRoomRes} from '~/features/room/dto/room.dto.parent';
import {useChatStore} from '~/stores/zustand/chat.store';

type ChatScreenProps = {
  route: RouteProp<MainStackParamList, 'ChatScreen'>;
};

type DisplayMessage = _MessageSentRes & {
  isDisplayTime?: boolean;
  isDisplayHeart?: boolean;
  isDisplayAvatar?: boolean;
  isDisplayStatus?: boolean;
};
const ChatScreen: React.FC<ChatScreenProps> = () => {
  console.log('re-render');
  
  const mainNav = useNavigation<MainNavProp>();
  const route = useTypedRoute<typeof StackNames.ChatScreen>();
  const {roomId: roomIdPagram, userId} = route.params;

  const bottomSheetRef = useRef<BottomSheet>(null);
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<any>(null);

  const [roomId, setRoomId] = useState('');
  const {
    messages,
    room,
    member,
    pagination,
    fetchMember,
    fetchRoom,
    loadMoreMessage,
    addMessage,
    clearData
  } = useChatStore();

  const [sheetIndex, setSheetIndex] = useState<number>(0);
  const [keyboard, setKeyboard] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [renderEmojis, setReanderEmojis] = useState<boolean>(false);

  const scaleIcons = useRef(new Animated.Value(1)).current;
  const scaleSend = useRef(new Animated.Value(0)).current;

  // Fetch messages and set myId
  useEffect(() => {    
    const findOneByPartnerId = async (): Promise<void> => {
      try {
        let roomIdTemp;

        if (roomIdPagram) {
          roomIdTemp = roomIdPagram;
        } else {
          if (userId) {            
            const res = await RoomService.findOneByPartnerId(userId);
            roomIdTemp = res.roomId;
          }
        }

        setRoomId(roomIdTemp);
        fetchRoom(roomIdTemp);
        loadMoreMessage({
          data: roomIdTemp,
          pagination,
        });
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          if (userId) fetchMember(userId);
        } else {
          console.error('Lỗi khác:', error);
          throw error;
        }
      }
    };
    findOneByPartnerId()

    return () => {
      clearData()
    }
  }, []);
  

  const handleInputChange = useCallback((text: string) => {
    setInputText(prevText => prevText + text);
    handleAnimation(text);
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    setSheetIndex(index);
  }, []);

  const handleAnimation = (text: string) => {
    if (text === '') {
      Animated.parallel([
        Animated.timing(scaleSend, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleIcons, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleIcons, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleSend, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleIconPress = (icon: string) => {
    setReanderEmojis(true);
    switch (icon) {
      case 'ghost':
        if (sheetIndex === 0) {
          if (!keyboard) {
            setSheetIndex(1);
            bottomSheetRef.current?.expand(); // Mở sheet
          } else {
            Keyboard.dismiss();
            setSheetIndex(1);
          }
        } else {
          if (inputRef.current) {
            inputRef.current.focus();
            bottomSheetRef.current?.close(); // Đóng sheet
            setSheetIndex(0);
          }
        }
        break;

      default:
        break;
    }
  };

  const handleSendMessage = async () => {
    const tempMessage: MessageBase = {
      id: `temp-${Date.now()}`,
      content: inputText,
      isSelfSent: true,
      type: MessageContentEnum.TEXT,
      status: MessageViewStatus.SENT,
    };
    // prevMessages => [...prevMessages, tempMessage];
    setInputText('');

    const newMessage: _MessageSentReq = {
      content: inputText,
      contentType: MessageContentEnum.TEXT,
      ...(userId && {receiverId: userId}),
      ...(roomId != '' && {roomId: roomId}),
    };
    try {
      const mesRes = await MessageService.SentMessage(newMessage);

      if (mesRes.roomId) {
        setRoomId(mesRes.roomId);
      }
      addMessage(mesRes);
    } catch (error) {}

    // flatListRef.current?.scrollToEnd({animated: true});
  };

  const handleInputPress = () => {
    setKeyboard(true);
    setSheetIndex(0);
  };

  const messagesDisplay: DisplayMessage[] = React.useMemo(() => {
    return messages;
    // return messages.map((message, index, array) => ({
    //   ...message,
    // isDisplayTime:
    //   index === array.length - 1 ||
    //   (message.source !== array[index + 1]?.source &&
    //     message.source !== 'time' &&
    //     message.source !== 'action'),
    // isDisplayHeart:
    //   message.source === 'people' &&
    //   message.source !== array[index + 1]?.source,
    // isDisplayAvatar:
    //   message.source === 'people' &&
    //   (index === 0 || array[index - 1]?.source !== 'people'),
    // isDisplayStatus:
    //     message.source === 'me' && index === array.length - 1
    // })
    // );
  }, [messages]);

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <AppBar
        title={member?.username ?? room?.roomName}
        description="1 giờ trước"
        iconButtonLeft={['back']}
        iconButtonRight={['call', 'video_call', 'menu']}
        onChangeInputText={text => console.log('Input changed:', text)}
        onPress={action => {
          switch (action) {
            case 'back':
              mainNav.goBack();
              break;
          }
        }}
        style={{backgroundColor: colors.primary}}
      />

      {/* Content */}
      <FlatList
      // ref={flatListRef}
      style={{flex: 1, marginBottom:50}}
      inverted
      data={messagesDisplay}
      onEndReached={() =>
        loadMoreMessage({
          data: roomId,
          pagination,
        })
      }
      onEndReachedThreshold={0.2}
      // ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="gray" /> : null}
      keyExtractor={item => item.id}
      renderItem={({item}: {item: DisplayMessage}) => (
        <ItemMessage
          id={item.id}
          data={item.content}
          source={'me'}
          type={'text'}
          time={
            item.createdAt
              ? formatToHoursMinutes(item.createdAt.toString())
              : 'N/A'
          }
          // emojis={'a'}
          isDisplayTime={item.isDisplayTime}
          isDisplayHeart={item.isDisplayHeart}
          isDisplayAvatar={item.isDisplayAvatar}
          isDisplayStatus={item.isDisplayStatus}
        />
      )}
      contentContainerStyle={{paddingHorizontal: 10}}
      />
      

      {/* BottomSheet */}
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={[WINDOW_WIDTH / 7.2, WINDOW_HEIGHT / 2.075]}
        index={sheetIndex}
        handleComponent={() => null}
        enableContentPanningGesture={false}>
        <BottomSheetView style={styles.contentContainer}>
          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleIconPress('ghost')}>
              <Image source={Assets.icons.ghost_gray} style={iconSize.large} />
            </TouchableOpacity>

            <View style={{flex: 1, flexDirection: 'row'}}>
              <Animated.View style={{flex: 1}}>
                <TextInput
                  ref={inputRef}
                  value={inputText}
                  onChangeText={newText => {
                    setInputText(newText);
                    handleAnimation(newText);
                  }}
                  onFocus={handleInputPress}
                  placeholder="Tin nhăn"
                  placeholderTextColor={colors.gray_icon}
                  style={styles.input}
                />
              </Animated.View>

              <Animated.View
                style={[
                  styles.btnSend,
                  {transform: [{scale: scaleSend}], opacity: scaleSend},
                ]}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleSendMessage}>
                  <Image
                    source={Assets.icons.send_blue}
                    style={iconSize.large}
                  />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={[
                  styles.btns,
                  {transform: [{scale: scaleIcons}], opacity: scaleIcons},
                ]}>
                <TouchableOpacity style={styles.iconButton}>
                  <Image
                    source={Assets.icons.menu_row_gray}
                    style={iconSize.large}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Image
                    source={Assets.icons.mic_gray}
                    style={iconSize.large}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Image
                    source={Assets.icons.image_gray}
                    style={iconSize.large}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>

          {renderEmojis && (
            <EmojiList
              handleInputChange={text => handleInputChange(text + ' ')}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_mess,
  },
  bottomBar: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },

  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
    marginHorizontal: 5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
    margin: 0,
    padding: 0,
    alignItems: 'center',
  },

  itemEmojiContainer: {
    margin: 8,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
  },
  btnSend: {
    position: 'absolute',
    right: 0,
    bottom: 5,
  },
  btns: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default ChatScreen;
