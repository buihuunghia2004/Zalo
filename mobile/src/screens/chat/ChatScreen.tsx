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
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {MainNavProp, MainStackParamList, StackNames} from '../../routers/types';
import {colors} from '../../styles/Ui/colors';
import {Assets} from '../../styles/Ui/assets';
import BottomSheet, {
  BottomSheetView,
  TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet';
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
import useSocketEvent from '~/hooks/useSocket ';
import {useSelector} from 'react-redux';
import {authSelector} from '~/features/auth/authSlice';
import {textStyle} from '~/styles/Ui/text';
import {useSocket} from '~/socket/SocketProvider';
import UModal from '~/components/Common/modal/UModal';
import ModalContent_Conversation from '~/components/Common/modal/content/ModalContent_Conversation';
import ModalContent_MenuMessage from '~/components/Common/modal/content/ModelContent_MenuMessage';
import BottomSheetComponent from './components/BottonSheetComponent';

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
  const {roomId: roomIdPagram, userId} = route.params;

  const inputRef = useRef<TextInput>(null);

  const [roomId, setRoomId] = useState(roomIdPagram);
  const {
    messages,
    room,
    member,
    pagination,
    fetchMember,
    fetchRoom,
    loadMoreMessage,
    addMessage,
    setMessages,
    clearData,
  } = useChatStore();
  const {user} = useSelector(authSelector);
  const {emit} = useSocket();

  const [inputText, setInputText] = useState<string>('');
  const [isPartnerWrite, setIsPartnerWrite] = useState(false);
  const [visibleMenuRoom, setVisivleMenuRoom] = useState(false);
  const [pageY, setPageY] = useState(0);

  useSocketEvent<_MessageSentRes>({
    event: `event:notify:${user}:new_message`,
    callback: newMessage => {
      addMessage({...newMessage, isSelfSent: false});
    },
  });
  if (roomId) {
    useSocketEvent<{id: string; status: boolean}>({
      event: `event:${roomId}:writing_message`,
      callback(data) {
        setIsPartnerWrite(data.status);
      },
    });
  }

  // Fetch messages and set myId
  useEffect(() => {
    const setData = async (): Promise<void> => {
      try {
        let roomIdTemp: any;

        if (roomIdPagram) {
          roomIdTemp = roomIdPagram;
        } else {
          if (userId) {
            const res = await RoomService.findOneByPartnerId(userId);
            roomIdTemp = res.roomId;
          }
        }

        //emit join-room
        emit('join-room', {roomId: roomIdTemp, userId: user});

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
    setData();

    return () => {
      clearData();
      emit('out-room', {roomId: roomId});
    };
  }, [roomId]);

  useEffect(() => {
    const i = setTimeout(() => {
      if (inputText) {
        emit('writing-message', {
          roomId: roomId,
          status: true,
        });
      } else {
        emit('writing-message', {
          roomId: roomId,
          status: false,
        });
      }
    }, 500);
    return () => {
      clearTimeout(i);
    };
  }, [inputText]);

  const handleInputChange = useCallback((text: string) => {
    setInputText(prevText => prevText + text);
  }, []);

  const handleSendMessage = async () => {
    const msgIdTemp = `temp-${Date.now()}`;
    const msgsTemp = messages;

    const tempMessage: MessageBase = {
      id: msgIdTemp,
      content: inputText,
      isSelfSent: true,
      type: MessageContentEnum.TEXT,
      status: MessageViewStatus.SENDING,
    };
    addMessage(tempMessage);
    msgsTemp.unshift(tempMessage);
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

      const newMsgs = msgsTemp.map(message => {
        if (message.id == msgIdTemp) {
          return {...mesRes, status: MessageViewStatus.SENT, isSelfSent: true};
        }
        return message;
      });
      setMessages(newMsgs);
    } catch (error) {}
  };

  const loadMoreData = () => {
    loadMoreMessage({
      data: roomId ?? '',
      pagination,
    });
  };
  const handleLongItemPress = (pageY: number) => {
    setPageY(pageY);
    setVisivleMenuRoom(true);
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
      isDisplayHeart:
        !message.isSelfSent && (array[index - 1]?.isSelfSent || index == 0),
      isDisplayAvatar: !message.isSelfSent && array[index + 1]?.isSelfSent,
      // isDisplayStatus:
      //     message.source === 'me' && index === array.length - 1
      isDisplayStatus: message.isSelfSent && index === 0,
    }));
  }, [messages]);

  return (
    <View style={styles.container}>
      <UModal
        key={'b'}
        onClose={() => setVisivleMenuRoom(false)}
        visible={visibleMenuRoom}
        content={<ModalContent_MenuMessage pageY={pageY} />}
      />
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
      <FlatList
        inverted
        data={messagesDisplay}
        onEndReached={() => loadMoreData()}
        onEndReachedThreshold={0.4}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ItemMessage
            key={item.id}
            id={item.id}
            onLongPress={pageY => handleLongItemPress(pageY)}
            data={item.content}
            source={item.isSelfSent}
            type={'text'}
            status={item.status}
            time={
              item.createdAt
                ? formatToHoursMinutes(item.createdAt.toString())
                : 'N/A'
            }
            isDisplayTime={item.isDisplayTime}
            isDisplayHeart={item.isDisplayHeart}
            isDisplayAvatar={item.isDisplayAvatar}
            isDisplayStatus={item.isDisplayStatus}
          />
        )}
        contentContainerStyle={{marginVertical: 10, paddingHorizontal: 10}}
      />

      {isPartnerWrite && <Text style={styles.isChating}>Đang soạn tin...</Text>}

      {/* trả lời tin nhắn */}
      {1 > 2 && (
        <View
          style={{
            backgroundColor: 'white',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            paddingRight: 20,
            borderBottomColor: colors.gray_light,
            borderBottomWidth: 1,
            marginBottom: 2,
          }}>
          <View
            style={{
              backgroundColor: colors.secondary,
              width: 2,
              height: '100%',
              borderRadius: 10,
              marginHorizontal: 10,
            }}></View>
          {1 > 2 && <Image />}
          <View style={{height: 50, flex: 1}}>
            <Text style={textStyle.body_sm}>Nhân</Text>
            <View style={{flexDirection: 'row'}}>
              {1 > 2 && <Text> hình ảnh</Text>}
              <Text style={textStyle.body_md}>Nội dung</Text>
            </View>
          </View>
          <Image source={Assets.icons.back_gray} style={iconSize.medium} />
        </View>
      )}

      {/* BottomSheet */}
      <BottomSheetComponent
        key={'a'}
        inputText={inputText}
        setInputText={setInputText}
        handleSendMessage={handleSendMessage}
        handleInputChange={handleInputChange}
        inputRef={inputRef}
      />
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
    width: '100%',
    backgroundColor: colors.white,
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
  isChating: {
    ...textStyle.body_sm,
    backgroundColor: colors.gray,
    color: colors.secondary,
    position: 'absolute',
    paddingHorizontal: 6,
    borderTopRightRadius: 4,
    bottom: 50,
  },
});

export default ChatScreen;
