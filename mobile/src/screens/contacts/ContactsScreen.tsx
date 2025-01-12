import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {MainNavProp } from '~/routers/types';
import { useNavigation } from '@react-navigation/native';
import { textStyle } from '../../styles/Ui/text';
import FriendTab from './tab/FriendTab';
import { colors } from '../../styles/Ui/colors';
import AppBar from '../../components/Common/AppBar';
import { WINDOW_WIDTH } from '../../utils/Ui/dimensions';
import { Fonts } from '~/styles/Ui/fonts';

const tabs = [
  { id: 0, label: 'Bạn bè', content: <FriendTab /> },
  { id: 1, label: 'Nhóm', content: 'Nội dung Tab 2' },
  { id: 2, label: 'QA', content: 'Nội dung Tab 3' },
];

const ContactsScreen = () => {
  const mainNav = useNavigation<MainNavProp>();
  
  const [activeTab, setActiveTab] = useState(0);

  const tabsPosition = useRef(new Animated.Value(0)).current; 
  const underlinePosition = useRef(new Animated.Value(0)).current; 
  const lastScrollY = useRef(0);
  const isAnimating = useRef(false); 

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    Animated.timing(underlinePosition, {
      toValue: index * (WINDOW_WIDTH / tabs.length),
      useNativeDriver: true,
      duration: 200,
    }).start();
  };

  // Hàm xử lý cuộn trang
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { y } = event.nativeEvent.contentOffset;

    if (isAnimating.current) return; 

    let newPosition
    if (y === 0) {
      newPosition = 0;
    } else if (y > 60) {
      newPosition = y > lastScrollY.current ? -50 : 0;
    }
  
    
    // Nếu vị trí thay đổi, thực hiện animation
    if (newPosition !== tabsPosition._value) { 
      isAnimating.current = true;

      Animated.timing(tabsPosition, {
        toValue: newPosition || 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        isAnimating.current = false; 
      });
    }

    lastScrollY.current = y;
  };

  return (
    <View style={{ flex: 1 }}>
      <AppBar
        iconButtonLeft={['search']}
        iconButtonRight={['add_friend']}
        inputSearch={false}
        onPressInput={() => mainNav.navigate('SearchScreen')}
        onPress={() =>     mainNav.navigate('AddFriendScreen')}
        style={{
          backgroundColor: colors.primary,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 5,
        }}
      />

      <View style={{ flex: 1 }}>
        {/* Tabs */}
        <Animated.View
          style={[styles.tabContainer, { transform: [{ translateY: tabsPosition }]}]}
        >
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              style={styles.tab}
              onPress={() => handleTabPress(tab.id)}
            >
              <Text
                style={[
                
                  activeTab === tab.id && styles.activeText,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
          <Animated.View
            style={[
              styles.underline,
              {
                transform: [{ translateX: underlinePosition }],
                width: WINDOW_WIDTH / tabs.length,
              },
            ]}
          />
        </Animated.View>

        {/* Content */}
        <ScrollView
          style={{ backgroundColor: 'red' }}
          onScroll={handleScroll}
          scrollEventThrottle={16} // Điều chỉnh độ mượt của sự kiện scroll
        >
          {tabs[activeTab]?.content}
        </ScrollView>
      </View>
    </View>
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({
  tabContainer: {
    marginTop: 55,
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderColor: colors.gray_light,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  activeText: {
    fontWeight: 'bold',
    fontFamily: Fonts.roboto.regular,
    color: colors.primary,
  },
  underline: {
    position: 'absolute',
    bottom: -1,
    height: 2,
    backgroundColor: colors.primary,
  },
});