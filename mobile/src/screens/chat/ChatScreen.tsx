import React, {useCallback, useRef, useEffect, useMemo} from 'react';
import {View,StyleSheet,FlatList,} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MainNavProp} from '../../routers/types';
import {colors} from '../../styles/Ui/colors';
import ItemMessage from './components/ItemMessage';
import AppBar from '../../components/Common/AppBar';
import {_MessageSentReq,_MessageSentRes,} from '~/features/message/dto/message.dto.parent';
import {calculateElapsedTime, formatToHoursMinutes} from '~/utils/Convert/timeConvert';
import {RoomService} from '~/features/room/roomService';
import {_GetRoomRes} from '~/features/room/dto/room.dto.parent';
import {useChatStore} from '~/stores/zustand/chat.store';
import {useDispatch, useSelector} from 'react-redux';
import UModal, {UModalRef} from '~/components/Common/modal/UModal';
import ModalContent_MenuMessage, {
  KeyItemMenu,
} from '~/components/Common/modal/content/ModelContent_MenuMessage';
import BottomSheetComponent from './components/bottomSheet/__index';
import {appSelector} from '~/features/app/appSlice';
import {useRoomStore} from '~/stores/zustand/room.store';
import ReplyMessageComponent, {
  ReplyMessageRef,
} from './components/bottomSheet/ReplyMessage';
import StatusChat from './components/bottomSheet/StatusChat';
import { resetCurrentRoomId } from '~/features/app/appSlice';
import { DisplayMessage, mapMessagesToDisplay } from '~/features/message/mapper/message.mapper';
import { useSocket } from '~/contexts/SocketContext';

const ChatScreen: React.FC = () => {
  const mainNav = useNavigation<MainNavProp>();
  const {
    messages,
    room,
    member,
    pagination,
    fetchMember,
    fetchRoom,
    curentMessageRepling,
    setCurentMessageRepling,
    loadMoreMessage,
    clearData,
  } = useChatStore();
  const dispath = useDispatch()
  const {emit} = useSocket();
  const {currentRoomId, meData} = useSelector(appSelector);
  const {currentPartnerId} = useSelector(appSelector);

  const modalRef = useRef<UModalRef>(null);
  const replyingRef = useRef<ReplyMessageRef>(null);
  const messageSelectedRef = useRef<_MessageSentRes >();
  const currenMessageReplyingRef = useRef<any>(curentMessageRepling);
  const inputText = useRef('');

  // Fetch messages and set myId
  useEffect(() => {        
    const setData = async (): Promise<void> => {
      try {
        let roomIdTemp: any;
        //lây roomId từ roomIdPagram | userId
        if (currentRoomId) {
          roomIdTemp = currentRoomId;
        } else {
          if (currentPartnerId) {
            const res = await RoomService.findOneByPartnerId(currentPartnerId);
            roomIdTemp = res.roomId;
          }
        }                
        await Promise.all([
          fetchRoom(roomIdTemp),
          loadMoreMessage({data: roomIdTemp, pagination}),
        ]);
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          if (currentPartnerId) fetchMember(currentPartnerId);
        } else {
          console.error('Lỗi khác:', error);
          throw error;
        }
      }
    };
    setData();

    return () => {
      clearData();
      dispath(resetCurrentRoomId(null));
      emit('leave-room', {roomId: currentRoomId});
    };
  }, []);

  useEffect(()=>{
    const reply = currenMessageReplyingRef.current
    if (currenMessageReplyingRef.current){      
      replyingRef.current?.show(
        reply?.sender?.user.username ?? 'Unknown',
        reply?.content ?? '',
      );
    }
  },[])

  const handleInputChange = useCallback((text: string) => {
    inputText.current = text;
  }, []);
  const handleEmojiChange = useCallback((text: string) => {
    inputText.current += text;
  }, []);

  const loadMoreData = () => {
    loadMoreMessage({data: currentRoomId ?? '', pagination});
  };
  const handleLongItemPress = (pageY: number, message: DisplayMessage) => {
    messageSelectedRef.current = message

    modalRef.current?.open(
      <ModalContent_MenuMessage
        pageY={pageY}
        message={message}
        onItemPress={handleItemMenuMessage}
      />
    );
  };

  const handleItemMenuMessage = (key: KeyItemMenu) => {
    if (key == KeyItemMenu.REPLY) {
      replyingRef.current?.show(
        messageSelectedRef.current?.sender?.user.username ?? 'Unknown',
        messageSelectedRef.current?.content ?? '',
      );
      currenMessageReplyingRef.current = messageSelectedRef.current
      setCurentMessageRepling(currenMessageReplyingRef.current)
      modalRef.current?.close();
    }
  };
  
  const displayMessages = useMemo(
    () => mapMessagesToDisplay(messages, room, meData ? meData?.id : '')
    ,[messages, room, meData]);

    
  return (
    <View style={styles.container}>

      <UModal ref={modalRef}/>
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
        data={displayMessages}
        onEndReached={() => loadMoreData()}
        onEndReachedThreshold={0.4}
        keyExtractor={(item) => (item?.id )}
        contentContainerStyle={{paddingHorizontal: 10}}
        renderItem={({item}) => (
          <ItemMessage
            key={item.id}
            id={item?.id ?? ''}
            replyMessage={item.replyMessage}
            onLongPress={pageY => handleLongItemPress(pageY, item)}
            data={item.content}
            source={item.isSelfSent}
            type={'text'}
            sender={item.sender}
            status={item.messageStatus}
            time={formatToHoursMinutes(item.createdAt.toString())}
            isDisplayTime={item.isDisplayHeart}
            isDisplayHeart={item.isDisplayHeart}
            isDisplayAvatar={item.isDisplayAvatar}
            isDisplayStatus={item.isDisplayStatus}
          />
        )}
      />
      
      <StatusChat />

      <ReplyMessageComponent ref={replyingRef} />

      <BottomSheetComponent
        onTextChange={handleInputChange}
        onEmojiChange={handleEmojiChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_mess,
  },
});

export default ChatScreen;
