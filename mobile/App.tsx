import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import store from '~/stores/redux/store';
import AppRouters from '~/routers/AppNavigator';

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
