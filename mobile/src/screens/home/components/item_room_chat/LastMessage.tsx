import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LastMsg } from '~/features/room/dto/room.dto.nested'
import { MessageContentType } from '~/features/message/dto/message.enum'
import { viewStyle } from '~/styles/Ui/views'
import { textStyle } from '~/styles/Ui/text'

type Props = {
  isGroup: boolean
  unReadCount: number
  lastMessage: LastMsg
}

const LastMessage: React.FC<Props> = ({ isGroup, unReadCount, lastMessage }) => {  
  const user = lastMessage.sender.user
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
            {user.username + ' : '}
            </Text>
        )}

        {lastMessage.type !== MessageContentType.TEXT && (
            <Text style={unReadCount == 0 ? styles.typeRead : styles.typeUnread}>
            {messageTypes[lastMessage.type]}
            </Text>
        )}

        <Text style={unReadCount == 0 ? styles.textRead : styles.textUnread}>
            {lastMessage.content}
        </Text>
      </View>
      {unReadCount !=0 && <Text style={textStyle.Notification}>{unReadCount}</Text>}
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
