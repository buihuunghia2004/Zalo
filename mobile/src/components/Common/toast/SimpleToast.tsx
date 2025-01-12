import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface ToastProps {
  message: string;
  duration?: number; 
  position?: 'top' | 'bottom'; 
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, position = 'bottom' }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, 
      duration: 500, 
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

   
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0, // Ẩn Toast
        duration: 500, // Thời gian fade-out
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }, duration);

    // Dọn dẹp bộ đếm thời gian
    return () => clearTimeout(timer);
  }, [fadeAnim, duration]);

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { bottom: position === 'bottom' ? 50 : undefined, top: position === 'top' ? 50 : undefined },
        { opacity: fadeAnim },
      ]}
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        marginHorizontal: 20,
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
        opacity: 0.8,
        zIndex: 10,
      },
  toastText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Toast;
