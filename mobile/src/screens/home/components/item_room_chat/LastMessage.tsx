import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MessageContentType } from '~/features/message/dto/message.enum'
import { viewStyle } from '~/styles/Ui/views'
import { textStyle } from '~/styles/Ui/text'
import { RoomItemView } from '~/database/dto/room.dto'
import { RoomTypeEnum } from '~/features/room/dto/room.enum'

type Props = {
  room: RoomItemView
}

const LastMessage: React.FC<Props> = ({room}) => {  
  const  isGroup = (room.type == RoomTypeEnum.GROUP)
  const messageTypes: Record<MessageContentType, string> = {
    [MessageContentType.TEXT]: "[Text]",
    [MessageContentType.IMAGE]: "[Image]",
    [MessageContentType.VIDEO]: "[VIDEO]",
    [MessageContentType.VOICE]: "[VOICE]",
    [MessageContentType.FILE]: "[FILE]",
  };

  return (
    <View style={styles.container}>
      <View style={viewStyle.container_row}>
        {isGroup && (
            <Text style={styles.username}>
            {room.lastMsgSenderName + ' : '}
            </Text>
        )}

        {room.lastMsgType && room.lastMsgType !== MessageContentType.TEXT && (
            <Text style={room.unreadCount == 0 ? styles.typeRead : styles.typeUnread}>
            {messageTypes[room.lastMsgType]}
            </Text>
        )}

        <Text style={room.unreadCount == 0 ? styles.textRead : styles.textUnread}>
            {room.lastMsgContent}
        </Text>
      </View>
      {room.unreadCount !=0 && <Text style={textStyle.Notification}>{room.unreadCount}</Text>}
    </View>
  )
}

export default LastMessage

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  typeRead: {
    color: 'gray',
    marginRight: 4,
  },
  typeUnread: {
    color: 'black',
    marginRight: 4,
    fontWeight: 'bold',
  },
  textRead: {
    color: 'gray',
  },
  textUnread: {
    color: 'black',
    fontWeight: 'bold',
  },
});
