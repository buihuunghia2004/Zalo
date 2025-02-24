// import React, { useEffect, useRef } from 'react';
// import {
//   Animated,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   View,
// } from 'react-native';

// interface Props {
//   children: React.ReactNode;
// }

// const KeyboardAnimatedWrapper: React.FC<Props> = ({ children }) => {
//   const translateY = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const keyboardShow = Keyboard.addListener(
//       Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
//       (event) => {
//         console.log('Keyboard Show:', event.endCoordinates.height);

//         // Giả lập bàn phím mở chậm bằng setTimeout
//         setTimeout(() => {
//           Animated.timing(translateY, {
//             toValue: -event.endCoordinates.height, // Đẩy UI lên
//             duration: 600, // Tăng thời gian animation để hiệu ứng chậm hơn
//             easing: (t) => t * t, // Làm mượt hơn bằng easing function
//             useNativeDriver: false,
//           }).start();
//         }, 200); // Delay 200ms trước khi chạy animation
//       }
//     );

//     const keyboardHide = Keyboard.addListener(
//       Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
//       () => {
//         console.log('Keyboard Hide');
//         Animated.timing(translateY, {
//           toValue: 0, // Đưa UI về vị trí ban đầu
//           duration: 600, // Tốc độ chậm lại để giả lập hiệu ứng
//           easing: (t) => t * t,
//           useNativeDriver: false, 
//         }).start();
//       }
//     );

//     return () => {
//       keyboardShow.remove();
//       keyboardHide.remove();
//     };
//   }, []);

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={styles.container}
//     >
//       <Animated.View style={[styles.animatedView, { transform: [{ translateY }] }]}>
//         {children}
//       </Animated.View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   animatedView: {
//     flex: 1,
//   },
// });

// export default KeyboardAnimatedWrapper;
