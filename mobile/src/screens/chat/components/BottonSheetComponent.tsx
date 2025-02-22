import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Animated,
  Keyboard,
} from 'react-native';
import { Assets } from '~/styles/Ui/assets';
import { colors } from '~/styles/Ui/colors';
import { iconSize } from '~/styles/Ui/icons';
import EmojiList from './EmojiList';

interface BottomSheetProps {
  inputRef: React.RefObject<TextInput>
  inputText: string;
  onTextChange: (text: string) => void;
  onEmojiChange: (text: string) => void
  handleSendMessage: () => void;
}

const BottomSheetComponent: React.FC<BottomSheetProps> = memo(
  ({ inputRef, inputText, onTextChange, onEmojiChange, handleSendMessage }) => {
    const [text, setText] = useState(inputText)
    const [keyboard, setKeyboard] = useState(false);
    const [renderEmojis, setRenderEmojis] = useState(false);
    const scaleIcons = useRef(new Animated.Value(1)).current;
    const scaleSend = useRef(new Animated.Value(0)).current;

    const handleIconPress = useCallback(() => {
      if (!keyboard) {
        setRenderEmojis((prev) => !prev);
      } else {
        Keyboard.dismiss();
        setRenderEmojis(true);
      }
    }, [keyboard]);

    const handleAnimation = useCallback((text: string) => {
      Animated.parallel([
        Animated.timing(scaleIcons, {
          toValue: text ? 0 : 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleSend, {
          toValue: text ? 1 : 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboard(true);
        setRenderEmojis(false);
      });

      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboard(false);
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

    const handleEmojiChange = useCallback((emoji: string) => {   
      setText((prev)=>prev+emoji)   
      onEmojiChange(emoji)
    }, []);

    const handleTextChange = useCallback((newText: string) => {
      setText(newText)
      onTextChange(newText);
      handleAnimation(newText);      
    }, []);

    return (
      <>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.iconButton} onPress={handleIconPress}>
            <Image source={Assets.icons.ghost_gray} style={iconSize.large} />
          </TouchableOpacity>

          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Animated.View style={{ flex: 1 }}>
              <TextInput
                ref={inputRef}
                defaultValue={text}
                onChangeText={handleTextChange}
                placeholder="Tin nhắn"
                placeholderTextColor={colors.gray_icon}
                style={styles.input}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.btnSend,
                { transform: [{ scale: scaleSend }], opacity: scaleSend },
              ]}
            >
              <TouchableOpacity style={styles.iconButton} onPress={handleSendMessage}>
                <Image source={Assets.icons.send_blue} style={iconSize.large} />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[
                styles.btns,
                { transform: [{ scale: scaleIcons }], opacity: scaleIcons },
              ]}
            >
              <TouchableOpacity style={styles.iconButton}>
                <Image source={Assets.icons.menu_row_gray} style={iconSize.large} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Image source={Assets.icons.mic_gray} style={iconSize.large} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Image source={Assets.icons.image_gray} style={iconSize.large} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {renderEmojis && !keyboard && (
          <View style={{ height: 294 }}>
            <EmojiList onEmojisTextChange={handleEmojiChange} />
          </View>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
    paddingRight: 40,
    marginHorizontal: 5,
  },
  btnSend: {
    position: 'absolute',
    right: 0,
    bottom: 5,
  },
  btns: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default BottomSheetComponent;
