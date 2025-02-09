import React, { useRef } from 'react';
import { Animated } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FriendTab from './FriendTab';
import GroupTab from './GroupTab';

const Tab = createMaterialTopTabNavigator();

const ContactsTabNavigation = () => {
  
    const tabsPosition = useRef(new Animated.Value(45)).current;
    const lastScrollY = useRef(0);
    const isAnimating = useRef(false);

     const startAnimation = (newPosition: number) => {
        isAnimating.current = true;
    
        Animated.timing(tabsPosition, {
          toValue: newPosition || 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          isAnimating.current = false;
        });
      };

      const handleScroll = (y: number) => {
        let newPosition: any;
    console.log(y);
    
        if (y === 0) {
          newPosition = 45;
        } else if (y > 60) {
          newPosition = y > lastScrollY.current ? 0 : 45;
        }
    
        if (isAnimating.current) {
          if (newPosition === 45) {
            setTimeout(() => {
              if (!isAnimating.current) {
                startAnimation(newPosition);
              }
            }, 300);
          }
          return;
        }
    
        if (newPosition !== tabsPosition) {
          startAnimation(newPosition);
        }
        lastScrollY.current = y;
      };
  return (  
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
            transform: [{ translateY: tabsPosition }],
          },
        swipeEnabled: false,
      }}
    >
      <Tab.Screen name="Bạn bè">
        {(props) => (
          <FriendTab {...props} onScrollY={handleScroll} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Nhóm">
        {(props) => (
          <GroupTab {...props} onScrollY={handleScroll} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default ContactsTabNavigation;
