import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import store from '~/redux/store'
import AppRouters from '~/routers/AppNavigator'
import ProfilePersonalScreen from '~/screens/personal/ProfilePersonalScreen';
import HandleReqScreen from '~/screens/relation/HandleReqScreen';
import OptionalFriendScreen from '~/screens/relation/OptionalFriendScreen';
import SendAddFriendScreen from '~/screens/relation/SendAddFriendScreen';

const App = () => {

  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <NavigationContainer>
        <AppRouters/>
        {/* <SendAddFriendScreen/> */}
        {/* <OptionalFriendScreen/> */}
          {/* <ProfilePersonalScreen/> */}
          {/* <SendAddFriendScreen/> */}
          {/* <HandleReqScreen/> */}
          {/* <OptionalFriendScreen/> */}
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
};
export default App;
