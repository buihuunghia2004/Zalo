import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {MainNavProp, MainStackParamList, StackNames} from '../../routers/types';
import {colors} from '../../styles/Ui/colors';
import {Assets} from '../../styles/Ui/assets';
import ItemMessage from './components/ItemMessage';
import AppBar from '../../components/Common/AppBar';
import {iconSize} from '../../styles/Ui/icons';
import {useTypedRoute} from '~/hooks/userMainRoute';
import {
  _MessageSentReq,
  _MessageSentRes,
} from '~/features/message/dto/message.dto.parent';
import {MessageViewStatus} from '~/features/message/dto/message.enum';
import {formatToHoursMinutes} from '~/utils/Convert/timeConvert';
import {RoomService} from '~/features/room/roomService';
import {_GetRoomRes} from '~/features/room/dto/room.dto.parent';
import {useChatStore} from '~/stores/zustand/chat.store';
import useSocketEvent from '~/hooks/useSocket ';
import {useSelector} from 'react-redux';
import {authSelector} from '~/features/auth/authSlice';
import {textStyle} from '~/styles/Ui/text';
import {useSocket} from '~/socket/SocketProvider';
import UModal from '~/components/Common/modal/UModal';
import ModalContent_MenuMessage, {
  KeyItemMenu,
} from '~/components/Common/modal/content/ModelContent_MenuMessage';
import BottomSheetComponent from './components/BottonSheetComponent';
import {MessagParente} from '~/features/message/dto/message.dto.nested';

type ChatScreenProps = {
  route: RouteProp<MainStackParamList, 'ChatScreen'>;
};

export type DisplayMessage = _MessageSentRes & {
  isDisplayTime?: boolean;
  isDisplayHeart?: boolean;
  isDisplayAvatar?: boolean;
  isDisplayStatus?: boolean;
  messageStatus: MessageViewStatus;
};
const ChatScreen: React.FC<ChatScreenProps> = () => {
  const mainNav = useNavigation<MainNavProp>();
  const route = useTypedRoute<typeof StackNames.ChatScreen>();
  const {roomId: roomIdPagram, userId} = route.params;

  const [roomId, setRoomId] = useState(roomIdPagram);
  const {
    curentMessageRepling,
    curentMessageSelected,
    messages,
    room,
    member,
    pagination,
    fetchMember,
    fetchRoom,
    setCurentMessageSelected,
    setCurentMessageRepling,
    loadMoreMessage,
    sendMessage,
    clearData,
  } = useChatStore();

  const {user} = useSelector(authSelector);
  const {emit} = useSocket();

  const inputRef = useRef<TextInput>(null);
  const inputText = useRef('');
  const [pageY, setPageY] = useState(0);
  const [isPartnerWrite, setIsPartnerWrite] = useState(false);
  const [visibleMenuRoom, setVisivleMenuRoom] = useState(false);
  const [replying, setReplying] = useState(false);

  useSocketEvent<_MessageSentRes[]>({
    event: `received_msg`,
    callback: newMessages => {},
  });

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
        await Promise.all([
          fetchRoom(roomIdTemp),
          loadMoreMessage({data: roomIdTemp, pagination}),
        ]);

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
  }, []);

  const handleInputChange = useCallback((text: string) => {
    inputText.current = text;
  }, []);
  const handleEmojiChange = useCallback((text: string) => {
    inputText.current += text;
  }, []);

  const handleSendMessage = async () => {
    sendMessage(inputText.current, curentMessageRepling, userId, roomId);
    inputText.current = '';
    setReplying(false);
  };

  const loadMoreData = () => {
    loadMoreMessage({data: roomId ?? '', pagination});
  };
  const handleLongItemPress = (pageY: number, message: DisplayMessage) => {
    setCurentMessageSelected(message);
    setPageY(pageY);
    setVisivleMenuRoom(true);
  };
  const handleItemMenuMessage = (key: KeyItemMenu) => {
    if (key == KeyItemMenu.REPLY) {
      setReplying(true);
      setCurentMessageRepling(curentMessageSelected as MessagParente);
      setVisivleMenuRoom(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  };
  const messagesDisplay: DisplayMessage[] = (messages ?? []).map(
    (message, index, array) => {
      let status: MessageViewStatus = MessageViewStatus.SENT;

      room?.members?.forEach(member => {
        if (member.id !== user) {
          if (member.msgRTime > message.createdAt) {
            status = MessageViewStatus.RECEIVED;
          }
          if (member.msgVTime > message.createdAt) {
            status = MessageViewStatus.VIEWED;
            return;
          }
        }
      });
      return {
        ...message,
        isDisplayHeart:
          !message.isSelfSent && (array[index - 1]?.isSelfSent || index === 0),
        isDisplayAvatar: !message.isSelfSent && array[index + 1]?.isSelfSent,
        isDisplayStatus: message.isSelfSent && index === 0,
        messageStatus: status,
        // isDisplayTime:
        //   index === array.length - 1 ||
        //   (message.source !== array[index + 1]?.source &&
        //     message.source !== 'time' &&
        //     message.source !== 'action'),

        // isDisplayHeart:
        //   message.source === 'people' &&
        //   message.source !== array[index + 1]?.source,
      };
    },
  );
  return (
    <View style={styles.container}>
      <UModal
        onClose={() => setVisivleMenuRoom(false)}
        visible={visibleMenuRoom}
        content={
          <ModalContent_MenuMessage
            pageY={pageY}
            message={curentMessageSelected}
            onItemPress={handleItemMenuMessage}
          />
        }
      />
      {/* AppBar */}
      <AppBar
        title={room?.roomName ?? member?.username}
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
        style={{
          backgroundColor: colors.primary,
          position: 'absolute',
          zIndex: 1,
        }}
      />
      <FlatList
        inverted
        data={messagesDisplay}
        onEndReached={() => loadMoreData()}
        onEndReachedThreshold={0.4}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingHorizontal: 10,}}
        renderItem={({item}) => (
          <ItemMessage
            key={item.id}
            id={item.id}
            parentMessage={item.parentMessage}
            onLongPress={pageY => handleLongItemPress(pageY, item)}
            data={item.content}
            source={item.isSelfSent}
            type={'text'}
            sender={item.sender}
            status={item.messageStatus}
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
      />

      {isPartnerWrite && <Text style={styles.isChating}>Đang soạn tin...</Text>}

      {/* trả lời tin nhắn */}
      {replying && (
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
          {true && <Image />}
          <View style={{height: 50, flex: 1}}>
            <Text style={textStyle.body_sm}>
              {curentMessageSelected?.sender?.user.username}
            </Text>
            <View style={{flexDirection: 'row'}}>
              {false && <Text> hình ảnh</Text>}
              <Text style={textStyle.body_md}>{curentMessageSelected?.content}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setReplying(false)}>
            <Image source={Assets.icons.back_gray} style={iconSize.medium} />
          </TouchableOpacity>
        </View>
      )}

      {/* BottomSheet */}
      <BottomSheetComponent
        inputRef={inputRef}
        inputText={inputText.current}
        onTextChange={handleInputChange}
        onEmojiChange={handleEmojiChange}
        handleSendMessage={handleSendMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_mess,
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
