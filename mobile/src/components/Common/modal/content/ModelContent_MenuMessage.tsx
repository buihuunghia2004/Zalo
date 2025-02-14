import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ImageSourcePropType,
  Animated,
  PanResponder,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {colors} from '~/styles/Ui/colors';
import {Assets} from '~/styles/Ui/assets';
import {textStyle} from '~/styles/Ui/text';
import RNHapticFeedback from 'react-native-haptic-feedback';

interface MenuItem {
  id: string;
  title: string;
  icon: ImageSourcePropType;
}

const ModalContent_MenuMessage: React.FC = () => {
  const menuItems: MenuItem[] = [
    {id: '1', title: 'Trả lời', icon: Assets.icons.reply_message},
    {id: '2', title: 'Chuyển tiếp', icon: Assets.icons.reply_message},
    {id: '3', title: 'Lưu Cloud', icon: Assets.icons.reply_message},
    {id: '4', title: 'Thu hồi', icon: Assets.icons.reply_message},
    {id: '5', title: 'Sao chép', icon: Assets.icons.reply_message},
    {id: '6', title: 'Ghim', icon: Assets.icons.reply_message},
    {id: '7', title: 'Nhắc hẹn', icon: Assets.icons.reply_message},
    {id: '8', title: 'Chọn nhiều', icon: Assets.icons.reply_message},
    {id: '9', title: 'Tạo tin nhắn nhanh', icon: Assets.icons.reply_message},
    {id: '10', title: 'Đọc văn bản', icon: Assets.icons.reply_message},
    {id: '11', title: 'Chi tiết', icon: Assets.icons.reply_message},
    {id: '12', title: 'Xóa', icon: Assets.icons.reply_message},
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
      duration: 200,
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
          duration: 200,
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
        duration: 200,
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

  return (
    <>
      <View style={styles.modalContainer}>
        <Text>aaaaa</Text>
      </View>

      <View style={styles.bottomContainer}>
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
              <View style={styles.item}>
                <Image source={item.icon} style={styles.icon} />
                <Text style={[textStyle.body_sm, {textAlign: 'center'}]}>
                  {item.title}
                </Text>
              </View>
            )}
            keyExtractor={item => item.id}
            numColumns={4}
            contentContainerStyle={styles.grid}
          />
        </View>
      </View>
    </>
  );
};

export default ModalContent_MenuMessage;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 10,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomContainer: {
    height: '55%',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    gap: 10,
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
    backgroundColor: colors.white,
    borderRadius: 20,
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
});
