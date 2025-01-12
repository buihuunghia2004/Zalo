
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
import { colors } from '../../styles/Ui/colors';
import AppBar from '../../components/Common/AppBar';
import { WINDOW_WIDTH } from '../../utils/Ui/dimensions';
import { Fonts } from '~/styles/Ui/fonts';

const tabs = [
  { id: 0, label: 'Đã nhận', content: 'aaaaaaaa'},
  { id: 1, label: 'Đã gủi', content: 'Nội dung Tab 2' },
 
];

const HandleReqScreen = () => {
  const mainNav = useNavigation<MainNavProp>();
  
  const [activeTab, setActiveTab] = useState(0);

  const tabsPosition = useRef(new Animated.Value(0)).current; 
  const underlinePosition = useRef(new Animated.Value(0)).current; 

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    Animated.timing(underlinePosition, {
      toValue: index * (WINDOW_WIDTH / tabs.length),
      useNativeDriver: true,
      duration: 200,
    }).start();
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
          backgroundColor: colors.secondary_transparent,
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

      </View>
    </View>
  );
};

export default HandleReqScreen;

const styles = StyleSheet.create({
  tabContainer: {
    marginTop: 55,
    flexDirection: 'row',
    borderBottomWidth: 1,
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
    ...textStyle.body_md,
    color: colors.primary,
  },
  underline: {
    position: 'absolute',
    bottom: -1,
    height: 1,
    backgroundColor: colors.primary,
  },
});