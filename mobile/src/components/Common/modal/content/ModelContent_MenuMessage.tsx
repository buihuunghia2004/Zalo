import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ImageSourcePropType,
  Animated,
  PanResponder,
  Pressable,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {colors} from '~/styles/Ui/colors';
import {Assets} from '~/styles/Ui/assets';
import {textStyle} from '~/styles/Ui/text';
import RNHapticFeedback from 'react-native-haptic-feedback';
import {WINDOW_HEIGHT} from '~/utils/Ui/dimensions';
import {DisplayMessage} from '~/screens/chat/ChatScreen';
import {formatToHoursMinutes} from '~/utils/Convert/timeConvert';
import { _MessageSentReq, _MessageSentRes } from '~/features/message/dto/message.dto.parent';

interface MenuItem {
  key: KeyItemMenu;
  title: string;
  icon: ImageSourcePropType;
}
type Props = {
  pageY: number;
  message?: _MessageSentRes | null;
  onItemPress: (key: KeyItemMenu) => void;
};
export enum KeyItemMenu {
  REPLY = 'reply',
  FORWARD = 'forward',
  SAVE_CLOUD = 'save_cloud',
  RECALL = 'recall',
  COPY = 'copy',
  PIN = 'pin',
  REMINDER = 'reminder',
  MULTI_SELECT = 'multi_select',
  QUICK_MESSAGE = 'quick_message',
  TEXT_READER = 'text_reader',
  DETAILS = 'details',
  DELETE = 'delete',
}


const ModalContent_MenuMessage: React.FC<Props> = ({
  pageY,
  message,
  onItemPress,
}) => {
  const menuItems: MenuItem[] = [
    {
      key: KeyItemMenu.REPLY,
      title: 'Trả lời',
      icon: Assets.icons.reply_message,
    },
    {
      key: KeyItemMenu.FORWARD,
      title: 'Chuyển tiếp',
      icon: Assets.icons.reply_message,
    },
    {
      key: KeyItemMenu.SAVE_CLOUD,
      title: 'Lưu Cloud',
      icon: Assets.icons.reply_message,
    },
    {
      key: KeyItemMenu.RECALL,
      title: 'Thu hồi',
      icon: Assets.icons.reply_message,
    },
    {
      key: KeyItemMenu.COPY,
      title: 'Sao chép',
      icon: Assets.icons.reply_message,
    },
    {key: KeyItemMenu.PIN, title: 'Ghim', icon: Assets.icons.reply_message},
    {
      key: KeyItemMenu.REMINDER,
      title: 'Nhắc hẹn',
      icon: Assets.icons.reply_message,
    },
    {
      key: KeyItemMenu.MULTI_SELECT,
      title: 'Chọn nhiều',
      icon: Assets.icons.reply_message,
    },
    {
      key: KeyItemMenu.QUICK_MESSAGE,
      title: 'Tạo tin nhắn nhanh',
      icon: Assets.icons.reply_message,
    },
    {
      key: KeyItemMenu.TEXT_READER,
      title: 'Đọc văn bản',
      icon: Assets.icons.reply_message,
    },
    {
      key: KeyItemMenu.DETAILS,
      title: 'Chi tiết',
      icon: Assets.icons.reply_message,
    },
    {key: KeyItemMenu.DELETE, title: 'Xóa', icon: Assets.icons.reply_message},
  ];  
  
  // Danh sách emoji
  const emojis = ['❤️', '👍', '😁', '😲', '😭', '😡'];

  // Tạo scale animation cho từng emoji
  const scales = useRef(emojis.map(() => new Animated.Value(1))).current;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Xử lý khi long press
  const handleLongPress = (index: number) => {
    RNHapticFeedback.trigger('impactMedium');
    Animated.timing(scales[index], {
      toValue: 1.8,
      duration: 120,
      useNativeDriver: true,
    }).start();
    setSelectedIndex(index);
  };

  // Xử lý khi kéo qua emoji khác
  const handleMove = (index: number) => {
    RNHapticFeedback.trigger('impactMedium');

    if (selectedIndex !== index) {
      scales.forEach((scale, i) => {
        Animated.timing(scale, {
          toValue: i === index ? 1.8 : 1,
          duration: 120,
          useNativeDriver: true,
        }).start();
      });
      setSelectedIndex(index);
    }
  };

  // Xử lý khi thả tay
  const handleRelease = () => {
    scales.forEach(scale => {
      Animated.timing(scale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }).start();
    });
    setSelectedIndex(null);
  };

  let poistion: any;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const {moveX} = gestureState;
        const index = Math.floor(moveX / 60);
        if (index >= 0 && index < emojis.length) {
          if (poistion != index) {
            handleMove(index);
          }
          poistion = index;
        }
      },
      onPanResponderRelease: handleRelease,
    }),
  ).current;

  const [contentHeight, setContentHeight] = useState(0);
  const menuHeight = (WINDOW_HEIGHT * 48) / 100;
  const itemHeight = 60;
  const tabBarHeight = 50;
  const positionTop =
    contentHeight > pageY
      ? tabBarHeight
      : WINDOW_HEIGHT > pageY + itemHeight + menuHeight
      ? pageY
      : WINDOW_HEIGHT - menuHeight - contentHeight;

  return (
    <View style={[styles.container, {top: positionTop}]}>
      <View
          onLayout={event => {
            const {height} = event.nativeEvent.layout;
            setContentHeight(height);
          }}
          style={{
            gap: 10,
            minHeight: 60,
            flexDirection: 'row',
            justifyContent: message?.isSelfSent ? 'flex-end' : 'flex-start',
          }}>
          {!message?.isSelfSent && (
            <Image
              style={styles.avatar}
              source={{uri: message?.sender?.user.avatarUrl}}
            />
          )}
          <View
            style={{
              padding: 10,
              borderRadius: 10,
              paddingHorizontal: 8,
              marginBottom: 8,
              backgroundColor: message?.isSelfSent
                ? colors.primary_light
                : colors.white,
            }}>
            <Text style={[styles.message]}>{message?.content}</Text>
            <Text
              style={[textStyle.body_xs, {maxWidth: '80%', minWidth: '18%'}]}>
              {message?.createdAt
                ? formatToHoursMinutes(message.createdAt.toString())
                : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Dãy emoji với animation */}
        <View style={styles.emojiContainer} {...panResponder.panHandlers}>
          {emojis.map((emoji, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.emoji,
                {
                  transform: [
                    {scale: scales[index]},
                    {
                      translateY: scales[index].interpolate({
                        inputRange: [1, 1.8],
                        outputRange: [0, -10], // Đẩy xuống 10px để bù lại hiệu ứng phóng lên
                      }),
                    },
                  ],
                },
              ]}
              onLongPress={() => handleLongPress(index)}>
              {emoji}
            </Animated.Text>
          ))}
        </View>

        {/* Danh sách menu */}
        <View style={styles.menuContainer}>
          <FlatList
            data={menuItems}
            renderItem={({item}) => (
              <Pressable
                onPress={() => onItemPress?.(item.key)}
                style={styles.item}>
                <Image source={item.icon} style={styles.icon} />
                <Text style={[textStyle.body_sm, {textAlign: 'center'}]}>
                  {item.title}
                </Text>
              </Pressable>
            )}
            keyExtractor={item => item.key}
            numColumns={4}
            contentContainerStyle={styles.grid}
          />
        </View>
    </View>
  );
};

export default ModalContent_MenuMessage;

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginHorizontal: 10,
    backgroundColor: colors.transparent,
  },
  message: {
    ...textStyle.body_lg,
  },
  bottomContainer: {
    flex: 1,
    gap: 10,
    paddingHorizontal: 10,
  },
  emojiContainer: {
    maxHeight: 60,
    minHeight: 50,
    backgroundColor: colors.white,
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  emoji: {
    fontSize: 28,
    marginTop: 6,
    height: '100%',
    textAlign: 'center',
    flex: 1,
  },
  menuContainer: {
    width: '100%',
    height: 260,
    backgroundColor: colors.white,
    borderRadius: 20,
    marginTop: 10
  },
  grid: {
    padding: 10,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    height: 70,
    marginTop: 10,
  },
  icon: {
    width: 26,
    height: 26,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 40,
  },
});
