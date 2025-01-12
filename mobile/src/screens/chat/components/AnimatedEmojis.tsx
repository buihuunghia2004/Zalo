import { useEffect, useRef, useMemo } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { WINDOW_HEIGHT } from '../../../utils/Ui/dimensions';

type AnimationEmojiProps = {
  emoji: string;
  id: string;
  onCompleteAnimation: (id: string) => void;
};

const AnimatedEmojis = ({ emoji, id, onCompleteAnimation }: AnimationEmojiProps) => {
  const animatedValueY = useRef(new Animated.Value(0)).current;
  const animatedValueX = useRef(new Animated.Value(0)).current;

  // Chỉ tính toán ngẫu nhiên một lần
  const randomX = useMemo(() => Math.random() * 60 - 20, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedValueY, {
        toValue: -WINDOW_HEIGHT,
        duration: 4000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValueX, {
        toValue: randomX,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onCompleteAnimation(id);
    });
  }, []);

  return (
    <Animated.Text
      style={[
        styles.emoji,
        {
          transform: [
            {
              translateY: animatedValueY.interpolate({
                inputRange: [-WINDOW_HEIGHT, -30, 0],
                outputRange: [-WINDOW_HEIGHT, -80, 0],
              }),
            },
            {
              translateX: animatedValueX,
            },
            {scale: animatedValueY.interpolate({
              inputRange: [-100,-10, 0],
              outputRange: [1,0.6, 0],
              extrapolate: 'clamp'
            })}
          ],
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  emoji: {
    position: 'absolute',
    right: -10,
    top: -40,
    fontSize: 15,
  },
});

export default AnimatedEmojis;
