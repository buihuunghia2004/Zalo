import React, {memo, useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Animated,
  Keyboard,
} from 'react-native';
import {Assets} from '~/styles/Ui/assets';
import {colors} from '~/styles/Ui/colors';
import {iconSize} from '~/styles/Ui/icons';
import EmojiList from './EmojiList';
import {textStyle} from '~/styles/Ui/text';

// Định nghĩa type cho props
interface BottomSheetProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleSendMessage: () => void;
  handleInputChange: (text: string) => void;
  inputRef: React.RefObject<TextInput>;
}

const BottomSheetComponent: React.FC<BottomSheetProps> = memo(
  ({
    inputText,
    setInputText,
    handleSendMessage,
    handleInputChange,
    inputRef,
  }) => {
   
    const [keyboard, setKeyboard] = useState<boolean>(false);
    const [renderEmojis, setReanderEmojis] = useState<boolean>(false);
    const scaleIcons = useRef(new Animated.Value(1)).current;
    const scaleSend = useRef(new Animated.Value(0)).current;

    const handleIconPress = (icon: string) => {
      switch (icon) {
        case 'ghost':
          if (!keyboard) {
            setReanderEmojis(true);
          } else {
            Keyboard.dismiss();
            setKeyboard(false);
            setReanderEmojis(true);
          }
          break;

        default:
          break;
      }
    };
    const handleAnimation = (text: string) => {
      if (text === '') {
        Animated.parallel([
          Animated.timing(scaleSend, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleIcons, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(scaleIcons, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleSend, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };
    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
          setKeyboard(true);
          setReanderEmojis(false);
        });
      
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
          setKeyboard(false);
        });
      
        return () => {
          showSubscription.remove();
          hideSubscription.remove();
        };
      }, []);
      
    
    return (
      <>
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleIconPress('ghost')}>
            <Image source={Assets.icons.ghost_gray} style={iconSize.large} />
          </TouchableOpacity>

          <View style={{flex: 1, flexDirection: 'row'}}>
            <Animated.View style={{flex: 1}}>
              <TextInput
                ref={inputRef}
                value={inputText}
                onChangeText={newText => {
                  setInputText(newText);
                  handleAnimation(newText);
                }}
                placeholder="Tin nhắn"
                placeholderTextColor={colors.gray_icon}
                style={styles.input}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.btnSend,
                {transform: [{scale: scaleSend}], opacity: scaleSend},
              ]}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleSendMessage}>
                <Image source={Assets.icons.send_blue} style={iconSize.large} />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[
                styles.btns,
                {transform: [{scale: scaleIcons}], opacity: scaleIcons},
              ]}>
              <TouchableOpacity style={styles.iconButton}>
                <Image
                  source={Assets.icons.menu_row_gray}
                  style={iconSize.large}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Image source={Assets.icons.mic_gray} style={iconSize.large} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Image
                  source={Assets.icons.image_gray}
                  style={iconSize.large}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {renderEmojis && !keyboard && (
          <View style={{height: 294}}>
            <EmojiList
              handleInputChange={text => handleInputChange(text + ' ')}
            />
          </View>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_mess,
  },
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
    paddingHorizontal: 16,
    marginHorizontal: 5,
  },
  contentContainer: {
    width: '100%',
    backgroundColor: colors.white,
    alignItems: 'center',
  },

  itemEmojiContainer: {
    margin: 8,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
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

export default BottomSheetComponent;
