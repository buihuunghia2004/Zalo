import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  Animated,
  Text,
  FlatList,
  Pressable,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {MainNavProp, MainStackParamList} from '../../routers/types';
import {colors} from '../../styles/Ui/colors';
import {Assets} from '../../styles/Ui/assets';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import ItemMessage from './components/ItemMessage';
import AppBar from '../../components/Common/AppBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/Ui/dimensions';
import { iconSize } from '../../styles/Ui/icons';
import EmojiList from './components/EmojiList';

type ChatScreenProps = {
  route: RouteProp<MainStackParamList, 'ChatScreen'>;
};

type SourceMessageType = 'time' | 'action' | 'me' | 'people';

type MessageType =
  | 'text'
  | 'image'
  | 'file'
  | 'video'
  | 'location'
  | 'call_send'
  | 'call_receive'
  | 'call_missed'
  | 'video_send'
  | 'video_receive'
  | 'video_missed';

interface Message {
  id: string;
  data: string;
  type: MessageType;
  source: SourceMessageType;
  time: string;
  emojis?: string[];
  emojisCount?: number;
  recall: boolean;
}
type DisplayMessage = Message & {
  isDisplayTime?: boolean;
  isDisplayHeart?: boolean;
  isDisplayAvatar?: boolean;
  isDisplayStatus?: boolean
};

const initMessages: Message[] = [
  {
    id: '0',
    data: '08:25 Hôm nay',
    type: 'text',
    source: 'time',
    time: '12:00',
    recall: false,
  },
  {
    id: '1',
    data: 'Nghĩa được bạn thêm vào nhóm',
    type: 'text',
    source: 'action',
    time: '12:00',
    recall: false,
  },
  {
    id: '2',
    data: 'Huu Nhan đep',
    type: 'text',
    source: 'me',
    time: '12:00',
    recall: false,
  },
  {
    id: '3',
    data: 'thấy sao',
    type: 'text',
    source: 'me',
    time: '12:00',
    recall: false,
  },
  {
    id: '4',
    data: 'Uk đúng rôi',
    type: 'text',
    source: 'people',
    time: '12:00',
    recall: false,
  },
  {
    id: '5',
    data: 'đẹp nhất luôn',
    type: 'text',
    source: 'people',
    time: '12:00',
    recall: false,
  },
  {
    id: '6',
    data: 'cảm ơn',
    type: 'text',
    source: 'people',
    time: '12:00',
    emojis: ['3_😤', '1_😁', '2_😴', '5_😠'],
    emojisCount: 11,
    recall: false,
  },
  {
    id: '7',
    data: 'cảm ơn',
    type: 'text',
    source: 'people',
    time: '12:00',
    emojis: [],
    emojisCount: 11,
    recall: false,
  },
];

const ChatScreen: React.FC<ChatScreenProps> = ({route}) => {
  const {id} = route.params;
  const mainNav = useNavigation<MainNavProp>();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList<Message>>(null);

  const [messages, setMessages] = useState<Message[]>(initMessages);
  const [sheetIndex, setSheetIndex] = useState<number>(0);
  const [keyboard, setKeyboard] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [renderEmojis, setReanderEmojis] = useState<boolean>(false);

  const scaleIcons = useRef(new Animated.Value(1)).current;
  const scaleSend = useRef(new Animated.Value(0)).current;


  const handleInputChange = useCallback((text: string) => {
    setInputText((prevText) => prevText + text); 
    handleAnimation(text);
  }, []);
  
  const handleSheetChanges = useCallback((index: number) => {
    setSheetIndex(index);
  }, []);

  const handleAnimation=(text : string)=>{
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
        })
      ]).start()
     
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
        })
      ]).start()
    }
  }

  const handleIconPress = (icon: string) => {    
    setReanderEmojis(true);
    switch (icon) {
      case 'ghost':
        if (sheetIndex === 0) {
          if (!keyboard) {
            setSheetIndex(1);
            bottomSheetRef.current?.expand(); // Mở sheet
          } else {
            Keyboard.dismiss();
            setSheetIndex(1);
          }
        } else {
          if (inputRef.current) {
            inputRef.current.focus();
            bottomSheetRef.current?.close(); // Đóng sheet
            setSheetIndex(0);
          }
        }
        break;

      default:
        break;
    }
  };

  const handleSendMessage = () =>{
    const newMessage: Message = {
      id: Date.now().toString(), 
      type: 'text', 
      data: inputText, 
      time: new Date().toString(),
      source: 'me',
      emojis: [],
      emojisCount: 0, 
      recall: false
    };
    
    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 0);
  }

  const handleInputPress = () => {
    setKeyboard(true);
    setSheetIndex(0);
  };

  const messagesDisplay: DisplayMessage[] = React.useMemo(() => {
    return messages.map((message, index, array) => ({
      ...message,
      isDisplayTime:
        index === array.length - 1 ||
        (message.source !== array[index + 1]?.source &&
          message.source !== 'time' &&
          message.source !== 'action'),
      isDisplayHeart:
        message.source === 'people' &&
        message.source !== array[index + 1]?.source,
      isDisplayAvatar:
        message.source === 'people' &&
        (index === 0 || array[index - 1]?.source !== 'people'),
      isDisplayStatus:
          message.source === 'me' && index === array.length - 1
    }));
  }, [messages]);

  const RenderItem: React.FC<any> = React.memo(({ item, onPress }) => {
    console.log(`Rendering item: ${item.id}`);
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          width: 48,
          height: 48,
          alignItems: 'center',
          borderRadius: 50,
          backgroundColor: pressed ? 'rgba(24, 157, 252, 0.1)' : 'transparent',
          justifyContent: 'center',
        })}
      >
        <Text style={{ fontSize: 22 }}>{item.image}</Text>
      </Pressable>
    );
  });
  
  return (
    <View style={styles.container}>
      {/* AppBar */}
      <AppBar
        title="Bui Huu Nhân"
        description="1 giờ trước"
        iconButtonLeft={['back']}
        iconButtonRight={['call', 'video_call', 'menu']}
        onChangeInputText={text => console.log('Input changed:', text)}
        onPress={action => {
          switch (action) {
            case 'back':
              mainNav.goBack();
              break;
          }
        }}
        style={{backgroundColor: colors.primary}}
      />

      {/* Content */}
      <View style={{flex: 1, marginBottom: 50}}>
      <FlatList
        ref={flatListRef}
        data={messagesDisplay}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: DisplayMessage }) => (
          <ItemMessage
            id={item.id}
            data={item.data}
            source={item.source}
            type={item.type}
            time={item.time}
            emojis={item.emojis}
            isDisplayTime={item.isDisplayTime}
            isDisplayHeart={item.isDisplayHeart}
            isDisplayAvatar={item.isDisplayAvatar}
            isDisplayStatus= {item.isDisplayStatus}
          />
        )}
        contentContainerStyle={{paddingHorizontal: 10}}
      />
      </View>

      {/* BottomSheet */}
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={[WINDOW_WIDTH / 7.2, WINDOW_HEIGHT / 2.075]}
        index={sheetIndex}
        handleComponent={() => null}
        enableContentPanningGesture={false} 
      >
        <BottomSheetView style={styles.contentContainer}>
          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleIconPress('ghost')}>
              <Image
                source={Assets.icons.ghost_gray}
                style={iconSize.large}
              />
            </TouchableOpacity>

            <View style={{flex: 1, flexDirection: 'row'}}>
              <Animated.View style={{flex: 1}}>
                <TextInput
                  ref={inputRef}
                  value={inputText}
                  onChangeText={(newText)=>{
                    setInputText(newText)
                    handleAnimation(newText);
                  }}
                  onFocus={handleInputPress}
                  placeholder="Tin nhăn"
                  placeholderTextColor={colors.gray_icon}
                  style={styles.input}
                />
              </Animated.View>

              <Animated.View style={[styles.btnSend, {transform: [{scale: scaleSend}], opacity: scaleSend}]}>
                <TouchableOpacity style={styles.iconButton} onPress={handleSendMessage}>
                  <Image source={Assets.icons.send_blue} style={iconSize.large} />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[styles.btns, {transform: [{scale: scaleIcons}], opacity: scaleIcons}]}>
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

        {
          renderEmojis && (
            <EmojiList
              handleInputChange={(text)=>handleInputChange(text+' ')}
            />
          )
        }
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

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
    flex: 1,
    backgroundColor: colors.white,
    margin: 0,
    padding: 0,
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
    flexDirection: 'row'
  }
});

export default ChatScreen;
