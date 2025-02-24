import { Animated, Image, Text } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeNavigator from './child/HomeNavigator';
import ContactsNavigator from './child/ContactsNavigator';
import DinaryNavigator from './child/DinaryNavigator';
import PersonalNavigator from './child/PersonalNavigator';
import { colors } from '../../styles/Ui/colors';
import { Assets } from '../../styles/Ui/assets';
import { textStyle } from '../../styles/Ui/text';
import { iconSize } from '../../styles/Ui/icons';
import useSocketEvent from '~/hooks/useSocket ';
import { useSelector } from 'react-redux';
import { appSelector } from '~/features/app/appSlice';
import { useRoomStore } from '~/stores/zustand/room.store';
import { useChatStore } from '~/stores/zustand/chat.store';
import { _MessageSentRes } from '~/features/message/dto/message.dto.parent';

type RouteName = 'HomeTab' | 'ContactsTab' | 'DinaryTab' | 'PersonalTab';

const TabNavigator = () => {
  
  const labels: Record<RouteName, string> = {
    HomeTab: 'Tin nhắn',
    ContactsTab: 'Danh bạ',
    DinaryTab: 'Nhật ký',
    PersonalTab: 'Cá nhân',
  };

  const Tab = createBottomTabNavigator();
  const [unreadCount, setUnreadCount] = useState(3);

  const animationRef = useRef(new Animated.Value(0)).current;

  const getTabIcon = (routeName: RouteName, focused: boolean) => {
    const icons: Record<RouteName, any> = {
      HomeTab: focused ? Assets.icons.mess_blue : Assets.icons.mess_gray,
      ContactsTab: focused ? Assets.icons.contacts_blue : Assets.icons.contacts_gray,
      DinaryTab: focused ? Assets.icons.time_blue : Assets.icons.time_gray,
      PersonalTab: focused ? Assets.icons.user_blue : Assets.icons.user_gray,
    };

    return (
      <Animated.View style={focused ? { transform: [{ translateY: animationRef }] } : {}}>
        <Image
          style={[iconSize.medium, {marginTop: 20}]}
          source={icons[routeName]}
        />
        <Text style={[textStyle.Notification, { bottom: 30,left: 15,}]}>{unreadCount}</Text>
      </Animated.View>
    );
  };

  useEffect(() => {
    if (animationRef) {
      Animated.spring(animationRef, {
        toValue: -1,
        friction: 3,
        tension: 40, 
        useNativeDriver: true,
      }).start(() => {
        animationRef.setValue(0); 
      });
    }
  }, [animationRef]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
          paddingTop: 10,
          alignItems: 'center',
        },
        tabBarShowLabel: true,
        tabBarIcon: ({ focused }) => {
          if (focused) {
            animationRef.setValue(0);
            
            Animated.spring(animationRef, {
              toValue: -10,
              friction: 3,
              tension: 40,
              useNativeDriver: true,
            }).start();
          }
          return getTabIcon(route.name as RouteName, focused);
        },
        tabBarLabel: ({ focused }) => {
          return (
            <Text style={{
                fontSize: 10,
                fontWeight: focused ? 'bold' : 'normal',
                color: focused ? colors.primary : colors.gray,
                textAlign: 'center',
              }}
              numberOfLines={1}
            >
              {labels[route.name as RouteName]}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeNavigator} />
      <Tab.Screen name="ContactsTab" component={ContactsNavigator} />
      <Tab.Screen name="DinaryTab" component={DinaryNavigator} />
      <Tab.Screen name="PersonalTab" component={PersonalNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
