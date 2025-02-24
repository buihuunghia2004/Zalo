import {StyleSheet, Text, View} from 'react-native';
import React, { useState } from 'react';
import { textStyle } from '~/styles/Ui/text';
import { colors } from '~/styles/Ui/colors';
import useSocketEvent from '~/hooks/useSocket ';

interface WritingSocket{
    memberId:string,
    status: boolean
}
const StatusChat = () => {
  const [statusChat, setStatusChat] = useState(false)

   useSocketEvent<WritingSocket>({
      event: `writing_message`,
      callback: (result) => {      
        console.log('writing', result);
        if (result.status) {
            setStatusChat(true)
        }else {
            setStatusChat(false)
        }
      },
    });
    
  return (
    <>{statusChat && <Text style={styles.isChating}>Đang soạn tin...</Text>}</>
  );
};

export default StatusChat;

const styles = StyleSheet.create({
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
