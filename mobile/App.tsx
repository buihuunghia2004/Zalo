import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider, useSelector} from 'react-redux';
import store from '~/stores/redux/store';
import AppRouters from '~/routers/AppNavigator';
import ProfilePersonalScreen from '~/screens/personal/ProfilePersonalScreen';
import HandleReqScreen from '~/screens/relation/HandleReqScreen';
import OptionalFriendScreen from '~/screens/relation/OptionalFriendScreen';
import SendAddFriendScreen from '~/screens/relation/SendAddFriendScreen';
import MenuMessDetailModal from '~/components/Common/modal/UModal';

const App = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <NavigationContainer>
          <AppRouters />
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
};
export default App;
