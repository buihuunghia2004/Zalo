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
  _MessageLoadRes,
  _MessageSentReq,
  _MessageSentRes,
} from '~/features/message/dto/message.dto.parent';
import {MessageContentEnum, MessageViewStatus} from '~/features/message/dto/message.enum';
import {formatToHoursMinutes} from '~/utils/Convert/timeConvert';
import useSocket from '~/hooks/useSocket ';
import {AUTH_ASYNC_STORAGE_KEY} from '~/utils/Constants/authConstant';
import {loginGoogleResponse} from '~/features/auth/authDto';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {userApi} from '~/features/user/userService';
import {UserFriend} from '~/features/user/dto/user.dto.nested';
import { MessageBase } from '~/features/message/dto/message.dto.nested';
import { relationApi } from '~/features/relation/relationService';
import { RoomService } from '~/features/room/roomService';

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
  const mainNav = useNavigation<MainNavProp>();
  const route = useTypedRoute<typeof StackNames.ChatScreen>();
  const { roomId: roomIdPagram, userId } = route.params;

  const bottomSheetRef = useRef<BottomSheet>(null);
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<any>(null);

  const {getItem} = useAsyncStorage(AUTH_ASYNC_STORAGE_KEY);
  const [myId, setMyId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [messages, setMessages] = useState<(_MessageSentRes | MessageBase)[]>([]);
  const [member, setMember] = useState<UserFriend>();

  const [sheetIndex, setSheetIndex] = useState<number>(0);
  const [keyboard, setKeyboard] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [renderEmojis, setReanderEmojis] = useState<boolean>(false);

  const {newMessages} = useSocket(myId);

  const scaleIcons = useRef(new Animated.Value(1)).current;
  const scaleSend = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchMyData = async () => {
      const auth = await getItem();
      if (auth) {
        const parsedAuth = JSON.parse(auth) as loginGoogleResponse;
        setMyId(parsedAuth.userId);
      }
    };
    fetchMyData(); 
    if (newMessages && newMessages.length > 0) {
      newMessages;
    }
  }, [newMessages]);

  // Fetch messages and set myId
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await MessageService.loadMessages(roomId);
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchMember = async () => {
      try {
        if (userId) {
          const res = await userApi.findUserById(userId);
          setMember(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const findOneByPartnerId = async (): Promise<string | undefined> => {
      if (userId) {
        try {
          const res = await RoomService.findOneByPartnerId(userId);
          return res.roomId;
        } catch (error) {
          console.log(error);
        }
      }
      return undefined; 
    };
    fetchMember();

    // if (roomIdPagram && roomId == ''){
    //   setRoomId(roomIdPagram)
    //   loadMessages().then(()=>{{
    //     const myMessage = messages.find(
    //       (message) => message.sender?.user?.id === myId
    //     );
    //   }});
    // }
    if (userId){
      findOneByPartnerId().then(roomId => {
        if (roomId){
          setRoomId(roomId)
          loadMessages();
        }else{
          fetchMember();
        }
      });
    }
    
  }, [roomId]);

  

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
      // sender: messages && messages[0]
    };
    setMessages(prevMessages => [...prevMessages, tempMessage]);
    setInputText('');
      
    const newMessage: _MessageSentReq = {
      content: inputText,
      contentType: MessageContentEnum.TEXT,
      ...(userId && { receiverId: userId }),
      ...(roomId != '' && { roomId: roomId }),
    };
    try {
      const mesRes = await MessageService.SentMessage(newMessage);
      console.log(mesRes.room);
      
      if (mesRes.room) {
        setRoomId(mesRes.room.id);
      }
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === tempMessage.id ? { ...msg, id: mesRes.id, status: MessageViewStatus.SENT } : msg
        )
      );
    }catch(error){
     
    }
   
    flatListRef.current?.scrollToEnd({animated: true});
  };

  const handleInputPress = () => {
    setKeyboard(true);
    setSheetIndex(0);
  };

  const messagesDisplay: DisplayMessage[] = React.useMemo(() => {
    return messages.map((message, index, array) => ({
      ...message,
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
    }));
  }, [messages]);

  const RenderItem: React.FC<any> = React.memo(({item, onPress}) => {
    console.log(`Rendering item: ${item.id}`);
    return (
      <Pressable
        onPress={onPress}
        style={({pressed}) => ({
          width: 48,
          height: 48,
          alignItems: 'center',
          borderRadius: 50,
          backgroundColor: pressed ? 'rgba(24, 157, 252, 0.1)' : 'transparent',
          justifyContent: 'center',
        })}>
        <Text style={{fontSize: 22}}>{item.image}</Text>
      </Pressable>
    );
  });

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <AppBar
        // title= {member ? member.avatarUrl : messages && messages[0].}
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
      <View style={{flex: 1, marginBottom: 50}}>
        <FlatList
          // ref={flatListRef}
          data={messagesDisplay}
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
      </View>

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
