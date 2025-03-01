import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import store from '~/stores/redux/store';
import AppRouters from '~/routers/AppNavigator';
import { SocketProvider } from '~/contexts/SocketContext';
import { Text } from 'react-native';

const App = () => {
  console.log('is app run ning');
  
  return (
    <Provider store={store}>
      {/* <SocketProvider namespace="message">  */}
        <GestureHandlerRootView>
          <NavigationContainer>
            <AppRouters />
            {/* <Text>aaaa</Text> */}
          </NavigationContainer>
        </GestureHandlerRootView>
      {/* </SocketProvider> */}
    </Provider>
  );
};

export default App;