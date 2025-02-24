import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {viewStyle} from '~/styles/Ui/views';
import {colors} from '~/styles/Ui/colors';
import {imagesStyle} from '~/styles/Ui/image';
import GroupAvatar from '~/components/Common/GroupAvatar';
import {_GetAllRoomRes} from '~/features/room/dto/room.dto.parent';
import {Room} from '~/features/room/dto/room.dto.nested';
import {_MessageSentRes} from '~/features/message/dto/message.dto.parent';
import LastMessage from './LastMessage';
import {RoomTypeEnum} from '~/features/room/dto/room.enum';
import {textStyle} from '~/styles/Ui/text';
import {getTimeDifferenceFromNow} from '~/utils/Convert/timeConvert';
import { useSocket } from '~/socket/SocketProvider';
import { useDispatch } from 'react-redux';
import { resetCurrentRoomId } from '~/features/app/appSlice';
import { useNavigation } from '@react-navigation/native';
import { MainNavProp, StackNames } from '~/routers/types';

type Props = {
  room: Room;
  onLongPress?: (pageY: number) => void;
};

const ItemChatHome: React.FC<Props> = ({room, onLongPress}) => {  
  const mainNav = useNavigation<MainNavProp>();
  const {emit} = useSocket();
  const dispath = useDispatch()

  //   const descriptionType: Record<DiscriptionType, DescriptionDetail> = {
  //     text: {label: '', icon: null},
  //     image: {label: '[Hình ảnh]', icon: null},
  //     file: {label: '[File]', icon: null},
  //     video: {label: '[Video]', icon: null},
  //     voice: {label: '[Tin nhắn thoại]', icon: null},
  //     card: {label: '[Danh thiếp]', icon: null},
  //     location: {label: '[Vị Trí]', icon: null},
  //     call_send: {
  //       label: 'Cuộc gọi thoại đi',
  //       TextStyle: textStyle.description_seen,
  //       icon: Assets.icons.call_send_gray,
  //     },
  //     call_receive: {
  //       label: 'Cuộc gọi thoại đến',
  //       TextStyle: textStyle.description_seen,
  //       icon: Assets.icons.call_receive_gray,
  //     },
  //     call_missed: {
  //       label: 'Cuộc gọi thoại nhỡ',
  //       TextStyle:
  //         notSeen && notSeen > 0
  //           ? textStyle.description_missed
  //           : textStyle.description_seen,
  //       icon:
  //         notSeen && notSeen > 0
  //           ? Assets.icons.call_x_red
  //           : Assets.icons.call_x_gray,
  //     },
  //     video_send: {
  //       label: 'Cuộc gọi video đi',
  //       TextStyle: textStyle.description_seen,
  //       icon: Assets.icons.video_send_gray,
  //     },
  //     video_receive: {
  //       label: 'Cuộc gọi video đến',
  //       TextStyle: textStyle.description_seen,
  //       icon: Assets.icons.video_receive_gray,
  //     },
  //     video_missed: {
  //       label: 'Cuộc gọi video nhỡ',
  //       TextStyle: notSeen
  //         ? textStyle.description_missed
  //         : textStyle.description_seen,
  //       icon:
  //         notSeen && notSeen > 0
  //           ? Assets.icons.video_x_red
  //           : Assets.icons.video_x_gray,
  //     },
  //   };
  const [timeDifference, setTimeDifference] = useState('');
  useEffect(() => {
    if (room.lastMsg?.createdAt) {
      // Kiểm tra nếu lastMsg tồn tại
      setTimeDifference(
        getTimeDifferenceFromNow(room.lastMsg.createdAt.toString()),
      );

      const intervalId = setInterval(() => {
        setTimeDifference(
          getTimeDifferenceFromNow(room.lastMsg!.createdAt.toString()), // room.lastMsg! vì đã kiểm tra trước đó
        );
      }, 60 * 1000);

      return () => clearInterval(intervalId);
    }
  }, [room.lastMsg?.createdAt]);

  const itemRef = useRef<View>(null);
  const handleLongPress = () => {
    if (itemRef.current) {
      itemRef.current.measure((x, y, width, height, pageX, pageY) => {
        if (onLongPress) {
          onLongPress(pageY);
        }
      });
    }
  };
  const handleOnPress = ()=>{
    dispath(resetCurrentRoomId(room.id));
    emit('join-room', {roomId: room.id});    
    mainNav.navigate(StackNames.ChatScreen);
  }
  return (
    <Pressable
      key={room.id}
      ref={itemRef}
      onLongPress={handleLongPress}
      onPress={handleOnPress}
      style={({pressed}) => [
        styles.container,
        {backgroundColor: pressed ? 'rgba(0, 0, 0, 0.03)' : 'transparent'},
      ]}>
      {room.roomAvatarUrl ? (
        <Image
          style={imagesStyle.avatar_50}
          source={{uri: room.roomAvatarUrl}}
        />
      ) : (
        <GroupAvatar roomAvatarUrls={room.roomAvatarUrls} />
      )}

      <View style={styles.infor}>
        <View style={viewStyle.container_row_between}>
          <Text
            style={[
              textStyle.body_md,
              room.unReadMsgCount > 0 && styles.unReaded,
            ]}>
            {room.roomName}
          </Text>
          <Text
            style={[
              styles.textTime,
              room.unReadMsgCount > 0 && styles.unReaded,
            ]}>
            {timeDifference}
          </Text>
        </View>
        {room.lastMsg && <View style={viewStyle.container_row_between}>
        <LastMessage
            isGroup={room.type == RoomTypeEnum.GROUP}
            unReadCount={room.unReadMsgCount}
            lastMessage={room?.lastMsg}
          />
        </View>}
      </View>
    </Pressable>
  );
};

export default ItemChatHome;

const styles = StyleSheet.create({
  container: {
    ...viewStyle.container_row_center,
    gap: 10,
    height: 74,
    paddingLeft: 16,
  },
  infor: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    borderBottomWidth: 0.4,
    borderBottomColor: colors.gray,
  },
  textTime: {
    ...textStyle.body_sm,
  },
  unReaded: {
    color: colors.black,
    fontWeight: 'bold',
  },
});
