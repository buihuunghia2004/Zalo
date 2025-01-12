import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { MainNavProp } from '../../routers/types';
import AppBar from '../../components/Common/AppBar';

const SearchScreen = () => {

  const mainNav = useNavigation<MainNavProp>();

  return (
    <View>
         <AppBar
          iconButtonLeft={['back']}
          iconButtonRight={['setting']}
          inputSearch = {true}

          onChangeInputText={(text) => console.log('Input changed:', text)} 

          onPressInput={() => console.log('Input button pressed')}

          onPress={(action) => {
            if (action === 'back') {
              mainNav.goBack();
            }
          }}
        />
      <Text>SearchScreen</Text>
    </View>
  )
}

export default SearchScreen