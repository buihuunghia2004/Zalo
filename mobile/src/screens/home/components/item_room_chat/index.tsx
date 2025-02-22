import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
import React, {useRef} from 'react';
import {viewStyle} from '~/styles/Ui/views';
import {colors} from '~/styles/Ui/colors';
import {imagesStyle} from '~/styles/Ui/image';
import GroupAvatar from '~/components/Common/GroupAvatar';
import {_GetAllRoomRes} from '~/features/room/dto/room.dto.parent';
import {Room} from '~/features/room/dto/room.dto.nested';
import {_MessageSentRes} from '~/features/message/dto/message.dto.parent';
import LastMessage from './LastMessage';
import {RoomTypeEnum} from '~/features/room/dto/room.enum';
import { textStyle } from '~/styles/Ui/text';
import { calculateElapsedTime, formatToFullDate, formatToHoursMinutes } from '~/utils/Convert/timeConvert';

type Props = {
  room: Room;
  unRead?: {
    message: _MessageSentRes; 
    count: number; 
  };
  onPress?: () => void;
  onLongPress?: (pageY: number) => void;
};

const ItemChatHome: React.FC<Props> = ({
  room,
  onPress,
  onLongPress,
  unRead,
}) => {
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
  return (
    <Pressable
      key={room.id}
      ref={itemRef}
      onLongPress={handleLongPress}
      onPress={onPress}
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

        <View style ={viewStyle.container_row_between}>
          <Text style={[textStyle.body_md, !!unRead && styles.unReaded]}>{room.roomName}</Text>
          <Text style={[styles.textTime, !!unRead && styles.unReaded ]}>{calculateElapsedTime(room.lastMsg.createdAt)}</Text>
        </View>

        <View style ={viewStyle.container_row_between}>
          <LastMessage
            isGroup={room.type == RoomTypeEnum.GROUP}
            unReadCount={unRead?.count ?? 0}
            lastMessage={room.lastMsg}
          />
        </View>
      </View>
    </Pressable>
  );
};

export default ItemChatHome;

const styles = StyleSheet.create({
  container: {
    ...viewStyle.container_row_center,
    gap: 10,
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
    color: colors.black
  }
});
